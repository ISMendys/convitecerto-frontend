import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Collapse
} from '@mui/material';
import {
  ColorLens as ColorLensIcon,
  Check as CheckIcon,
  Palette as PaletteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

const ColorPicker = ({ 
  value, 
  onChange, 
  label, 
  icon = <ColorLensIcon />,
  fullWidth = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState(value);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Cores predefinidas populares
  const presetColors = [
    '#6a1b9a', '#e91e63', '#f44336', '#ff9800', 
    '#ffeb3b', '#4caf50', '#2196f3', '#9c27b0',
    '#795548', '#607d8b', '#000000', '#ffffff'
  ];

  // Atualizar cor selecionada quando value muda
  useEffect(() => {
    setSelectedColor(value);
  }, [value]);

  // Mostrar feedback visual quando cor muda
  useEffect(() => {
    if (selectedColor !== value && selectedColor) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 800);
      return () => clearTimeout(timer);
    }
  }, [selectedColor, value]);
  
  // Desenhar o gradiente de cores no canvas
  useEffect(() => {
    if (!canvasRef.current || !showColorPicker) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Gradiente horizontal (vermelho -> verde -> azul)
    const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientH.addColorStop(0, 'rgb(255, 0, 0)');
    gradientH.addColorStop(0.17, 'rgb(255, 255, 0)');
    gradientH.addColorStop(0.33, 'rgb(0, 255, 0)');
    gradientH.addColorStop(0.5, 'rgb(0, 255, 255)');
    gradientH.addColorStop(0.67, 'rgb(0, 0, 255)');
    gradientH.addColorStop(0.83, 'rgb(255, 0, 255)');
    gradientH.addColorStop(1, 'rgb(255, 0, 0)');
    
    // Preencher com o gradiente horizontal
    ctx.fillStyle = gradientH;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Gradiente vertical (transparente -> branco -> preto)
    const gradientV = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientV.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradientV.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
    gradientV.addColorStop(1, 'rgba(0, 0, 0, 1)');
    
    // Aplicar o gradiente vertical
    ctx.fillStyle = gradientV;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef, showColorPicker]);
  
  // Função para obter a cor do pixel no canvas
  const getColorFromCanvas = (x, y) => {
    if (!canvasRef.current) return selectedColor || '#000000';
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Garantir que as coordenadas estão dentro dos limites
    const clampedX = Math.max(0, Math.min(Math.floor(x), canvas.width - 1));
    const clampedY = Math.max(0, Math.min(Math.floor(y), canvas.height - 1));
    
    try {
      const pixelData = ctx.getImageData(clampedX, clampedY, 1, 1).data;
      
      // Verificar se os valores são válidos
      if (pixelData && pixelData.length >= 3) {
        const r = pixelData[0];
        const g = pixelData[1];
        const b = pixelData[2];
        
        if (!isNaN(r) && !isNaN(g) && !isNaN(b) && r >= 0 && r <= 255 && g >= 0 && g <= 255 && b >= 0 && b <= 255) {
          return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        }
      }
    } catch (error) {
      console.warn('Erro ao obter cor do canvas:', error);
    }
    
    return selectedColor || '#000000';
  };

  // Função para aplicar cor com feedback
  const applyColor = (color) => {
    if (color && color !== selectedColor && /^#[0-9A-F]{6}$/i.test(color)) {
      setSelectedColor(color);
      onChange(color);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 800);
    }
  };

  // Obter coordenadas do evento (mouse ou touch)
  const getEventCoordinates = (e) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    return { x, y };
  };
  
  // Manipular clique/arrasto no canvas
  const handleCanvasMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const { x, y } = getEventCoordinates(e);
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    
    const { x, y } = getEventCoordinates(e);
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  // Manipular eventos de toque para dispositivos móveis
  const handleCanvasTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const { x, y } = getEventCoordinates(e);
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasTouchMove = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) return;
    
    const { x, y } = getEventCoordinates(e);
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasTouchEnd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  // Manipular mudança direta no campo HEX
  const handleHexChange = (event) => {
    let newValue = event.target.value;
    
    // Remover caracteres inválidos
    newValue = newValue.replace(/[^0-9A-Fa-f]/g, '');
    
    // Limitar a 6 caracteres
    if (newValue.length > 6) {
      newValue = newValue.slice(0, 6);
    }
    
    // Aplicar cor se tiver 6 caracteres
    if (newValue.length === 6) {
      const fullHex = '#' + newValue;
      applyColor(fullHex);
    } else if (newValue.length === 3) {
      // Converter formato curto para longo
      const longHex = '#' + newValue.split('').map(char => char + char).join('');
      applyColor(longHex);
    }
  };

  // Função para alternar o seletor de cores
  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };
  
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto', mb: 2 }}>
      {/* Header do seletor */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2,
        cursor: 'pointer'
      }}
      onClick={toggleColorPicker}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center'
        }}>
          <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
            {icon}
          </Box>
          <Typography variant="subtitle2" fontWeight="500">
            {label}
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1
        }}>
          {/* Cor atual */}
          <Box
            sx={{
              width: isMobile ? 40 : 36,
              height: isMobile ? 40 : 36,
              borderRadius: '50%',
              bgcolor: selectedColor,
              border: `3px solid ${theme.palette.background.paper}`,
              boxShadow: `0 0 0 1px ${theme.palette.divider}, 0 2px 8px rgba(0,0,0,0.15)`,
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: showFeedback ? 'scale(1.1)' : 'scale(1)',
              cursor: 'pointer'
            }}
          >
            {/* Feedback visual de seleção */}
            {showFeedback && (
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: selectedColor === '#ffffff' || selectedColor === '#ffeb3b' ? '#000' : '#fff',
                  animation: 'fadeInOut 0.8s ease-in-out'
                }}
              >
                <CheckIcon sx={{ fontSize: isMobile ? 20 : 18 }} />
              </Box>
            )}
          </Box>
          
          {/* Chip com cor selecionada */}
          {/* <Chip
            label={selectedColor?.toUpperCase()}
            size="small"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: theme.palette.text.primary,
              transition: 'all 0.3s ease',
              transform: showFeedback ? 'scale(1.05)' : 'scale(1)',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: theme.palette.action.hover
              }
            }}
          /> */}

          {/* Ícone de expandir/recolher */}
          <IconButton
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              transition: 'transform 0.3s ease',
              transform: showColorPicker ? 'rotate(180deg)' : 'rotate(0deg)',
              '&:hover': {
                color: theme.palette.primary.main
              }
            }}
          >
            {showColorPicker ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Seletor de cores expandido */}
      <Collapse in={showColorPicker}>
        <Paper
          elevation={2}
          sx={{
            p: 3,
            borderRadius: 2,
            border: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper
          }}
        >
          {/* Cores predefinidas */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ mb: 2, display: 'block', color: theme.palette.text.secondary, fontWeight: 500 }}>
              Cores populares:
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 1.5,
              mb: 3
            }}>
              {presetColors.map((presetColor, index) => (
                <Tooltip key={index} title={presetColor?.toUpperCase()}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      applyColor(presetColor);
                    }}
                    sx={{
                      width: isMobile ? 40 : 36,
                      height: isMobile ? 40 : 36,
                      bgcolor: presetColor,
                      border: `3px solid ${selectedColor === presetColor ? theme.palette.primary.main : theme.palette.background.paper}`,
                      boxShadow: `0 0 0 1px ${theme.palette.divider}`,
                      borderRadius: '50%',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                      }
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
          </Box>
          
          {/* Campo HEX */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: theme.palette.text.secondary, fontWeight: 500 }}>
              Código da cor:
            </Typography>
            <TextField
              fullWidth
              value={selectedColor?.replace('#', '') || ''}
              onChange={handleHexChange}
              variant="outlined"
              size="small"
              placeholder="000000"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">#</InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 6,
                style: { 
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  fontSize: '0.9rem'
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                }
              }}
            />
          </Box>
          
          {/* Canvas do seletor de cores */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: theme.palette.text.secondary, fontWeight: 500 }}>
              Seletor de cores:
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: isMobile ? 160 : 140,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'crosshair',
                border: `2px solid ${theme.palette.divider}`,
                touchAction: 'none', // Previne scroll durante o toque
                position: 'relative',
                '&:hover': {
                  borderColor: theme.palette.primary.main
                }
              }}
            >
              <canvas
                ref={canvasRef}
                width={300}
                height={isMobile ? 160 : 140}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onTouchStart={handleCanvasTouchStart}
                onTouchMove={handleCanvasTouchMove}
                onTouchEnd={handleCanvasTouchEnd}
                style={{ 
                  width: '100%', 
                  height: '100%',
                  display: 'block' // Remove espaço extra abaixo do canvas
                }}
              />
            </Box>
          </Box>
          
          <Typography 
            variant="caption" 
            sx={{ 
              color: theme.palette.text.secondary,
              fontSize: '0.75rem',
              display: 'block',
              textAlign: 'center',
              fontStyle: 'italic'
            }}
          >
            {isMobile ? 'Toque e arraste para selecionar uma cor' : 'Clique e arraste para selecionar uma cor'}
          </Typography>
        </Paper>
      </Collapse>

      {/* CSS para animação */}
      <style jsx>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        }
      `}</style>
    </Box>
  );
};

export default ColorPicker;

