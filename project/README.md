# Instagram DM Bot

A simple, fully functional Instagram mass DM bot with both frontend and backend components, organized in a clean, modular codebase.

## Features

- **Instagram Authentication**: Log in using Instagram credentials
- **Account Targeting**: Extract followers or following lists from any public Instagram account
- **Custom Messaging**: Compose personalized messages with dynamic placeholders
- **Campaign Controls**: Set the number of recipients and delay between messages
- **Real-time Logging**: View detailed logs of all bot activities
- **Safety Features**: Built-in rate limiting to minimize the risk of account restrictions

## Tech Stack

- **Frontend**: React, TailwindCSS, React Router, React Hot Toast
- **Backend**: Node.js, Express
- **Instagram Automation**: Puppeteer with Stealth Plugin

## Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/instagram-dm-bot.git
   cd instagram-dm-bot
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

## Deployment to Render

### Manual Deployment

1. Create a new GitHub repository and push your code.

2. Sign up for a [Render](https://render.com/) account if you don't have one.

3. In the Render dashboard, click "New" and select "Web Service".

4. Connect your GitHub repository.

5. Configure the deployment:
   - **Name**: instagram-dm-bot (or your preferred name)
   - **Environment**: Node
   - **Region**: Choose the closest region to your users
   - **Branch**: main (or your default branch)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Click "Create Web Service" to deploy.

### Automatic Deployment using render.yaml

1. The repository includes a `render.yaml` file for easy deployment.

2. In the Render dashboard, click "New" and select "Blueprint".

3. Connect your GitHub repository.

4. Render will automatically detect the `render.yaml` file and set up the service with the correct configuration.

5. Review the settings and click "Apply" to start the deployment.

## Disclaimer

**Important**: This tool is provided for educational purposes only. Automating Instagram actions may violate Instagram's Terms of Service and could result in limitations or bans on your account. Use responsibly and at your own risk.

## License

MIT