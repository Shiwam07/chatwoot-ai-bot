# Chatwoot AI Bot Backend

A simplified backend service that integrates Chatwoot with OpenAI's GPT model to provide AI-powered customer support responses.

## Features

- **Chatwoot Webhook Integration**: Receives messages from Chatwoot and processes them through AI
- **OpenAI Integration**: Uses GPT-3.5-turbo to generate intelligent responses
- **Automatic Response**: Sends AI-generated responses back to Chatwoot conversations
- **Message Filtering**: Prevents infinite loops by filtering out bot messages and private notes

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Variables

Create a `.env` file in the backend directory:

```bash
# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Chatwoot Configuration
CHATWOOT_API_TOKEN=your_chatwoot_api_token_here
CHATWOOT_ACCOUNT_ID=your_chatwoot_account_id_here
CHATWOOT_API_URL=https://app.chatwoot.com

# Webhook Configuration
WEBHOOK_URL=http://localhost:3001/webhook
```

### 3. Chatwoot Setup

1. **Get API Token**:
   - Go to your Chatwoot dashboard
   - Navigate to Profile Settings → API Access Tokens
   - Click "Generate API Token"
   - Copy the generated token

2. **Get Account ID**:
   - In your Chatwoot dashboard, the account ID is visible in the URL
   - Or check the API documentation for your account

3. **Configure Webhook**:
   - Go to Inbox Settings → Integrations → Webhooks
   - Add webhook URL: `http://localhost:3001/webhook`
   - Select events: `message_created`

### 4. Run the Server

```bash
# Development
npm run dev
# or
yarn dev

# Production
npm run build
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

- `POST /webhook` - Receives Chatwoot webhook events
- `GET /health` - Health check endpoint

## How It Works

1. Customer sends a message in Chatwoot
2. Chatwoot sends a webhook to `/webhook` endpoint
3. Backend processes the message through OpenAI GPT
4. AI response is sent back to Chatwoot via API
5. Response appears in the conversation

## Testing

Test the webhook integration:

```bash
npm run test:chatwoot
```

This will send a test message to your webhook endpoint.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `CHATWOOT_API_TOKEN` | Your Chatwoot API token | Yes |
| `CHATWOOT_ACCOUNT_ID` | Your Chatwoot account ID | Yes |
| `CHATWOOT_API_URL` | Chatwoot API base URL | No (defaults to https://app.chatwoot.com) |
| `WEBHOOK_URL` | Your webhook URL for testing | No |

## Troubleshooting

- **Webhook not receiving events**: Check your Chatwoot webhook configuration
- **API errors**: Verify your Chatwoot API token and account ID
- **AI not responding**: Check your OpenAI API key and quota 