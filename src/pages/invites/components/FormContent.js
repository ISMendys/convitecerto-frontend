// File: FormContent.js
import React from 'react';
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  alpha,
  Paper,
  Tab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ColorPicker from './ColorPicker';
import FontPicker from './FontPicker';
import InfoIcon from '@mui/icons-material/Info';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import Tabs from '@mui/material/Tabs';

const StyledTabs = ({ tabValue, handleTabChange }) => {
  return (
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      variant="fullWidth"
      sx={{
        width: '100%',
        '& .MuiTabs-indicator': {
          backgroundColor: 'primary.main',
          height: 3,
          borderRadius: '3px 3px 0 0'
        },
        '& .MuiTab-root': {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          minHeight: 48,
          padding: '12px 16px',
          '&.Mui-selected': {
            color: 'primary.main'
          }
        }
      }}
    >
      <Tab icon={<InfoIcon />} label="Informações" iconPosition="start" />
      <Tab icon={<ColorLensIcon />} label="Personalização" iconPosition="start" />
    </Tabs>
  );
};

const OptimizedFontPicker = ({ value, onChange }) => {
  const theme = useTheme();

  const fonts = [
    { id: 'Roboto, sans-serif', name: 'Roboto' },
    { id: 'Montserrat, sans-serif', name: 'Montserrat' },
    { id: 'Open Sans, sans-serif', name: 'Open Sans' },
    { id: 'Lato, sans-serif', name: 'Lato' },
    { id: 'Poppins, sans-serif', name: 'Poppins' },
    { id: 'Playfair Display, serif', name: 'Playfair Display' },
    { id: 'Merriweather, serif', name: 'Merriweather' },
    { id: 'Raleway, sans-serif', name: 'Raleway' },
    { id: 'Ubuntu, sans-serif', name: 'Ubuntu' },
    { id: 'Dancing Script, cursive', name: 'Dancing Script' }
  ];

  const handleFontChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
      <InputLabel id="font-select-label">Fonte</InputLabel>
      <Select
        labelId="font-select-label"
        value={value || fonts[0].id}
        onChange={handleFontChange}
        label="Fonte"
        inputProps={{ style: { fontFamily: value || '' } }}
        sx={{
          '& .MuiSelect-select': {
            fontFamily: value || ''
          }
        }}
      >
        {fonts.map((font) => (
          <MenuItem
            key={font.id}
            value={font.id}
            sx={{ fontFamily: font?.id }}
          >
            {font.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const FormContent = React.memo(({ formData, setFormData, tabValue, handleTabChange, handleFontChange, events }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: isMobile ? 0 : 2,
        border: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
        height: '100%',
        width: isMobile ? '100%' : 400,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}`, height: '48px', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <StyledTabs tabValue={tabValue} handleTabChange={handleTabChange} />
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Box sx={{
          p: 3,
          height: '100%',
          overflow: 'auto',
          display: tabValue === 0 ? 'block' : 'none'
        }}>
          <TextField fullWidth label="Título do Convite" name="title" value={formData?.title} onChange={handleChange} margin="normal" required />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>Evento</InputLabel>
            <Select name="eventId" value={formData?.eventId} onChange={handleChange} label="Evento">
              <MenuItem value="">Selecione ou crie um novo evento</MenuItem>
              {events?.map(event => (
                <MenuItem key={event.id} value={event.id}>{event.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField fullWidth label="Descrição (opcional)" name="description" value={formData?.description} onChange={handleChange} margin="normal" />

          <TextField fullWidth label="Mensagem Personalizada" name="customText" value={formData?.customText} onChange={handleChange} margin="normal" multiline rows={4} />

          <Box sx={{ height: 100 }} />
        </Box>

        <Box sx={{
          p: 3,
          height: '100%',
          overflow: 'auto',
          display: tabValue === 1 ? 'block' : 'none'
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>Cores</Typography>

          <Box sx={{ mb: 4 }}>
            <ColorPicker
              label="Cor de Fundo"
              value={formData?.bgColor}
              onChange={(color) => setFormData(prev => ({ ...prev, bgColor: color }))}
            />
          </Box>

          <Box sx={{ mb: 4 }}>
            <ColorPicker
              label="Cor de Destaque"
              value={formData?.accentColor}
              onChange={(color) => setFormData(prev => ({ ...prev, accentColor: color }))}
            />
          </Box>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3, mt: 4 }}>Tipografia</Typography>

          <OptimizedFontPicker value={formData?.fontFamily} onChange={handleFontChange} />

          <Box sx={{ mt: 3, p: 3, borderRadius: 2, border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`, bgcolor: alpha(theme.palette.background.paper, 0.7), fontFamily: formData?.fontFamily, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Amostra da fonte: Aa Bb Cc 123</Typography>
          </Box>

          <Box sx={{ height: 100 }} />
        </Box>
      </Box>
    </Paper>
  );
});

export default FormContent;
