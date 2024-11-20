import { useMap } from 'react-leaflet';
import { Maximize2, Minimize2 } from 'lucide-react';
import { useCallback, useState, useEffect } from 'react';

export default function FullscreenControl() {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    const appContainer = document.getElementById('app-container');
    if (!appContainer) return;

    if (!document.fullscreenElement) {
      appContainer.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => {
          map.invalidateSize();
        }, 100);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  }, [map]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="leaflet-control-fullscreen leaflet-bar leaflet-control">
      <button
        onClick={toggleFullscreen}
        className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center 
          justify-center hover:bg-gray-50 focus:outline-none focus:ring-2 
          focus:ring-blue-500 transition-colors"
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="text-gray-600" size={20} />
        ) : (
          <Maximize2 className="text-gray-600" size={20} />
        )}
      </button>
    </div>
  );
}