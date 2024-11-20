import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { ChatProvider } from './components/ChatBot/context/ChatContext';

// Fix Leaflet default icon issue
import L from 'leaflet';
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>
);