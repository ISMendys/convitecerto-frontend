import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Box, InputAdornment, ClickAwayListener, Paper, List, ListItem, ListItemText, Typography, CircularProgress, TextField } from '@mui/material';
import { LocationOn as LocationOnIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { useGeocodingCore } from '@mapbox/search-js-react';
import { useTheme } from '@mui/material/styles';

// O `value` da prop será usado APENAS para o valor inicial.
const MapboxLocationField = ({
  accessToken,
  value: initialValue = '', // Renomeado para clareza
  onChange,
  onLocationSelect,
  isValid = false,
  ...otherProps
}) => {
  // O componente agora controla seu próprio valor de texto.
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();

  // <-- ALTERAÇÃO CRÍTICA: REMOVER O USEEFFECT QUE SINCRONIZA `value` E `inputValue`.
  // Isso quebra o ciclo de feedback que estava causando todos os problemas.
  // Se o valor inicial mudar no pai (ex: ao carregar um evento), sincronizamos.
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);


  const geocodingCore = useGeocodingCore({ accessToken, options: { language: 'pt', country: 'BR', types: ['address', 'place', 'poi'], limit: 5 } });

  const searchSuggestions = useCallback(async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await geocodingCore.suggest(query);
      setSuggestions(response.features || []);
      setShowSuggestions(response.features && response.features.length > 0);
    } catch (error) { console.error('Erro ao buscar sugestões:', error); }
    finally { setIsLoading(false); }
  }, [geocodingCore]);

  useEffect(() => {
    const timeoutId = setTimeout(() => { searchSuggestions(inputValue); }, 300);
    return () => clearTimeout(timeoutId);
  }, [inputValue, searchSuggestions]);

  // Este handler é APENAS para digitação manual.
  const handleInputChange = (event) => {
    const manualValue = event.target.value;
    setInputValue(manualValue);
    if (onChange) {
      onChange(event);
    }
  };

  // Este handler é APENAS para seleção da lista.
  const handleSuggestionSelect = async (suggestion) => {
    const fullAddress = suggestion.properties.full_address || suggestion.properties.name;
    // Atualiza o texto visualmente
    setInputValue(fullAddress);
    // Esconde as sugestões
    setShowSuggestions(false);
    
    // Constrói o objeto de dados completo
    const locationData = {
      completo: fullAddress,
      rua: suggestion.properties.address || '',
      cidade: suggestion.properties.place_formatted?.split(',')[0] || '',
      estado: suggestion.properties.context?.region?.name || '',
      cep: suggestion.properties.context?.postcode?.name || '',
      coordinates: suggestion.geometry.coordinates,
      mapbox_id: suggestion.properties.mapbox_id,
    };

    // Notifica o pai sobre a SELEÇÃO VÁLIDA.
    // **NÃO CHAMA `onChange` AQUI.**
    if (onLocationSelect) {
      onLocationSelect(locationData);
    }
  };

  const handleClickAway = () => { setShowSuggestions(false); };
  const handleKeyDown = (event) => { if (event.key === 'Escape') { setShowSuggestions(false); } };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: 'relative', width: '100%' }}>
        <TextField
          value={inputValue} // Usa o estado interno
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue && inputValue.length >= 3 && searchSuggestions(inputValue)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon color={isValid ? 'error' : 'action'} sx={{color: theme.palette.primary.main}}/>
              </InputAdornment> ),
            endAdornment: isLoading ? (
              <InputAdornment position="end"><CircularProgress color="inherit" size={20} /></InputAdornment>
            ) : isValid ? (
              <InputAdornment position="end"><CheckCircleIcon color="success" /></InputAdornment>
            ) : null,
            ...otherProps.InputProps,
          }}
          {...otherProps}
        />
        {showSuggestions && suggestions.length > 0 && (
          <Paper elevation={3} sx={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1300, maxHeight: 300, overflow: 'auto', mt: 1 }}>
            <List dense>
              {suggestions.map((s) => (
                <ListItem key={s.properties.mapbox_id} button onClick={() => handleSuggestionSelect(s)}>
                  <ListItemText primary={s.properties.name} secondary={s.properties.full_address || s.properties.place_formatted} />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>
    </ClickAwayListener>
  );
};

export default MapboxLocationField;