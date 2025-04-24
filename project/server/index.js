const express = require('express');
const cors = require('cors');
const path = require('path');
const { InstagramService } = require('./services/instagram-service');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app in production
app.use(express.static(path.join(__dirname, '../dist')));

// Create Instagram service instance
const instagramService = new InstagramService();

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }
    
    const result = await instagramService.login(username, password);
    res.json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'An error occurred during login' 
    });
  }
});

// Get followers/following endpoint
app.get('/api/users/:username/:type', async (req, res) => {
  try {
    const { username, type } = req.params;
    const { sessionId } = req.headers;
    
    if (!sessionId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    if (type !== 'followers' && type !== 'following') {
      return res.status(400).json({ success: false, message: 'Type must be either followers or following' });
    }
    
    const users = await instagramService.getUsers(username, type, sessionId);
    res.json({ success: true, users });
  } catch (error) {
    console.error(`Error fetching ${req.params.type}:`, error);
    res.status(500).json({ 
      success: false, 
      message: error.message || `Failed to fetch ${req.params.type}` 
    });
  }
});

// Send DM endpoint
app.post('/api/send-dm', async (req, res) => {
  try {
    const { recipient, message } = req.body;
    const { sessionId } = req.headers;
    
    if (!sessionId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    
    if (!recipient || !message) {
      return res.status(400).json({ success: false, message: 'Recipient and message are required' });
    }
    
    const result = await instagramService.sendDirectMessage(recipient, message, sessionId);
    res.json(result);
  } catch (error) {
    console.error('Error sending DM:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send message' 
    });
  }
});

// In production, serve the frontend for any request not handled above
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app; // For testing