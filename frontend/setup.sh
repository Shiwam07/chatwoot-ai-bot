#!/bin/bash

echo "🚀 Setting up React Chat Interface with Chatwoot & MUI..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install @chatwoot/sdk axios

echo "✅ Frontend setup complete!"
echo ""
echo "Next steps:"
echo "1. Create a .env file with your Chatwoot configuration:"
echo "   REACT_APP_CHATWOOT_WEBSITE_TOKEN=your_token_here"
echo "   REACT_APP_CHATWOOT_BASE_URL=https://app.chatwoot.com"
echo "   REACT_APP_API_URL=http://localhost:3001"
echo ""
echo "2. Start the frontend:"
echo "   npm start"
echo ""
echo "3. Make sure your backend is running on port 3001" 