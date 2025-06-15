import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

const MapContainer = styled(Box)({
  width: '100%',
  height: '100%',
});

class ThemedMap extends React.Component {
  constructor(props) {
    super(props);
    this.mapContainer = React.createRef();
    this.map = null;
    this.marker = null;
    this.popup = null;
  }

  componentDidMount() {
    this.initializeMap();
  }

  componentDidUpdate(prevProps) {
    if (this.map) {
      this.updateMap();
    } else {
      this.initializeMap();
    }
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.remove();
    }
  }

  initializeMap() {
    const { center, zoom, mapStyle } = this.props;
    if (!center || !this.mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoiaXNtZW5keSIsImEiOiJjbWJsa2s1OWQxMmkwMmxwd2dwZnZsZWo1In0.TZRgfgztitfE4_RDo6IA6g';
    
    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: mapStyle || 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom || 15,
      attributionControl: false,
    });

    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.map.on('load', () => this.updateMap()); // Atualiza o mapa após o carregamento inicial
  }

  updateMap() {
    const { center, zoom, markerPosition, markerPopupText, rawAddressText } = this.props;
    if (!this.map) return;

    if (center) {
      this.map.flyTo({ center, zoom: zoom || 15 });
    }

    // Limpa o marcador anterior para evitar duplicatas
    if (this.marker) {
      this.marker.remove();
      this.marker = null;
    }

    if (markerPosition) {
      this.addMarker(markerPosition, markerPopupText, rawAddressText);
    }
  }

  // ================================================================
  // <-- FUNÇÃO addMarker TOTALMENTE REESCRITA COM NOVOS RECURSOS -->
  // ================================================================
  addMarker(position, popupText, rawAddressText) {
    if (!this.map || !position || !Array.isArray(position) || position.length !== 2) return;

    const { theme } = this.props;
    const markerColor = theme?.palette?.secondary?.main || '#e91e63';
    const textColor = theme?.palette?.text?.primary || 'black';
    const buttonBgColor = theme?.palette?.primary?.main || '#6a1b9a';
    const buttonTextColor = theme?.palette?.primary?.contrastText || 'white';
    
    // Codifica o endereço para ser usado em URLs
    const encodedAddress = encodeURIComponent(rawAddressText);
    
    // Links para Google Maps e Waze
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    const wazeUrl = `https://www.waze.com/ul?q=${encodedAddress}`;
    
    // HTML e CSS para o novo popup interativo
    const popupContentHTML = `
      <style>
        .custom-popup-content {
          font-family: 'Roboto', sans-serif;
          color: black;
          max-width: 250px;
          padding: 8px;
        }
        .popup-address {
          font-weight: 500;
          font-size: 1rem;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }
        .popup-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .popup-button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          text-align: center;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
        }
        .popup-button:hover {
          opacity: 0.9;
        }
        .popup-button:active {
          transform: scale(0.98);
        }
        .copy-btn {
          background-color: #f0f0f0;
          color: #333;
          border: 1px solid #ddd;
        }
        .nav-btn {
          background-color: ${buttonBgColor};
          color: ${buttonTextColor};
        }
      </style>
      <div class="custom-popup-content">
        <div class="popup-address">${popupText}</div>
        <div class="popup-actions">
          <button
            class="popup-button copy-btn"
            onclick="
              navigator.clipboard.writeText('${rawAddressText.replace(/'/g, "\\'")}');
              this.innerText = 'Copiado!';
              setTimeout(() => { this.innerText = 'Copiar Endereço'; }, 2000);
            "
          >
            Copiar Endereço
          </button>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer" class="popup-button nav-btn">
            Abrir no Google Maps
          </a>
          <a href="${wazeUrl}" target="_blank" rel="noopener noreferrer" class="popup-button nav-btn">
            Abrir no Waze
          </a>
        </div>
      </div>
    `;

    // Criação do popup
    this.popup = new mapboxgl.Popup({ offset: 35, closeButton: false })
      .setHTML(popupContentHTML);

    // Criação do marcador personalizado
    const markerElement = document.createElement('div');
    markerElement.style.cssText = `
      width: 30px; height: 30px; border-radius: 50%;
      background-color: ${markerColor}; border: 3px solid white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25); cursor: pointer;
    `;

    // Adiciona marcador e popup ao mapa
    this.marker = new mapboxgl.Marker(markerElement)
      .setLngLat(position)
      .setPopup(this.popup)
      .addTo(this.map);
      
    // Abre o popup por padrão
    // this.marker.togglePopup();
  }

  render() {
    return <MapContainer ref={this.mapContainer} />;
  }
}

export default ThemedMap;