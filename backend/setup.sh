#!/bin/bash

echo "🚀 Setting up Chatwoot AI Bot Backend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual API keys"
fi

echo "✅ Backend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your API configuration:"
echo "   OPENAI_API_KEY=your_openai_api_key_here"
echo "   CHATWOOT_API_TOKEN=your_chatwoot_api_token_here"
echo "   CHATWOOT_ACCOUNT_ID=your_chatwoot_account_id_here"
echo ""
echo "2. Configure Chatwoot webhooks to point to:"
echo "   http://localhost:3001/webhook"
echo ""
echo "3. Start the backend:"
echo "   npm run dev"
