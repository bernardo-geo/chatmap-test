import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import ChatWindow from './ChatWindow';

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Semi-transparent overlay when chat is open on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-[1999] md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Chat bubble and window */}
      <div className={`
        fixed z-[2000] transition-all duration-300 ease-in-out
        ${isOpen 
          ? 'bottom-0 right-0 md:bottom-6 md:right-6' 
          : 'bottom-6 right-6'
        }
      `}>
        {isOpen ? (
          <div className="w-full h-[100vh] md:w-[400px] md:h-[600px] md:rounded-xl bg-white shadow-2xl 
            flex flex-col transform transition-all duration-200 animate-slideUp">
            <div className="p-4 border-b flex items-center justify-between bg-blue-600 
              md:rounded-t-xl">
              <div>
                <h2 className="text-lg font-semibold text-white">Assistente Virtual</h2>
                <p className="text-xs text-blue-100">
                  Pergunte sobre locais, rotas e muito mais!
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-blue-700 p-2 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <ChatWindow />
          </div>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="group bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:ring-offset-2 relative"
            aria-label="Abrir chat"
          >
            <MessageCircle size={24} className="animate-pulse" />
            
            {/* Tooltip */}
            <span className="absolute bottom-full right-0 mb-2 w-max px-3 py-1.5 text-sm text-white 
              bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200
              pointer-events-none">
              Precisa de ajuda? Pergunte-me!
            </span>
          </button>
        )}
      </div>
    </>
  );
}