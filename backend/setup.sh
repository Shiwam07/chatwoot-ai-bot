#!/bin/bash

echo "🚀 Setting up React Chat Interface with MUI & Styled Components..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
yarn add express cors dotenv socket.io
yarn add -D @types/express @types/cors

# Create frontend directory
echo "📁 Creating frontend directory..."
mkdir -p frontend

# Create React app with TypeScript
echo "⚛️ Creating React app..."
cd frontend
npx create-react-app . --template typescript --yes

# Install additional dependencies
echo "📦 Installing MUI, styled-components, and other dependencies..."
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled
npm install styled-components @types/styled-components
npm install socket.io-client axios

# Remove default files
rm -rf src/App.test.tsx src/logo.svg src/reportWebVitals.ts src/setupTests.ts

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: yarn dev (runs on port 3001)"
echo "2. Frontend: cd frontend && npm start (runs on port 3000)"
echo ""
echo "Make sure to set your OPENAI_API_KEY in .env file" 