import React, { useState, useRef } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
  Radio,
  Snackbar,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Paper,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  AddPhotoAlternate as AddPhotoIcon
} from '@mui/icons-material';

/**
 * Componente para upload de imagem com opções de URL ou arquivo local
 * com conversão para base64
 */
const ImageUploadField = ({
  value = { type: 'url', url: '', base64: '' },
  onChange,
  title = false,
  error = null,
  helperText,
  required = false
}) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value.type === 'url' ? value.url : value.base64);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // Converter arquivo para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Manipular mudança no tipo de upload (URL ou arquivo)
  const handleTypeChange = (event) => {
    const newType = event.target.value;
    onChange({
      type: newType,
      url: newType === 'url' ? value.url : '',
      base64: newType === 'file' ? value.base64 : ''
    });
    console.log('Tipo de upload alterado:', value);
    // Atualizar preview
    if (newType === 'url') {
      setPreview(value.url);
    } else if (newType === 'file' && value.base64) {
      setPreview(value.base64);
    } else {
      setPreview(null);
    }
  };

  // Manipular mudança na URL
  const handleUrlChange = (event) => {
    const newUrl = event.target.value;
    onChange({
      ...value,
      url: newUrl
    });
    
    // Atualizar preview se a URL for válida
    if (newUrl && isValidUrl(newUrl)) {
      setPreview(newUrl);
    } else {
      setPreview(null);
    }
  };

  // Manipular upload de arquivo
  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        setSnackbarMessage('Por favor, selecione apenas arquivos de imagem.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }
      
      setLoading(true);
      
      try {
        // Converter para base64
        const base64String = await convertToBase64(file);
        
        // Atualizar preview
        setPreview(base64String);
        
        // Atualizar valor
        onChange({
          ...value,
          type: 'file',
          base64: base64String,
          fileName: file.name
        });
      } catch (error) {
        setSnackbarMessage('Erro ao processar a imagem. Por favor, tente novamente.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    }
  };

  // Abrir seletor de arquivo
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  // Limpar imagem
  const handleClearImage = () => {
    onChange({
      ...value,
      url: '',
      base64: '',
      fileName: ''
    });
    setPreview(null);
    
    // Limpar input de arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Verificar se a URL é válida
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Verificar se a URL é de uma imagem (simplificado)
  const isImageUrl = (url) => {
    return url && (
      url.endsWith('.jpg') || 
      url.endsWith('.jpeg') || 
      url.endsWith('.png') || 
      url.endsWith('.gif') || 
      url.endsWith('.webp') || 
      url.endsWith('.svg')
    );
  };

  return (
    <Box sx={{ mb: 3 }}>
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        {title ? (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mb: 2,
            gap: 1
          }}>
            <ImageIcon color="primary" />
            <FormLabel 
              component="legend" 
              sx={{ 
                fontWeight: 500,
                fontSize: '1rem',
                color: theme.palette.text.primary
              }}
            >
              Imagem do Evento {required && <span style={{ color: theme.palette.error.main }}>*</span>}
            </FormLabel>
          </Box>
          ) : null}

        <RadioGroup
          row
          name="upload-type"
          value={value.type}
          onChange={handleTypeChange}
          sx={{ mb: 2 }}
        >
          <FormControlLabel 
            value="url" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LinkIcon fontSize="small" />
                <Typography variant="body2">URL</Typography>
              </Box>
            } 
          />
          <FormControlLabel 
            value="file" 
            control={<Radio />} 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <UploadIcon fontSize="small" />
                <Typography variant="body2">Upload</Typography>
              </Box>
            } 
          />
        </RadioGroup>

        {/* Campo de URL */}
        {value.type === 'url' && (
          <TextField
            fullWidth
            label="URL da imagem"
            value={value.url}
            onChange={handleUrlChange}
            error={!!error}
            helperText={helperText || "Insira a URL de uma imagem (jpg, png, gif, etc.)"}
            placeholder="https://exemplo.com/imagem.jpg"
            InputProps={{
              startAdornment: (
                <Box sx={{ mr: 1, color: theme.palette.primary.main }}>
                  <LinkIcon />
                </Box>
              ),
            }}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': { 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }
            }}
          />
        )}

        {/* Campo de upload de arquivo */}
        {value.type === 'file' && (
          <Box sx={{ mb: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                mb: 1
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={handleBrowseClick}
                startIcon={loading ? <CircularProgress size={20} /> : <AddPhotoIcon />}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  flexGrow: { xs: 1, sm: 0 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                {loading ? 'Processando...' : 'Selecionar Imagem'}
              </Button>
              
              <Typography variant="body2" color="textSecondary">
                {value.fileName ? value.fileName : 'Nenhum arquivo selecionado'}
              </Typography>
            </Box>
            
            {error && (
              <Typography variant="caption" color="error">
                {helperText}
              </Typography>
            )}
          </Box>
        )}

        {/* Preview da imagem */}
        {preview && (
          <Paper 
            elevation={2} 
            sx={{ 
              p: 1, 
              mb: 2, 
              borderRadius: 2,
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Box 
                component="img"
                src={preview}
                alt="Preview"
                sx={{
                  width: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain',
                  borderRadius: 1,
                  display: 'block'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x200?text=Imagem+Inválida';
                }}
              />
              
              <Tooltip title="Remover imagem">
                <IconButton
                  size="small"
                  color="error"
                  onClick={handleClearImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(255,255,255,0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.9)',
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" sx={{color: 'red'}} />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        )}
      </FormControl>
            
      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ borderRadius: 1, color: theme.palette.primary.contrastText }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImageUploadField;
