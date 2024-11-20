import Map from './components/Map';
import ChatBubble from './components/ChatBot/ChatBubble';

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Map />
      <ChatBubble />
    </div>
  );
}

export default App;