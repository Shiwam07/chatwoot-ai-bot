# Chatwoot Integration Setup Guide

This guide explains how to set up Chatwoot integration with your LangChain backend to enable AI-powered responses in your chat widget.

## 🎯 Overview

The backend now supports:
- **Receiving webhook events** from Chatwoot when users send messages
- **Processing messages** through LangChain AI agent
- **Sending AI responses** back to Chatwoot conversations via their API

## 🔧 Environment Variables

Add these variables to your `.env` file:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Chatwoot API Configuration
CHATWOOT_API_URL=https://app.chatwoot.com
CHATWOOT_API_TOKEN=your_chatwoot_api_token_here
CHATWOOT_ACCOUNT_ID=your_chatwoot_account_id_here

# Optional: Custom webhook URL
WEBHOOK_URL=http://localhost:3001/webhook
```

## 📋 Chatwoot Setup Steps

### 1. Create Chatwoot Account
1. Sign up at [chatwoot.com](https://www.chatwoot.com)
2. Create a new account and inbox
3. Note down your **Account ID** (found in account settings)

### 2. Generate API Token
1. Go to **Settings** → **Integrations** → **API**
2. Click **"Generate API Token"**
3. Copy the generated token
4. Add it to your `.env` file as `CHATWOOT_API_TOKEN`

### 3. Configure Webhook
1. Go to **Settings** → **Integrations** → **Webhooks**
2. Click **"Add Webhook"**
3. Set the webhook URL to: `http://localhost:3001/webhook`
4. Select events: `message_created`
5. Save the webhook

### 4. Get Account ID
1. Go to **Settings** → **Account Settings**
2. Copy the **Account ID** from the URL or settings page
3. Add it to your `.env` file as `CHATWOOT_ACCOUNT_ID`

## 🔄 How It Works

### Message Flow:
1. **User sends message** → Chatwoot widget
2. **Chatwoot triggers webhook** → Your backend (`/webhook`)
3. **Backend processes message** → LangChain AI agent
4. **AI generates response** → Backend sends to Chatwoot API
5. **Response appears** → In Chatwoot conversation

### Webhook Event Structure:
```json
{
  "event": "message_created",
  "account": { "id": 127704, "name": "Your Account" },
  "content": "what about the session management",
  "conversation": {
    "id": 12345,
    "inbox_id": 70310,
    "status": "open"
  },
  "message": {
    "id": 67890,
    "content": "what about the session management",
    "content_type": "text"
  },
  "sender": {
    "id": 400615803,
    "name": "User Name",
    "email": "user@example.com",
    "type": "contact"
  }
}
```

## 🚀 Testing the Integration

### 1. Start the Backend
```bash
cd backend
yarn dev
```

### 2. Test Webhook Endpoint
```bash
curl -X POST http://localhost:3001/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message_created",
    "content": "Hello, how are you?",
    "conversation": {"id": 12345},
    "message": {"id": 67890, "content": "Hello, how are you?"},
    "sender": {"type": "contact", "name": "Test User"}
  }'
```

### 3. Check Logs
You should see:
```
📡 Received Chatwoot webhook event: { event: 'message_created', conversation_id: 12345, ... }
🤖 Processing Chatwoot message: Hello, how are you?
🤖 AI Response: Hello! I'm doing well, thank you for asking...
✅ Chatwoot response sent successfully: 123456
```

## 🔧 Customization

### Modify AI System Prompt
Edit the system message in the `chat` method:

```typescript
const response = await this.model.call([
  new SystemMessage("You are a helpful customer support AI assistant. Be friendly, professional, and concise."),
  new HumanMessage(message),
]);
```

### Add Message Filtering
Modify `handleChatwootMessage` to filter specific messages:

```typescript
private async handleChatwootMessage(event: ChatwootWebhookEvent): Promise<void> {
  // Only respond to certain message types
  if (event.content.toLowerCase().includes('help') || event.content.toLowerCase().includes('support')) {
    const aiResponse = await this.chat(event.content);
    await this.sendChatwootResponse(event.conversation.id, aiResponse);
  }
}
```

### Add Conversation Context
Store conversation history for better context:

```typescript
private conversationHistory: Map<number, string[]> = new Map();

private async handleChatwootMessage(event: ChatwootWebhookEvent): Promise<void> {
  const conversationId = event.conversation.id;
  const history = this.conversationHistory.get(conversationId) || [];
  
  // Add user message to history
  history.push(`User: ${event.content}`);
  
  // Get AI response with context
  const context = history.join('\n');
  const aiResponse = await this.chat(context);
  
  // Add AI response to history
  history.push(`AI: ${aiResponse}`);
  this.conversationHistory.set(conversationId, history);
  
  await this.sendChatwootResponse(conversationId, aiResponse);
}
```

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing Chatwoot API configuration"**
   - Check that `CHATWOOT_API_TOKEN` and `CHATWOOT_ACCOUNT_ID` are set in `.env`

2. **"Failed to send Chatwoot response"**
   - Verify your API token is correct
   - Check that the account ID matches your Chatwoot account
   - Ensure the conversation ID exists

3. **Webhook not receiving events**
   - Verify webhook URL is accessible from Chatwoot
   - Check that webhook is enabled and events are selected
   - Test with a simple webhook endpoint first

4. **AI responses not appearing**
   - Check backend logs for errors
   - Verify OpenAI API key is valid
   - Ensure LangChain is properly configured

### Debug Mode:
Add more detailed logging:

```typescript
console.log('🔍 Debug - Full webhook event:', JSON.stringify(event, null, 2));
console.log('🔍 Debug - API URL:', `${chatwootApiUrl}/api/v1/accounts/${accountId}/conversations/${conversationId}/messages`);
```

## 📚 API Reference

### Chatwoot API Endpoints Used:
- `POST /api/v1/accounts/{account_id}/conversations/{conversation_id}/messages`

### Required Headers:
- `Content-Type: application/json`
- `api_access_token: {your_api_token}`

### Request Body:
```json
{
  "content": "AI response message",
  "message_type": "outgoing",
  "private": false
}
```

## 🎉 Success!

Once configured, your Chatwoot widget will automatically:
- Receive user messages via webhooks
- Process them through your LangChain AI agent
- Send intelligent responses back to users
- Maintain conversation context and history

Your customers will have a seamless AI-powered chat experience! 🤖💬 