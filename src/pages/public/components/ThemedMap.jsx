import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

// Componente estilizado para o container do mapa
const MapContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  height: '100%',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

// Componente de mapa temático
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
    // Verificar se as propriedades relevantes mudaram
    if (
      prevProps.center !== this.props.center ||
      prevProps.zoom !== this.props.zoom ||
      prevProps.markerPosition !== this.props.markerPosition ||
      prevProps.markerPopupText !== this.props.markerPopupText ||
      prevProps.mapStyle !== this.props.mapStyle
    ) {
      // Se o mapa já existe, atualize-o
      if (this.map) {
        this.updateMap();
      } else {
        // Se o mapa não existe, inicialize-o
        this.initializeMap();
      }
    }
  }

  componentWillUnmount() {
    // Limpar o mapa quando o componente for desmontado
    if (this.map) {
      this.map.remove();
    }
  }

  initializeMap() {
    const { center, zoom, markerPosition, markerPopupText, mapStyle } = this.props;

    // Verificar se os dados necessários estão disponíveis
    if (!center || !this.mapContainer.current) return;

    // Configurar o token de acesso do Mapbox (substitua por um token válido em produção)
    mapboxgl.accessToken = 'pk.eyJ1IjoiaXNtZW5keSIsImEiOiJjbWJsa2s1OWQxMmkwMmxwd2dwZnZsZWo1In0.TZRgfgztitfE4_RDo6IA6g';

    // Criar o mapa
    this.map = new mapboxgl.Map({
      container: this.mapContainer.current,
      style: mapStyle || 'mapbox://styles/mapbox/light-v11',
      center: center,
      zoom: zoom || 15,
      attributionControl: false,
    });

    // Adicionar controles de navegação
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    // Adicionar marcador se a posição for fornecida
    if (markerPosition) {
      this.addMarker(markerPosition, markerPopupText);
    }
  }

  updateMap() {
    const { center, zoom, markerPosition, markerPopupText, mapStyle } = this.props;

    // Atualizar o centro e o zoom do mapa
    if (this.map && center) {
      this.map.setCenter(center);
      this.map.setZoom(zoom || 15);
      this.map.setStyle(mapStyle || 'mapbox://styles/mapbox/light-v11');
    }

    // Atualizar o marcador
    if (markerPosition) {
      // Remover o marcador existente, se houver
      if (this.marker) {
        this.marker.remove();
      }
      // Adicionar o novo marcador
      this.addMarker(markerPosition, markerPopupText);
    }
  }

  addMarker(position, popupText) {
    // Criar elemento personalizado para o marcador
    const markerElement = document.createElement('div');
    markerElement.className = 'custom-marker';
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.backgroundColor = this.props.theme.palette.secondary.main;
    markerElement.style.border = '3px solid white';
    markerElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    markerElement.style.cursor = 'pointer';

    // Criar o marcador
    this.marker = new mapboxgl.Marker(markerElement)
      .setLngLat(position)
      .addTo(this.map);

    // Adicionar popup se o texto for fornecido
    if (popupText) {
      this.popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
        .setHTML(`<div style="padding: 10px; text-align: center;">${popupText}</div>`);
      
      this.marker.setPopup(this.popup);
      
      // Mostrar o popup por padrão
      setTimeout(() => {
        if (this.marker && this.popup) {
          this.marker.togglePopup();
        }
      }, 1000);
    }
  }

  render() {
    return <MapContainer ref={this.mapContainer} />;
  }
}

export default ThemedMap;

