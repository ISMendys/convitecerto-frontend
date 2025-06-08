import React, { useState, useEffect, useMemo } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl, ScaleControl, GeolocateControl } from 'react-map-gl';
import { Box, Typography, alpha, useTheme } from '@mui/material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { fallbackMinimalTheme } from './themes'; // Use fallback minimal theme

// --- IMPORTANT: Replace with your actual Mapbox Access Token --- //
const MAPBOX_TOKEN = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Get yours from https://account.mapbox.com/

const ThemedMap = ({ center, zoom, markerPosition, markerPopupText, theme }) => {
  // Use theme from props or fallback to imported elegantTheme
  const safeTheme = theme || elegantTheme;
  const muiTheme = useTheme(); // Get theme from MUI context for consistency if needed

  // Initial viewport state
  const [viewState, setViewState] = useState({
    longitude: center?.[1] || -46.6333, // Default to São Paulo longitude
    latitude: center?.[0] || -23.5505,  // Default to São Paulo latitude
    zoom: zoom || 14, // Use provided zoom or default
    pitch: 45, // Add some perspective
    bearing: 0
  });

  // Update viewport when center or zoom props change
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && !isNaN(center[0]) && !isNaN(center[1])) {
      setViewState(prev => ({
        ...prev,
        longitude: center[1],
        latitude: center[0],
        zoom: zoom || prev.zoom // Update zoom if provided
      }));
    }
  }, [center, zoom]);

  // Validate marker position
  const isValidMarkerPos = Array.isArray(markerPosition) && markerPosition.length === 2 && !isNaN(markerPosition[0]) && !isNaN(markerPosition[1]);

  // Custom Marker Component (Optional, for more complex markers)
  // For now, using the default Marker with a custom color
  const markerColor = safeTheme?.palette?.secondary?.main || '#d4af37';

  // Popup style adjustments (can be done via CSS or inline styles)
  const popupStyle = {
    background: alpha(safeTheme.palette.background.paper, 0.95),
    color: safeTheme.palette.text.primary,
    borderRadius: '12px',
    boxShadow: `0 5px 15px ${alpha(safeTheme.palette.common.black, 0.4)}`,
    border: `1px solid ${alpha(safeTheme.palette.secondary.main, 0.3)}`,
    padding: '10px 15px',
    fontFamily: safeTheme.typography.body2.fontFamily,
    fontSize: '0.95rem',
    lineHeight: 1.6,
    maxWidth: '250px',
    backdropFilter: 'blur(10px)',
  };

  // Handle invalid center gracefully (though defaults are set)
  if (!center || !Array.isArray(center) || center.length !== 2 || isNaN(center[0]) || isNaN(center[1])) {
      console.error("ThemedMap (Mapbox): Invalid map center provided:", center);
      return (
          <Box sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: alpha(safeTheme?.palette?.common?.black || '#000000', 0.2),
              borderRadius: '16px',
              color: safeTheme?.palette?.text?.secondary || 'grey'
          }}>
              <Typography>Mapa indisponível (dados inválidos)</Typography>
          </Box>
      );
  }

  if (!MAPBOX_TOKEN || MAPBOX_TOKEN === 'YOUR_MAPBOX_ACCESS_TOKEN') {
    console.error("ThemedMap (Mapbox): MAPBOX_TOKEN is not set. Please replace 'YOUR_MAPBOX_ACCESS_TOKEN' with your actual token.");
    return (
        <Box sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(safeTheme?.palette?.error?.main || '#f44336', 0.2),
            borderRadius: '16px',
            color: safeTheme?.palette?.error?.contrastText || 'white',
            p: 2, textAlign: 'center'
        }}>
            <Typography>Erro de Configuração: Chave de API do Mapbox não definida no componente ThemedMap.js.</Typography>
        </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', width: '100%', borderRadius: '16px', overflow: 'hidden', position: 'relative' }}>
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)} // Update state on user interaction
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v11" // Use Mapbox dark style
        mapboxAccessToken={MAPBOX_TOKEN}
      >
        {/* Map Controls */}
        <GeolocateControl position="top-left" />
        <FullscreenControl position="top-left" />
        <NavigationControl position="top-left" />
        <ScaleControl />

        {/* Marker */}
        {isValidMarkerPos && (
          <Marker longitude={markerPosition[1]} latitude={markerPosition[0]} anchor="bottom" color={markerColor}>
            {/* You can nest a custom element here instead of using the default pin */}
          </Marker>
        )}

        {/* Popup - Render conditionally near marker if text exists */}
        {isValidMarkerPos && markerPopupText && (
          <Popup
            longitude={markerPosition[1]}
            latitude={markerPosition[0]}
            anchor="bottom"
            offset={30} // Offset popup slightly above the marker tip
            closeButton={true}
            closeOnClick={false}
            style={popupStyle}
          >
            {/* Use dangerouslySetInnerHTML if markerPopupText contains HTML, otherwise just render text */}
            <div dangerouslySetInnerHTML={{ __html: markerPopupText }} />
            {/* Or simply: {markerPopupText} */}
          </Popup>
        )}
      </Map>
    </Box>
  );
};

export default ThemedMap;

