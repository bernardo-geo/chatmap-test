import { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip, useMap, AttributionControl } from 'react-leaflet';
import * as L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { ChevronDown, ChevronUp, Navigation, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { POICategory } from '../types/poi';
import { pois } from '../data/pois';
import { categoryIcons } from '../utils/icons';
import { baseMaps } from '../types/map';
import SearchBar from './SearchBar';
import Legend from './Legend';
import POIPopup from './POIPopup';
import FullscreenControl from './FullscreenControl';
import ReturnToViewButton from './ReturnToViewButton';
import LocationToast from './LocationToast';

function LocationTracker() {
  const map = useMap();
  const [position, setPosition] = useState<GeolocationPosition | null>(null);
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      watchId.current = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition(pos);
          map.setView([pos.coords.latitude, pos.coords.longitude], map.getZoom());
        },
        (error) => {
          console.error('Geolocation error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    }

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, [map]);

  if (!position) return null;

  return (
    <Marker
      position={[position.coords.latitude, position.coords.longitude]}
      icon={new L.DivIcon({
        className: 'location-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })}
    >
      <Popup>Você está aqui</Popup>
    </Marker>
  );
}

function Map() {
  const [selectedCategories, setSelectedCategories] = useState<Set<POICategory>>(
    new Set(Object.keys(categoryIcons) as POICategory[])
  );
  const [previousCategories, setPreviousCategories] = useState<Set<POICategory>>(
    new Set(Object.keys(categoryIcons) as POICategory[])
  );
  const [selectedRoutes, setSelectedRoutes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showMoedaId, setShowMoedaId] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedBaseMap, setSelectedBaseMap] = useState<keyof typeof baseMaps>('standard');
  const mapRef = useRef<L.Map | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 678);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 678);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateCategoriesFromMoedaId = useCallback((show: boolean) => {
    if (show) {
      const moedaIdPOIs = pois.filter(poi => poi.hasMoedaId);
      const categories = new Set<POICategory>(moedaIdPOIs.map(poi => poi.category));
      setPreviousCategories(selectedCategories);
      setSelectedCategories(categories);

      if (mapRef.current && moedaIdPOIs.length > 0) {
        const bounds = L.latLngBounds(moedaIdPOIs.map(poi => poi.coordinates));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } else {
      setSelectedCategories(previousCategories);
    }
  }, [selectedCategories, previousCategories]);

  const handleMoedaIdToggle = useCallback((show: boolean) => {
    setShowMoedaId(show);
    updateCategoriesFromMoedaId(show);
  }, [updateCategoriesFromMoedaId]);

  const filteredPOIs = pois.filter(poi => {
    if (showMoedaId && poi.hasMoedaId) {
      return true;
    }

    const matchesCategory = selectedCategories.has(poi.category);
    const matchesRoute = selectedRoutes.size === 0 || 
      (poi.routeIds && poi.routeIds.some(id => selectedRoutes.has(id)));
    const matchesSearch = searchQuery === '' || 
      poi.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poi.project.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesRoute && matchesSearch;
  });

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const searchLower = searchQuery.toLowerCase();
    
    const matchingPOIs = pois.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.project.toLowerCase().includes(searchLower)
    );

    if (matchingPOIs.length > 0) {
      const searchCategories = new Set<POICategory>(
        matchingPOIs.map(poi => poi.category)
      );
      setSelectedCategories(searchCategories);

      if (mapRef.current) {
        const bounds = L.latLngBounds(matchingPOIs.map(p => p.coordinates));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [searchQuery]);

  const selectAllCategories = useCallback(() => {
    const allCategories = new Set(Object.keys(categoryIcons) as POICategory[]);
    setSelectedCategories(allCategories);
    setPreviousCategories(allCategories);
    setSelectedRoutes(new Set());
    setShowMoedaId(false);
    setSearchQuery('');
    if (mapRef.current) {
      mapRef.current.setView([39.999, -8.464], 10.5);
    }
  }, []);

  const toggleLocationTracking = useCallback(() => {
    setIsTracking(prev => !prev);
  }, []);

  return (
    <div id="app-container" className="relative h-screen w-screen overflow-hidden bg-gray-50">
      <div
        className={`
          fixed bg-white shadow-xl transition-all duration-300 z-[1000]
          ${isMobile 
            ? `bottom-0 left-0 right-0 rounded-t-xl ${isSidebarOpen ? 'h-[50vh]' : 'h-12'}`
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
                <ChevronDown className="text-gray-600" size={20} />
              ) : (
                <ChevronUp className="text-gray-600" size={20} />
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
                  categoryIcons={
                    Object.fromEntries(
                      Object.entries(categoryIcons).map(([key, icon]) => [
                        key,
                        icon.options.iconUrl || ''
                      ])
                    ) as Record<POICategory, string>
                  }
                  selectedCategories={selectedCategories}
                  toggleCategory={(category) => {
                    setSelectedCategories(prev => {
                      const newCategories = new Set(prev);
                      if (newCategories.has(category)) {
                        newCategories.delete(category);
                      } else {
                        newCategories.add(category);
                      }
                      return newCategories;
                    });
                  }}
                  selectedRoutes={selectedRoutes}
                  toggleRoute={(routeId) => {
                    setSelectedRoutes(prev => {
                      const newRoutes = new Set(prev);
                      if (newRoutes.has(routeId)) {
                        newRoutes.delete(routeId);
                      } else {
                        newRoutes.add(routeId);
                      }
                      return newRoutes;
                    });
                  }}
                  handleReset={selectAllCategories}
                  baseMaps={baseMaps}
                  selectedBaseMap={selectedBaseMap}
                  setSelectedBaseMap={setSelectedBaseMap}
                  clearPOIs={() => setSelectedCategories(new Set())}
                  clearRoutes={() => {
                    setSelectedRoutes(new Set());
                    setSelectedCategories(previousCategories);
                  }}
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
                  categoryIcons={
                    Object.fromEntries(
                      Object.entries(categoryIcons).map(([key, icon]) => [
                        key,
                        icon.options.iconUrl || ''
                      ])
                    ) as Record<POICategory, string>
                  }
                  selectedCategories={selectedCategories}
                  toggleCategory={(category) => {
                    setSelectedCategories(prev => {
                      const newCategories = new Set(prev);
                      if (newCategories.has(category)) {
                        newCategories.delete(category);
                      } else {
                        newCategories.add(category);
                      }
                      return newCategories;
                    });
                  }}
                  selectedRoutes={selectedRoutes}
                  toggleRoute={(routeId) => {
                    setSelectedRoutes(prev => {
                      const newRoutes = new Set(prev);
                      if (newRoutes.has(routeId)) {
                        newRoutes.delete(routeId);
                      } else {
                        newRoutes.add(routeId);
                      }
                      return newRoutes;
                    });
                  }}
                  handleReset={selectAllCategories}
                  baseMaps={baseMaps}
                  selectedBaseMap={selectedBaseMap}
                  setSelectedBaseMap={setSelectedBaseMap}
                  clearPOIs={() => setSelectedCategories(new Set())}
                  clearRoutes={() => {
                    setSelectedRoutes(new Set());
                    setSelectedCategories(previousCategories);
                  }}
                  showMoedaId={showMoedaId}
                  setShowMoedaId={handleMoedaIdToggle}
                  isMobile={isMobile}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className={`absolute inset-0 ${isMobile ? 'pb-12' : ''}`}>
        {locationError && <LocationToast message={locationError} onClose={() => setLocationError(null)} />}
        
        <MapContainer
          center={[39.999, -8.464]}
          zoom={10.5}
          style={{ height: '100%', width: '100%' }}
          className="h-full w-full"
          ref={mapRef}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            url={baseMaps[selectedBaseMap].url}
            attribution={baseMaps[selectedBaseMap].attribution}
            maxZoom={19}
          />
          
          <AttributionControl
            position="bottomright"
            prefix={false}
          />
          
          <ZoomControl position="bottomright" />
          <FullscreenControl />
          <ReturnToViewButton />

          <div className="leaflet-control-locate leaflet-bar leaflet-control">
            <button
              onClick={toggleLocationTracking}
              className={`
                w-10 h-10 bg-white rounded-xl shadow-lg flex items-center 
                justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 
                focus:ring-blue-500 transition-colors
                ${isTracking ? 'text-blue-500' : 'text-gray-600'}
              `}
              title="Track my location"
            >
              <Navigation size={20} className={isTracking ? 'text-blue-500' : ''} />
            </button>
          </div>

          {isTracking && <LocationTracker />}

          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={10}
            disableClusteringAtZoom={25}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={false}
          >
            {filteredPOIs.map((poi) => (
              <Marker
                key={poi.id}
                position={poi.coordinates}
                icon={categoryIcons[poi.category]}
              >
                <Popup className="custom-popup">
                  <POIPopup 
                    poi={poi} 
                    iconUrl={categoryIcons[poi.category].options.iconUrl || ''} 
                  />
                </Popup>
                <Tooltip 
                  direction="top" 
                  offset={[0, -20]} 
                  opacity={1}
                >
                  {poi.name}
                </Tooltip>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}

export default Map;