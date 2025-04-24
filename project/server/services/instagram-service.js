const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Add stealth plugin to avoid detection
puppeteer.use(StealthPlugin());

// Store active sessions (in a real app, use Redis or a database)
const sessions = new Map();

class InstagramService {
  constructor() {
    // Create sessions directory if it doesn't exist
    this.sessionsDir = path.join(__dirname, '../sessions');
    if (!fs.existsSync(this.sessionsDir)) {
      fs.mkdirSync(this.sessionsDir, { recursive: true });
    }
  }

  async login(username, password) {
    const sessionId = uuidv4();
    const userDataDir = path.join(this.sessionsDir, sessionId);
    
    // Launch browser with user data directory for session persistence
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
      ],
      userDataDir
    });

    try {
      const page = await browser.newPage();
      
      // Set user agent to avoid detection
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      );

      // Navigate to Instagram
      await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' });
      
      // Accept cookies if the dialog appears
      try {
        await page.waitForSelector('button[tabindex="0"]', { timeout: 5000 });
        const buttons = await page.$$('button[tabindex="0"]');
        if (buttons.length > 0) {
          await buttons[0].click();
          await page.waitForTimeout(1000);
        }
      } catch (e) {
        // Cookie dialog may not appear, continue
      }

      // Fill in login form
      await page.waitForSelector('input[name="username"]');
      await page.type('input[name="username"]', username, { delay: 50 });
      await page.type('input[name="password"]', password, { delay: 50 });
      
      // Click login button
      await page.waitForSelector('button[type="submit"]');
      await page.click('button[type="submit"]');

      // Wait for navigation after login
      try {
        // Check for login errors
        await page.waitForSelector('[role="alert"]', { timeout: 5000 });
        const errorMsg = await page.$eval('[role="alert"]', el => el.textContent);
        await browser.close();
        return { success: false, message: errorMsg || 'Login failed' };
      } catch (e) {
        // No error message found, login might be successful
      }

      // Check for two-factor authentication
      try {
        await page.waitForSelector('input[name="verificationCode"]', { timeout: 5000 });
        await browser.close();
        return { success: false, message: 'Two-factor authentication is required but not supported by this bot' };
      } catch (e) {
        // No 2FA required, continue
      }

      // Check if we're logged in by looking for the home icon
      try {
        await page.waitForSelector('svg[aria-label="Home"]', { timeout: 10000 });
      } catch (e) {
        await browser.close();
        return { success: false, message: 'Login failed. Please check your credentials.' };
      }

      // Store session
      sessions.set(sessionId, { browser, username });
      
      return { 
        success: true, 
        sessionId,
        username
      };
    } catch (error) {
      console.error('Login error:', error);
      
      // Close browser on error
      await browser.close();
      
      // Clean up session directory
      try {
        fs.rmdirSync(userDataDir, { recursive: true });
      } catch (e) {
        console.error('Failed to remove session directory:', e);
      }
      
      return { 
        success: false, 
        message: error.message || 'An error occurred during login' 
      };
    }
  }
  
  async getUsers(targetUsername, type, sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session expired, please login again');
    }
    
    try {
      const { browser } = session;
      const page = await browser.newPage();
      
      // Navigate to user profile
      await page.goto(`https://www.instagram.com/${targetUsername}/`, { waitUntil: 'networkidle2' });
      
      // Check if profile exists and is public
      try {
        await page.waitForSelector('h2', { timeout: 5000 });
        const h2Text = await page.$eval('h2', el => el.textContent);
        if (h2Text.includes('Sorry, this page')) {
          throw new Error('This account doesn\'t exist');
        }
      } catch (e) {
        // No error message found, profile exists
      }
      
      // Check if the profile is private
      try {
        const privateText = await page.$eval('h2', el => el.textContent);
        if (privateText.includes('This Account is Private')) {
          throw new Error('This account is private');
        }
      } catch (e) {
        // Not private or element not found, continue
      }
      
      // Click on followers/following
      const selector = type === 'followers' ? 'a[href$="/followers/"]' : 'a[href$="/following/"]';
      await page.waitForSelector(selector);
      await page.click(selector);
      
      // Wait for modal to open
      await page.waitForSelector('[role="dialog"]');
      
      // Start scrolling to load more users
      const users = [];
      const maxUsers = 100; // Limit for safety
      
      let previousHeight = 0;
      let scrollAttempts = 0;
      const maxScrollAttempts = 10;
      
      while (users.length < maxUsers && scrollAttempts < maxScrollAttempts) {
        // Extract user information
        const newUsers = await page.evaluate(() => {
          const userElements = document.querySelectorAll('[role="dialog"] ul li');
          return Array.from(userElements).map(userEl => {
            try {
              const usernameEl = userEl.querySelector('a');
              const username = usernameEl ? usernameEl.getAttribute('href').replace('/', '') : null;
              
              const nameEl = userEl.querySelector('span');
              const name = nameEl ? nameEl.textContent : '';
              
              return { username, name };
            } catch (e) {
              return null;
            }
          }).filter(user => user && user.username);
        });
        
        // Add new users to our list (avoid duplicates)
        for (const user of newUsers) {
          if (!users.some(u => u.username === user.username)) {
            users.push(user);
          }
        }
        
        // Scroll down to load more
        const currentHeight = await page.evaluate(() => {
          const dialog = document.querySelector('[role="dialog"] ul');
          if (dialog) {
            dialog.scrollTop = dialog.scrollHeight;
            return dialog.scrollHeight;
          }
          return 0;
        });
        
        // If we haven't scrolled, increment attempt counter
        if (currentHeight === previousHeight) {
          scrollAttempts++;
        } else {
          scrollAttempts = 0;
        }
        
        previousHeight = currentHeight;
        
        // Small delay to allow loading
        await page.waitForTimeout(1000);
        
        // Break if we have enough users
        if (users.length >= maxUsers) break;
      }
      
      await page.close();
      
      return users.slice(0, maxUsers);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      throw error;
    }
  }
  
  async sendDirectMessage(recipient, message, sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session expired, please login again');
    }
    
    try {
      const { browser } = session;
      const page = await browser.newPage();
      
      // Navigate to Instagram direct messages
      await page.goto('https://www.instagram.com/direct/inbox/', { waitUntil: 'networkidle2' });
      
      // Click on "New Message" button
      await page.waitForSelector('button[aria-label="New message"]');
      await page.click('button[aria-label="New message"]');
      
      // Wait for recipient search input
      await page.waitForSelector('input[placeholder="Search..."]');
      await page.type('input[placeholder="Search..."]', recipient, { delay: 50 });
      
      // Wait for search results and select the first result
      await page.waitForTimeout(2000); // Wait for search results to load
      
      try {
        // Try to find and click the correct user from search results
        const userSelector = '[role="dialog"] div[role="button"]';
        await page.waitForSelector(userSelector, { timeout: 5000 });
        
        // Get all search results
        const searchResults = await page.$$(userSelector);
        
        // Click the first result (or a more specific one if we can identify it)
        if (searchResults.length > 0) {
          await searchResults[0].click();
        } else {
          throw new Error(`Couldn't find user: ${recipient}`);
        }
      } catch (e) {
        throw new Error(`Error searching for user: ${e.message}`);
      }
      
      // Click "Next" button
      await page.waitForSelector('button[tabindex="0"]');
      const buttons = await page.$$('button[tabindex="0"]');
      
      // Find the "Next" button (usually the last one)
      for (let i = buttons.length - 1; i >= 0; i--) {
        const buttonText = await page.evaluate(el => el.textContent, buttons[i]);
        if (buttonText.includes('Next')) {
          await buttons[i].click();
          break;
        }
      }
      
      // Wait for message input and send message
      await page.waitForSelector('textarea[placeholder]');
      await page.type('textarea[placeholder]', message, { delay: 30 });
      
      // Press Enter to send
      await page.keyboard.press('Enter');
      
      // Wait a bit to ensure message is sent
      await page.waitForTimeout(2000);
      
      await page.close();
      
      return { success: true, message: `Message sent to ${recipient}` };
    } catch (error) {
      console.error('Error sending DM:', error);
      throw error;
    }
  }
  
  async logout(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) {
      return { success: true, message: 'Already logged out' };
    }
    
    try {
      const { browser } = session;
      await browser.close();
      
      // Remove session
      sessions.delete(sessionId);
      
      // Clean up session directory
      const userDataDir = path.join(this.sessionsDir, sessionId);
      try {
        fs.rmdirSync(userDataDir, { recursive: true });
      } catch (e) {
        console.error('Failed to remove session directory:', e);
      }
      
      return { success: true, message: 'Logged out successfully' };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: error.message || 'An error occurred during logout' };
    }
  }
}

module.exports = {
  InstagramService
};