import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  // Function to convert URLs in text to clickable links
  const formatMessageContent = (content: string) => {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    // Split content by URLs and map to elements
    const parts = content.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline break-all"
          >
            Saiba mais
          </a>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] p-3 rounded-lg ${
          message.type === 'user'
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">
          {formatMessageContent(message.content)}
        </div>
        <span className="text-[10px] opacity-70 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}