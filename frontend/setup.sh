#!/bin/bash

echo "🚀 Setting up Chatwoot AI Bot Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.example .env
    echo "⚠️  Please update .env with your actual Chatwoot website token"
fi

echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your Chatwoot configuration:"
echo "   REACT_APP_CHATWOOT_WEBSITE_TOKEN=your_website_token_here"
echo "   REACT_APP_CHATWOOT_BASE_URL=https://app.chatwoot.com"
echo ""
echo "2. Start the frontend:"
echo "   npm start"
echo ""
echo "3. Make sure your backend is running on port 3001"
