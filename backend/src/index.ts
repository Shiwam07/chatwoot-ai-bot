import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Messages } from '@figuro/chatwoot-sdk/dist/services/Messages';

dotenv.config();

// TypeScript interfaces
interface LangChainConfig {
  modelName: string;
  temperature: number;
  apiKey?: string;
}

interface ChatwootWebhookEvent {
  event: string;
  account: {
    id: number;
    name: string;
  };
  additional_attributes: Record<string, any>;
  content_attributes: {
    in_reply_to: any;
  };
  content_type: string;
  content: string;
  conversation: {
    additional_attributes: {
      browser: any;
      referer: string;
      initiated_at: any;
      browser_language: string;
    };
    can_reply: boolean;
    channel: string;
    contact_inbox: {
      id: number;
      contact_id: number;
      inbox_id: number;
      source_id: string;
      created_at: string;
      updated_at: string;
      hmac_verified: boolean;
      pubsub_token: string;
    };
    id: number;
    inbox_id: number;
    status: string;
    created_at: string;
    updated_at: string;
  };
  message: {
    id: number;
    content: string;
    content_type: string;
    created_at: string;
    updated_at: string;
    private: boolean;
    source: string;
    message_type: number;
    content_attributes: Record<string, any>;
    sender: {
      id: number;
      name: string;
      email: string;
      avatar_url?: string;
      type: string;
    };
  };
  sender: {
    id: number;
    name: string;
    email: string;
    avatar_url?: string;
    type: string;
  };
  created_at: string;
}

// Simplified LangChain app with only Chatwoot integration
class ChatwootAIBot {
  private model: ChatOpenAI;
  private config: LangChainConfig;
  private app: express.Application;
  private chatwootAPI: Messages;

  constructor(config: LangChainConfig) {
    this.config = config;
    
    this.model = new ChatOpenAI({
      modelName: config.modelName,
      temperature: config.temperature,
      openAIApiKey: config.apiKey,
    });

    // Initialize Chatwoot SDK
    const chatwootApiUrl = process.env.CHATWOOT_API_URL ?? '';
    const chatwootApiToken = process.env.CHATWOOT_API_TOKEN ?? '';
    
    if (!chatwootApiToken) {
      console.warn('⚠️ CHATWOOT_API_TOKEN not found in environment variables');
    }
    
    this.chatwootAPI = new Messages({
      config: {
        basePath: chatwootApiUrl,
        token: chatwootApiToken,
        with_credentials: false,
        credentials: "include"
      }
    });

    this.app = express();
    this.setupExpress();
  }

  private setupExpress(): void {
    this.app.use(cors());
    this.app.use(express.json());

    // Webhook endpoint to receive Chatwoot events
    this.app.post('/webhook', async (req: Request, res: Response) => {
      try {
        console.log('📡 WEBHOOK RECEIVED - Raw body:', JSON.stringify(req.body, null, 2));
        
        // Check if this is a Chatwoot webhook event (has conversation object)
        if (req.body.conversation) {
          console.log('📡 Detected as Chatwoot event');
          
          // Handle Chatwoot message events
          if (req.body.event === 'message_created') {
            console.log('✅ Chatwoot message event - processing');
            
            // Add filtering to prevent infinite loops
            if (this.shouldProcessMessage(req.body)) {
              console.log('✅ Message meets processing criteria - calling handleChatwootMessage');
              await this.handleChatwootMessage(req.body);
            } else {
              console.log('⚠️ Message filtered out - not processing');
            }
          } else {
            console.log('⚠️ Chatwoot event but not message_created:', req.body.event);
          }
        } else {
          console.log('❌ Not a valid Chatwoot webhook event');
        }

        console.log('📡 Webhook processing completed');
        res.status(200).json({ status: 'success' });
      } catch (error) {
        console.error('❌ Webhook error:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Health check endpoint
    this.app.get('/health', (res: Response) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        service: 'Chatwoot AI Bot'
      });
    });
  }

  private async handleChatwootMessage(event: any): Promise<void> {
    try {
      console.log('🤖 ENTERING handleChatwootMessage');
      console.log('🤖 Processing Chatwoot message:', event.content);
      console.log('🤖 Conversation ID from event:', event.conversation.id);
      
      // Get AI response from LangChain
      console.log('🤖 About to call chat method');
      const aiResponse = await this.chat(event.content);
      console.log('🤖 AI Response received:', aiResponse);
      
      // Send response back to Chatwoot via their API
      console.log('🤖 About to call sendChatwootResponse');
      await this.sendChatwootResponse(event.conversation.id, aiResponse);
      console.log('🤖 sendChatwootResponse completed');
      
    } catch (error) {
      console.error('❌ Error in handleChatwootMessage:', error);
    }
  }

  private async sendChatwootResponse(conversationId: number, message: string): Promise<void> {
    try {
      console.log('🤖 ENTERING sendChatwootResponse');
      console.log('🤖 Sending Chatwoot response:', message);
      console.log('🤖 Conversation ID:', conversationId);
      
      // Use Chatwoot SDK instead of direct API call
      const response = await this.chatwootAPI.create({
        accountId: parseInt(process.env.CHATWOOT_ACCOUNT_ID ?? ''),
        conversationId: conversationId,
        data: {
          content: message,
          message_type: 'outgoing',
          private: false,
        }
      });

      console.log('✅ Chatwoot response sent successfully:', response.id);
    } catch (error) {
      console.error('❌ Error in sendChatwootResponse:', error);
    }
  }

  async chat(message: string): Promise<string> {
    console.log('🤖 Chatting with:', message);
    try {
      const response = await this.model.invoke([
        new SystemMessage("You are a helpful AI assistant. Provide clear, concise, and helpful responses."),
        new HumanMessage(message),
      ]);
      return response.content as string;
    } catch (error) {
      console.error("❌ Error in chat:", error);
      throw new Error("Failed to get response from model");
    }
  }

  /**
   * Determines if a message should be processed by the AI
   * Filters out messages from agents, API, and other non-customer sources
   */
  private shouldProcessMessage(event: any): boolean {
    try {
      console.log('🔍 Checking if message should be processed...');
      
      // Log message details for debugging
      console.log('📡 Message details:', {
        sender_type: event.sender?.type,
        message_type: event.message_type,
        content: event.content?.substring(0, 50) + '...',
        sender_name: event.sender?.name,
        private: event.private
      });

      // Check if message is incoming (from customer)
      // In Chatwoot: message_type "incoming" = from customer, "outgoing" = from agent/API
      if (event.message_type !== 'incoming') {
        console.log('❌ Filtered out: Message is not incoming (message_type:', event.message_type, ')');
        return false;
      }

      // Check if message is private (internal notes)
      if (event.private === true) {
        console.log('❌ Filtered out: Message is private');
        return false;
      }

      // Check if message has content
      if (!event.content || event.content.trim() === '') {
        console.log('❌ Filtered out: Message has no content');
        return false;
      }

      // Check if this is a bot message (to prevent self-triggering)
      if (event.sender?.name?.toLowerCase().includes('bot') || 
          event.sender?.name?.toLowerCase().includes('ai') ||
          event.sender?.name?.toLowerCase().includes('assistant')) {
        console.log('❌ Filtered out: Message is from bot/AI assistant');
        return false;
      }

      console.log('✅ Message passed all filters - will be processed');
      return true;
      
    } catch (error) {
      console.error('❌ Error in shouldProcessMessage:', error);
      return false; // Default to not processing if there's an error
    }
  }

  getConfig(): LangChainConfig {
    return { ...this.config };
  }

  startServer(port: number = 3001): void {
    this.app.listen(port, () => {
      console.log(`🚀 Chatwoot AI Bot server running on http://localhost:${port}`);
      console.log(`📡 Webhook endpoint: http://localhost:${port}/webhook`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
    });
  }
}

// Main function
async function main(): Promise<void> {
  const config: LangChainConfig = {
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
    apiKey: process.env.OPENAI_API_KEY,
  };

  const app = new ChatwootAIBot(config);
  
  console.log("🤖 Chatwoot AI Bot initialized!");

  // Start the server
  app.startServer(3001);
}

// Run the main function
main().catch(console.error);

export { ChatwootAIBot, LangChainConfig, ChatwootWebhookEvent }; 