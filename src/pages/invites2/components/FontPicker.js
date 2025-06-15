import React from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
  useMediaQuery
} from '@mui/material';
import Zoom from '@mui/material/Zoom';
import { useTheme, alpha } from '@mui/material/styles';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import FormatSizeIcon from '@mui/icons-material/FormatSize';

const FontPicker = ({
  value,
  onChange,
  fonts,
  label = "Fonte",
  fullWidth = true,
  showPreview = true
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const handleFontChange = (event) => {
    onChange(event.target.value);
  };

  const transitionComponent = { transition: Zoom };

  return (
    <Box sx={{ width: fullWidth ? '100%' : 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: isMobile ? 1.5 : 2,
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          background: `linear-gradient(to bottom, ${alpha(theme.palette.background.default, 0.8)}, ${theme.palette.background.default})`,
          position: 'relative',
          overflow: 'hidden',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '4px',
            background: `linear-gradient(to right, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.7)})`
          }
        }}
      >
        {/* Cabeçalho */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: isMobile ? 1 : 1.5,
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            mb: isMobile ? 0.5 : 0
          }}>
            <Box
              sx={{
                mr: 1,
                color: theme.palette.primary.main,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? 28 : 32,
                height: isMobile ? 28 : 32,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.primary.main, 0.1)
              }}
            >
              <TextFieldsIcon fontSize={isMobile ? "small" : "medium"} />
            </Box>
            <Typography 
              variant={isMobile ? "body1" : "subtitle1"} 
              fontWeight={600}
            >
              {label}
            </Typography>
          </Box>
        </Box>

        {/* Select no topo */}
        <Box sx={{ mb: showPreview ? (isMobile ? 1.5 : 2) : 0 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel
              id="font-select-label"
              sx={{
                fontWeight: 500,
                fontSize: isMobile ? '0.875rem' : undefined,
                '&.Mui-focused': { color: theme.palette.primary.main }
              }}
            >
              {label}
            </InputLabel>
            <Select
              labelId="font-select-label"
              value={value || (fonts && fonts[0] ? fonts[0].id : '')}
              onChange={handleFontChange}
              label={label}
              inputProps={{ style: { fontFamily: value } }}
              sx={{
                borderRadius: 1,
                bgcolor: theme.palette.background.default,
                height: isMobile ? '48px' : '56px',
                fontSize: isMobile ? '0.875rem' : undefined,
                '& .MuiSelect-select': {
                  fontFamily: value,
                  padding: isMobile ? '12px 14px' : undefined
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha(theme.palette.primary.main, 0.2)
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                },
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                },
                '&.Mui-focused': {
                  boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
                }
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: isMobile ? 250 : 300,
                    borderRadius: 12,
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                },
                slots: transitionComponent
              }}
            >
              {fonts && fonts.map((font) => (
                <MenuItem
                  key={font.id}
                  value={font.id}
                  sx={{
                    fontFamily: font.id,
                    py: isMobile ? 0.75 : 1,
                    fontSize: isMobile ? '0.875rem' : undefined,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.08)
                    },
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.12),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.16)
                      }
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormatSizeIcon sx={{ 
                      mr: 1, 
                      color: alpha(theme.palette.primary.main, 0.7), 
                      fontSize: isMobile ? 18 : 20 
                    }} />
                    <Typography 
                      variant="body1" 
                      fontWeight={500}
                      sx={{ fontSize: isMobile ? '0.875rem' : undefined }}
                    >
                      {font.name}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Preview embaixo */}
        {showPreview && (
          <Tooltip
            title="Visualização da fonte selecionada"
            placement="top"
            arrow
            slots={transitionComponent}
          >
            <Box
              sx={{
                width: '100%',
                p: isMobile ? 1.5 : 2,
                mt: isMobile ? '20%' : '30%',
                borderRadius: 1,
                bgcolor: alpha(theme.palette.background.paper, 0.7),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
                fontFamily: value,
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '3px',
                  background: `linear-gradient(to right, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.light, 0.5)})`
                },
                '&:hover': {
                  transform: isMobile ? 'scale(1.02)' : 'translateY(-5px) scale(1.02)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                  bgcolor: theme.palette.background.paper
                },
                transition: 'all 0.3s ease'
              }}
            >
              <Typography 
                variant={isMobile ? "h6" : "h5"} 
                sx={{ 
                  mb: isMobile ? 0.5 : 1, 
                  fontWeight: 500 
                }}
              >
                Aa Bb Cc
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: isMobile ? 1 : 1.5,
                  fontSize: isMobile ? '0.875rem' : undefined
                }}
              >
                0123456789
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: isMobile ? 1.5 : 2,
                  py: 0.5,
                  borderRadius: 10,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  fontSize: isMobile ? '0.7rem' : undefined
                }}
              >
                {value}
              </Typography>
            </Box>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
};

export default FontPicker;

