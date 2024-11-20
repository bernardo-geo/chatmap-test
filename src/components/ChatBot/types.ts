export interface Message {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
}

export interface SearchResult {
  type: 'poi' | 'route' | 'embaixador';
  name: string;
  category?: string;
  description?: string;
  location?: string;
  url?: string;
  coordinates: [number, number];
  image?: string;
  distance?: number;
  queryContext?: string;
}