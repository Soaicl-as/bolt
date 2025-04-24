// Define interfaces
interface LoginResponse {
  success: boolean;
  message?: string;
}

interface DMCampaignParams {
  targetAccount: string;
  targetType: 'followers' | 'following';
  message: string;
  recipientCount: number;
  delay: number;
  onLog?: (message: string) => void;
  onError?: (error: Error) => void;
  onProgress?: (current: number, total: number) => void;
  onComplete?: () => void;
}

class DMCampaignEmitter {
  private isRunning = false;
  private params: DMCampaignParams;
  private recipients: string[] = [];
  private currentIndex = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(params: DMCampaignParams) {
    this.params = params;
  }

  async start() {
    this.isRunning = true;
    this.log(`Starting campaign for ${this.params.targetAccount}'s ${this.params.targetType}`);
    
    try {
      // Simulating API call to fetch recipients
      this.log(`Fetching ${this.params.targetType} from ${this.params.targetAccount}...`);
      await this.simulateDelay(2000); // Simulate network delay
      
      // In a real implementation, this would fetch actual users from Instagram
      this.recipients = await this.mockFetchRecipients();
      const totalRecipients = Math.min(this.recipients.length, this.params.recipientCount);
      
      this.log(`Found ${this.recipients.length} accounts, will message ${totalRecipients}`);
      
      // Start sending messages
      this.processBatch();
    } catch (error) {
      this.isRunning = false;
      if (error instanceof Error) {
        this.handleError(error);
      } else {
        this.handleError(new Error('Unknown error occurred'));
      }
    }
  }

  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
    this.log('Campaign stopped');
  }

  private processBatch() {
    if (!this.isRunning || this.currentIndex >= this.params.recipientCount || this.currentIndex >= this.recipients.length) {
      this.isRunning = false;
      this.params.onComplete?.();
      return;
    }

    const recipient = this.recipients[this.currentIndex];
    const personalizedMessage = this.personalizeMessage(recipient);
    
    this.log(`Sending message to @${recipient}...`);
    
    // Simulate sending message (would be an actual API call in production)
    this.simulateDelay(500).then(() => {
      this.log(`Message successfully sent to @${recipient}`);
      this.currentIndex++;
      
      // Update progress
      this.updateProgress(this.currentIndex, Math.min(this.params.recipientCount, this.recipients.length));
      
      // Schedule next message with delay
      this.timer = setTimeout(() => {
        this.processBatch();
      }, this.params.delay * 1000);
    });
  }

  private personalizeMessage(username: string): string {
    // In a real implementation, we would have more user data
    let message = this.params.message;
    message = message.replace(/{username}/g, username);
    message = message.replace(/{first_name}/g, username.split('.')[0]);
    message = message.replace(/{full_name}/g, username.split('.').join(' '));
    return message;
  }

  private async mockFetchRecipients(): Promise<string[]> {
    // Generate random usernames for demonstration
    const usernames = [
      'john.doe', 'jane.smith', 'robert.johnson', 'emily.wilson',
      'michael.brown', 'jessica.taylor', 'david.miller', 'sarah.anderson',
      'james.thomas', 'lisa.jackson', 'daniel.white', 'amanda.harris',
      'matthew.martin', 'stephanie.thompson', 'christopher.garcia', 'nicole.martinez',
      'andrew.robinson', 'elizabeth.clark', 'joshua.rodriguez', 'lauren.lewis',
      'brandon.lee', 'megan.walker', 'tyler.hall', 'samantha.allen',
      'kevin.young', 'rachel.king', 'justin.wright', 'laura.scott',
      'ryan.green', 'heather.baker', 'jason.nelson', 'michelle.carter'
    ];
    
    // Shuffle array to simulate different results each time
    return usernames.sort(() => 0.5 - Math.random());
  }

  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private log(message: string) {
    this.params.onLog?.(message);
  }

  private handleError(error: Error) {
    this.params.onError?.(error);
  }

  private updateProgress(current: number, total: number) {
    this.params.onProgress?.(current, total);
  }
}

// API Functions
export const loginToInstagram = async (username: string, password: string): Promise<LoginResponse> => {
  // In a real implementation, this would make an actual API request to the backend
  // For demo purposes, we'll simulate a successful login with any credentials
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For demonstration, we'll accept any non-empty credentials
  if (username && password) {
    // In production, this would verify credentials against the backend
    return { success: true };
  }
  
  return { success: false, message: 'Invalid username or password' };
};

export const startDmCampaign = (params: DMCampaignParams): DMCampaignEmitter => {
  const campaign = new DMCampaignEmitter(params);
  campaign.start();
  return campaign;
};