import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface ChatwootContextType {
  isLoaded: boolean;
  isOpen: boolean;
  toggle: () => void;
}

const ChatwootContext = createContext<ChatwootContextType | undefined>(undefined);

interface ChatwootProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    chatwootSDK?: {
      run: (config: any) => void;
      toggle: () => void;
    };
  }
}

export const ChatwootProvider: React.FC<ChatwootProviderProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load Chatwoot SDK
    const loadChatwoot = () => {
      const script = document.createElement('script');
      script.src = 'https://app.chatwoot.com/packs/js/sdk.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        if (window.chatwootSDK) {
          window.chatwootSDK.run({
            websiteToken: process.env.REACT_APP_CHATWOOT_WEBSITE_TOKEN || '',
            baseUrl: process.env.REACT_APP_CHATWOOT_BASE_URL || 'https://app.chatwoot.com',
            launcherTitle: 'Chat with us',
          });
          setIsLoaded(true);
        }
      };

      document.head.appendChild(script);
    };

    if (!window.chatwootSDK) {
      loadChatwoot();
    } else {
      setIsLoaded(true);
    }
  }, []);

  const toggle = () => {
    if (window.chatwootSDK) {
      window.chatwootSDK.toggle();
      setIsOpen(!isOpen);
    }
  };

  const value: ChatwootContextType = {
    isLoaded,
    isOpen,
    toggle,
  };

  return (
    <ChatwootContext.Provider value={value}>
      {children}
    </ChatwootContext.Provider>
  );
};

export const useChatwoot = (): ChatwootContextType => {
  const context = useContext(ChatwootContext);
  if (context === undefined) {
    throw new Error('useChatwoot must be used within a ChatwootProvider');
  }
  return context;
}; 