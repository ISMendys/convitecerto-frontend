import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ColorLens as ColorLensIcon,
  Check as CheckIcon
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
    if (selectedColor !== value) {
      setShowFeedback(true);
      const timer = setTimeout(() => setShowFeedback(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedColor, value]);
  
  // Desenhar o gradiente de cores no canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Gradiente horizontal (vermelho -> verde -> azul)
    const gradientH = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientH.addColorStop(0, 'rgb(255, 0, 0)');
    gradientH.addColorStop(0.33, 'rgb(255, 255, 0)');
    gradientH.addColorStop(0.5, 'rgb(0, 255, 0)');
    gradientH.addColorStop(0.66, 'rgb(0, 255, 255)');
    gradientH.addColorStop(0.83, 'rgb(0, 0, 255)');
    gradientH.addColorStop(1, 'rgb(255, 0, 255)');
    
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
  }, [canvasRef]);
  
  // Função para obter a cor do pixel no canvas
  const getColorFromCanvas = (x, y) => {
    if (!canvasRef.current) return '#000000';
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelData = ctx.getImageData(x, y, 1, 1).data;
    
    // Verificar se os valores são válidos
    if (pixelData && pixelData.length >= 3) {
      const r = pixelData[0];
      const g = pixelData[1];
      const b = pixelData[2];
      
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      }
    }
    
    return '#000000';
  };

  // Função para aplicar cor com feedback
  const applyColor = (color) => {
    setSelectedColor(color);
    onChange(color);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 1000);
  };
  
  // Manipular clique/arrasto no canvas
  const handleCanvasMouseDown = (e) => {
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasMouseMove = (e) => {
    if (!isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  // Manipular eventos de toque para dispositivos móveis
  const handleCanvasTouchStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasTouchMove = (e) => {
    e.preventDefault();
    if (!isDragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    const color = getColorFromCanvas(x, y);
    applyColor(color);
  };
  
  const handleCanvasTouchEnd = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  // Manipular mudança direta no campo HEX
  const handleHexChange = (event) => {
    const newValue = event.target.value;
    // Verificar se é um valor HEX válido
    if (/^#[0-9A-F]{6}$/i.test(newValue)) {
      applyColor(newValue);
    }
  };
  
  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 1,
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'flex-start' : 'center'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          mb: isMobile ? 1 : 0,
          width: isMobile ? '100%' : 'auto'
        }}>
          <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
            {icon}
          </Box>
          <Typography variant="subtitle2" fontWeight="500">
            {label}
          </Typography>
        </Box>
        
        <Box sx={{ 
          ml: isMobile ? 0 : 'auto', 
          display: 'flex', 
          alignItems: 'center',
          alignSelf: isMobile ? 'flex-end' : 'auto',
          position: 'relative'
        }}>
          <Box
            sx={{
              width: isMobile ? 32 : 24,
              height: isMobile ? 32 : 24,
              borderRadius: '50%',
              bgcolor: selectedColor,
              border: `2px solid ${theme.palette.divider}`,
              mr: 1,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative',
              transition: 'all 0.3s ease',
              transform: showFeedback ? 'scale(1.1)' : 'scale(1)'
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
                  animation: 'fadeInOut 1s ease-in-out'
                }}
              >
                <CheckIcon sx={{ fontSize: isMobile ? 16 : 12 }} />
              </Box>
            )}
          </Box>
          
          {/* Chip com cor selecionada */}
          <Chip
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
              transform: showFeedback ? 'scale(1.05)' : 'scale(1)'
            }}
          />
        </Box>
      </Box>

      {/* Cores predefinidas */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block', color: theme.palette.text.secondary }}>
          Cores populares:
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1,
          mb: 2
        }}>
          {presetColors.map((color, index) => (
            <Tooltip key={index} title={color?.toUpperCase()}>
              <IconButton
                onClick={() => applyColor(color)}
                sx={{
                  width: isMobile ? 32 : 28,
                  height: isMobile ? 32 : 28,
                  bgcolor: color,
                  border: `2px solid ${selectedColor === color ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: '50%',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                  }
                }}
              />
            </Tooltip>
          ))}
        </Box>
      </Box>
      
      <TextField
        fullWidth
        value={selectedColor}
        onChange={handleHexChange}
        variant="outlined"
        size={isMobile ? "medium" : "small"}
        sx={{ mb: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">#</InputAdornment>
          ),
        }}
      />
      
      <Box
        sx={{
          width: '100%',
          height: isMobile ? 120 : 100,
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'crosshair',
          border: `1px solid ${theme.palette.divider}`,
          touchAction: 'none' // Previne scroll durante o toque
        }}
      >
        <canvas
          ref={canvasRef}
          width={300}
          height={isMobile ? 120 : 100}
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
      
      {isMobile && (
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 1, 
            color: theme.palette.text.secondary,
            fontSize: '0.75rem'
          }}
        >
          Toque e arraste para selecionar uma cor
        </Typography>
      )}

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

