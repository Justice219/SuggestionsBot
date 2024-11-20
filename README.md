# Discord Suggestions Bot 🤖

A feature-rich Discord bot that manages server suggestions with categories, voting, and moderation capabilities.

## Features ✨

- **Category-based Suggestions**: Organize suggestions into different categories (Features, Bugs, Improvements)
- **Interactive UI**: Uses Discord's buttons and modals for a seamless user experience
- **Voting System**: Members can upvote or downvote suggestions
- **Moderation Tools**: Staff can accept or deny suggestions with reasons
- **Status Tracking**: Clear visual indicators for pending, accepted, and denied suggestions
- **Channel Organization**: Each category can have its own dedicated channel

## Commands 🛠️

- `/suggest` - Start the suggestion creation process
- `/accept-suggestion <message_id> [reason]` - Accept a suggestion (Requires Manage Messages permission)
- `/deny-suggestion <message_id> [reason]` - Deny a suggestion (Requires Manage Messages permission)

## Setup Guide 📝

1. **Prerequisites**
   ```bash
   # Node.js 16.9.0 or higher is required
   npm install
   ```

2. **Configuration**
   - Create a `.env` file in the root directory:
   ```env
   TOKEN=your_bot_token
   CLIENT_ID=your_client_id
   ```
   
   - Update `config/suggestions.js` with your channel IDs:
   ```javascript
   module.exports = {
       categories: [
           {
               name: 'Features',
               channelId: 'YOUR_CHANNEL_ID',
               emoji: '💡'
           },
           // ... other categories
       ]
   };
   ```

3. **Deploy Commands**
   ```bash
   npm run deploy
   ```

4. **Start the Bot**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

## Usage Examples 💡

1. **Creating a Suggestion**
   - Use `/suggest` command
   - Select a category from the dropdown menu
   - Fill in the suggestion title and description in the modal
   - The suggestion will be posted in the appropriate channel

2. **Voting on Suggestions**
   - Click the 👍 button to upvote
   - Click the 👎 button to downvote
   - Vote counts are displayed in the suggestion embed

3. **Managing Suggestions**
   - Use `/accept-suggestion` or `/deny-suggestion` with the message ID
   - Optionally provide a reason for the decision
   - The suggestion will be updated with the new status and reason

## Embed Format 📋

Suggestions are displayed with:
- Author information
- Title and description
- Category and status
- Vote counts
- Timestamp
- Suggestion ID
- Acceptance/denial information (when applicable)

## Technical Details 🔧

- Built with Discord.js v14
- Uses Discord's latest interaction features
- Implements command handling system
- Event-based architecture
- Environment variable configuration
- Development mode with nodemon

## File Structure 📁 
```bash
suggestions-bot/
├── commands/
│ ├── suggest.js
│ └── suggestion-manage.js
├── config/
│ └── suggestions.js
├── events/
│ └── interactionCreate.js
├── .env
├── .gitignore
├── deploy-commands.js
├── index.js
├── package.json
└── README.md
```


## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

This project is licensed under the MIT License - see the LICENSE file for details.

## Support 💬

If you need help or have questions:
1. Open an issue in the repository
2. Contact the bot developer
3. Check the Discord.js documentation

## Credits 👏

Built with:
- [Discord.js](https://discord.js.org/)
- [Node.js](https://nodejs.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [nodemon](https://nodemon.io/)
