import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleReset: () => void;
  isMobile?: boolean;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleReset,
  isMobile = false
}: SearchBarProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value === '') {
      handleReset();
    }
  };

  return (
    <form onSubmit={handleSearch} className={`w-full ${isMobile ? 'flex items-center gap-2' : ''}`}>
      <div className={`relative ${isMobile ? 'flex-1' : 'w-full'}`}>
        <input
          type="text"
          value={searchQuery}
          onChange={handleChange}
          placeholder="Procurar..."
          className={`
            w-full bg-gray-50 border border-gray-200 rounded-lg
            placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:border-transparent transition-shadow
            ${isMobile ? 'h-8 px-8 text-xs' : 'h-10 px-3 pl-9 pr-9 text-sm'}
          `}
        />
        <Search 
          className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={isMobile ? 14 : 16}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={handleReset}
            className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 
              hover:text-gray-600 focus:outline-none p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={isMobile ? 14 : 16} />
          </button>
        )}
      </div>
      <button
        type="submit"
        className={`
          bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 
          focus:ring-4 focus:ring-blue-200 transition-colors shadow-sm
          ${isMobile ? 'h-8 px-3 text-xs' : 'w-full h-10 mt-2 text-sm'}
        `}
      >
        {isMobile ? 'Procurar' : 'Procurar'}
      </button>
    </form>
  );
}