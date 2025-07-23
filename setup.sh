#!/bin/bash

echo "🚀 Setting up Chatwoot AI Bot Project"
echo "====================================="

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend
npm install
echo "✅ Backend dependencies installed"

# Frontend setup
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend
npm install
echo "✅ Frontend dependencies installed"

# Create example environment files
echo ""
echo "📝 Creating example environment files..."

cd ../backend
if [ ! -f .env ]; then
    echo "Creating backend/.env.example..."
    cp env.example .env
    echo "⚠️  Please update backend/.env with your actual API keys"
fi

cd ../frontend
if [ ! -f .env ]; then
    echo "Creating frontend/.env.example..."
    cp env.example .env
    echo "⚠️  Please update frontend/.env with your actual Chatwoot token"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update backend/.env with your OpenAI and Chatwoot API keys"
echo "2. Update frontend/.env with your Chatwoot website token"
echo "3. Configure Chatwoot webhooks to point to http://localhost:3001/webhook"
echo "4. Run 'cd backend && npm run dev' to start the backend"
echo "5. Run 'cd frontend && npm start' to start the frontend"
echo ""
echo "For detailed setup instructions, see the README files in each directory." 