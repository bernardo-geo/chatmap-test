import { ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { POICategory } from '../../types/poi';
import { BaseMaps } from '../../types/map';
import SearchBar from '../SearchBar';
import Legend from '../Legend';

interface MapSidebarProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  selectAllCategories: () => void;
  showMoedaId: boolean;
  handleMoedaIdToggle: (show: boolean) => void;
  categoryIcons: Record<POICategory, string>;
  selectedCategories: Set<POICategory>;
  toggleCategory: (category: POICategory) => void;
  selectedRoutes: Set<string>;
  toggleRoute: (routeId: string) => void;
  baseMaps: BaseMaps;
  selectedBaseMap: string;
  setSelectedBaseMap: (baseMap: string) => void;
  clearPOIs: () => void;
  clearRoutes: () => void;
  previousCategories: Set<POICategory>;
  setSelectedCategories: (categories: Set<POICategory>) => void;
}

export default function MapSidebar({
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
  searchQuery,
  setSearchQuery,
  handleSearch,
  selectAllCategories,
  showMoedaId,
  handleMoedaIdToggle,
  categoryIcons,
  selectedCategories,
  toggleCategory,
  selectedRoutes,
  toggleRoute,
  baseMaps,
  selectedBaseMap,
  setSelectedBaseMap,
  clearPOIs,
  clearRoutes,
  previousCategories,
  setSelectedCategories

}: MapSidebarProps) {
  return (
    <div
      className={`
        fixed bg-white shadow-xl transition-all duration-300 z-[1000]
        ${isMobile 
          ? `bottom-0 left-0 right-0 rounded-t-xl ${isSidebarOpen ? 'h-[25vh]' : 'h-12'}`
          : `top-0 h-full ${isSidebarOpen ? 'w-[280px] left-0' : 'w-[40px] left-0'}`
        }
      `}
    >
      {isMobile ? (
        <>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full bg-white flex items-center justify-between px-4 py-3 hover:bg-gray-50 
              transition-colors rounded-t-xl"
          >
            <span className="text-base font-semibold text-gray-800">
              Interações no Mapa
            </span>
            {isSidebarOpen ? (
              <ChevronDown className="text-gray-600" size={18} />
            ) : (
              <ChevronUp className="text-gray-600" size={18} />
            )}
          </button>

          {isSidebarOpen && (
            <div className="px-4 py-3 border-t border-gray-100 overflow-y-auto h-[calc(100%-48px)]">
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                handleReset={selectAllCategories}
                isMobile={true}
              />
              <button
                onClick={() => handleMoedaIdToggle(!showMoedaId)}
                className={`
                  w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all text-sm mt-3
                  ${showMoedaId 
                    ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                `}
              >
                <img 
                  src="/icons/ID.png" 
                  alt="Moeda ID" 
                  className="w-6 h-6 object-contain"
                />
                <span className="font-medium">Vê onde utilizar a Moeda ID</span>
              </button>
              <Legend
                categoryIcons={categoryIcons}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                selectedRoutes={selectedRoutes}
                toggleRoute={toggleRoute}
                handleReset={selectAllCategories}
                baseMaps={baseMaps}
                selectedBaseMap={selectedBaseMap}
                setSelectedBaseMap={setSelectedBaseMap}
                clearPOIs={clearPOIs}
                clearRoutes={clearRoutes}
                showMoedaId={showMoedaId}
                setShowMoedaId={handleMoedaIdToggle}
                isMobile={isMobile}
              />
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between p-3 border-b bg-white">
            {isSidebarOpen ? (
              <>
                <span className="text-base font-semibold text-gray-800">Interações no Mapa</span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <PanelLeftClose className="text-gray-600" size={18} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors mx-auto"
              >
                <PanelLeftOpen className="text-gray-600" size={18} />
              </button>
            )}
          </div>

          {isSidebarOpen && (
            <div className="h-[calc(100%-56px)] overflow-y-auto">
              <div className="p-3 border-b">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  handleReset={selectAllCategories}
                />
                <button
                  onClick={() => handleMoedaIdToggle(!showMoedaId)}
                  className={`
                    w-full flex items-center justify-center gap-2 p-3 rounded-lg transition-all text-sm mt-3
                    ${showMoedaId 
                      ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <img 
                    src="/icons/ID.png" 
                    alt="Moeda ID" 
                    className="w-6 h-6 object-contain"
                  />
                  <span className="font-medium">Vê onde utilizar a Moeda ID</span>
                </button>
              </div>
              <Legend
                categoryIcons={categoryIcons}
                selectedCategories={selectedCategories}
                toggleCategory={toggleCategory}
                selectedRoutes={selectedRoutes}
                toggleRoute={toggleRoute}
                handleReset={selectAllCategories}
                baseMaps={baseMaps}
                selectedBaseMap={selectedBaseMap}
                setSelectedBaseMap={setSelectedBaseMap}
                clearPOIs={clearPOIs}
                clearRoutes={clearRoutes}
                showMoedaId={showMoedaId}
                setShowMoedaId={handleMoedaIdToggle}
                isMobile={isMobile}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
