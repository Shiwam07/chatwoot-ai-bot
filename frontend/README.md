# Chatwoot AI Bot Frontend

A simple React frontend that integrates with Chatwoot to provide AI-powered customer support.

## Features

- **Chatwoot Widget Integration**: Embedded chat widget for customer interactions
- **AI-Powered Responses**: Backend processes messages through OpenAI GPT
- **Simple Interface**: Clean, minimal UI focused on the chat experience
- **Real-time Messaging**: Instant communication with customers

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the frontend directory:

```bash
# Chatwoot Configuration
REACT_APP_CHATWOOT_WEBSITE_TOKEN=your_chatwoot_website_token_here
REACT_APP_CHATWOOT_BASE_URL=https://app.chatwoot.com

# API Configuration
REACT_APP_API_URL=http://localhost:3001
```

### 3. Get Chatwoot Website Token

1. Go to your Chatwoot dashboard
2. Navigate to Inbox Settings → Integrations → Website Widget
3. Copy the website token

### 4. Start the Application

```bash
npm start
```

The application will start on `http://localhost:3000`

## How It Works

1. Customer visits your website
2. Chatwoot widget appears in the bottom-right corner
3. Customer sends a message through the widget
4. Message is sent to Chatwoot
5. Chatwoot webhook triggers your backend
6. Backend processes message through AI
7. AI response is sent back to Chatwoot
8. Response appears in the conversation

## Components

- **App.tsx**: Main application component
- **ChatwootWidget.tsx**: Chatwoot widget integration
- **ChatwootContext.tsx**: React context for Chatwoot SDK

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_CHATWOOT_WEBSITE_TOKEN` | Your Chatwoot website token | Yes |
| `REACT_APP_CHATWOOT_BASE_URL` | Chatwoot base URL | No (defaults to https://app.chatwoot.com) |
| `REACT_APP_API_URL` | Backend API URL | No (defaults to http://localhost:3001) |

## Backend Integration

This frontend works with the Chatwoot AI Bot backend. Make sure your backend is running on `http://localhost:3001` and properly configured with:

- OpenAI API key
- Chatwoot API token
- Webhook endpoint at `/webhook`

## Troubleshooting

- **Widget not loading**: Check your Chatwoot website token
- **No AI responses**: Ensure backend is running and webhooks are configured
- **Connection issues**: Verify your Chatwoot base URL and API URL
