import { useRef, useEffect } from 'react';
import { useChatContext } from './context/ChatContext';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';

export default function ChatWindow() {
  const { messages, isLoading, processMessage } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <MessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={processMessage} isLoading={isLoading} />
    </>
  );
}