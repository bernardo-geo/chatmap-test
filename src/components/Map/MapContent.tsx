import { Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Tooltip, AttributionControl } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { POI } from '../../types/poi';
import { BaseMaps } from '../../types/map';
import { categoryIcons } from '../../utils/icons';
import LocationTracker from './LocationTracker';
import FullscreenControl from '../FullscreenControl';
import ReturnToViewButton from '../ReturnToViewButton';
import POIPopup from '../POIPopup';
import LocationToast from '../LocationToast';
import { MutableRefObject } from 'react';
import * as L from 'leaflet';

interface MapContentProps {
  isMobile: boolean;
  locationError: string | null;
  setLocationError: (error: string | null) => void;
  mapRef: MutableRefObject<L.Map | null>;
  selectedBaseMap: string;
  baseMaps: BaseMaps;
  isTracking: boolean;
  toggleLocationTracking: () => void;
  filteredPOIs: POI[];
}

export default function MapContent({
  isMobile,
  locationError,
  setLocationError,
  mapRef,
  selectedBaseMap,
  baseMaps,
  isTracking,
  toggleLocationTracking,
  filteredPOIs
}: MapContentProps) {
  return (
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
          position="topright"
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
  );
}