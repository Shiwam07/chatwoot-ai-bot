import React from 'react';
import './App.css';
import { ChatwootProvider } from './contexts/ChatwootContext';

function App() {
  return (
    <div className="App">
      <ChatwootProvider>
        <header className="App-header">
          <h1>Chatwoot AI Bot</h1>
          <p>Your AI-powered customer support solution</p>
        </header>
      </ChatwootProvider>
    </div>
  );
}

export default App;
