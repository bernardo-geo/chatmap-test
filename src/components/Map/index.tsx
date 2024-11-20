import { useState, useCallback, useRef, useEffect } from 'react';
import * as L from 'leaflet';
import { POICategory } from '../../types/poi';
import { pois } from '../../data/pois';
import { categoryIcons } from '../../utils/icons';
import { baseMaps } from '../../types/map';
import MapSidebar from './MapSidebar';
import MapContent from './MapContent';

export default function Map() {
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
      <MapSidebar
        isMobile={isMobile}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        selectAllCategories={selectAllCategories}
        showMoedaId={showMoedaId}
        handleMoedaIdToggle={handleMoedaIdToggle}
        categoryIcons={categoryIcons}
        selectedCategories={selectedCategories}
        toggleCategory={(category: POICategory) => {
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
        toggleRoute={(routeId: string) => {
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
        baseMaps={baseMaps}
        selectedBaseMap={selectedBaseMap}
        setSelectedBaseMap={setSelectedBaseMap}
        clearPOIs={() => setSelectedCategories(new Set())}
        clearRoutes={() => {
          setSelectedRoutes(new Set());
          setSelectedCategories(previousCategories);
        }}
      />

      <MapContent
        isMobile={isMobile}
        locationError={locationError}
        setLocationError={setLocationError}
        mapRef={mapRef}
        selectedBaseMap={selectedBaseMap}
        baseMaps={baseMaps}
        isTracking={isTracking}
        toggleLocationTracking={toggleLocationTracking}
        filteredPOIs={filteredPOIs}
      />
    </div>
  );
}