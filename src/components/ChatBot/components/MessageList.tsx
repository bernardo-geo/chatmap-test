import { Message } from '../types';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none max-w-[80%] p-3">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" 
                style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}