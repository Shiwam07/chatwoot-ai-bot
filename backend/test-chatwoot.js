#!/usr/bin/env node

/**
 * Test script for Chatwoot webhook integration
 * Run this to test if your backend can receive and process Chatwoot webhook events
 */

const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3001/webhook';

// Sample Chatwoot webhook event for testing
const sampleChatwootEvent = {
  event: "message_created",
  account: {
    id: 1,
    name: "Test Account"
  },
  additional_attributes: {},
  content_attributes: {
    in_reply_to: null
  },
  content_type: "text",
  content: "what about the session management",
  conversation: {
    additional_attributes: {
      browser: { name: "Chrome", version: "120.0.0.0" },
      referer: "http://localhost:3000/",
      initiated_at: "2025-07-12T13:06:31.636Z",
      browser_language: "en"
    },
    can_reply: true,
    channel: "Channel::WebWidget",
    contact_inbox: {
      id: 399047688,
      contact_id: 400615803,
      inbox_id: 70310,
      source_id: "cccd4646-2967-4110-913c-0d6df67ff7c1",
      created_at: "2025-07-12T13:06:31.636Z",
      updated_at: "2025-07-12T13:06:31.636Z",
      hmac_verified: false,
      pubsub_token: "test_pubsub_token_placeholder"
    },
    id: 12345,
    inbox_id: 70310,
    status: "open",
    created_at: "2025-07-12T13:06:31.636Z",
    updated_at: "2025-07-12T13:06:31.636Z"
  },
  message: {
    id: 67890,
    content: "what about the session management",
    content_type: "text",
    created_at: "2025-07-12T13:06:31.636Z",
    updated_at: "2025-07-12T13:06:31.636Z",
    private: false,
    source: "web",
    message_type: 0,
    content_attributes: {},
    sender: {
      id: 400615803,
      name: "Test User",
      email: "user@example.com",
      avatar_url: "https://ui-avatars.com/api/?name=Test+User",
      type: "contact"
    }
  },
  sender: {
    id: 400615803,
    name: "Test User",
    email: "user@example.com",
    avatar_url: "https://ui-avatars.com/api/?name=Test+User",
    type: "contact"
  },
  created_at: "2025-07-12T13:06:31.636Z"
};

async function testChatwootWebhook() {
  console.log('🧪 Testing Chatwoot webhook integration...\n');
  
  try {
    console.log('📡 Sending webhook event to:', WEBHOOK_URL);
    console.log('📝 Message content:', sampleChatwootEvent.content);
    console.log('👤 Sender:', sampleChatwootEvent.sender.name);
    console.log('💬 Conversation ID:', sampleChatwootEvent.conversation.id);
    
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sampleChatwootEvent)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('\n✅ Webhook test successful!');
      console.log('📊 Response:', result);
      console.log('\n🎯 Expected backend behavior:');
      console.log('   1. Receive webhook event');
      console.log('   2. Process message through LangChain AI');
      console.log('   3. Send AI response to Chatwoot API');
      console.log('   4. Response appears in Chatwoot conversation');
    } else {
      console.error('\n❌ Webhook test failed!');
      console.error('Status:', response.status);
      console.error('Status Text:', response.statusText);
      const errorText = await response.text();
      console.error('Error:', errorText);
    }
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure backend is running: yarn dev');
    console.log('   2. Check if port 3001 is available');
    console.log('   3. Verify webhook endpoint is accessible');
  }
}

// Run the test
testChatwootWebhook(); 