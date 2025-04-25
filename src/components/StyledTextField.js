import React from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de campo de texto estilizado reutilizável
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.name - Nome do campo
 * @param {any} props.value - Valor do campo
 * @param {Function} props.onChange - Função de mudança
 * @param {string} [props.label] - Rótulo do campo
 * @param {string} [props.placeholder] - Placeholder do campo
 * @param {boolean} [props.required=false] - Se o campo é obrigatório
 * @param {boolean} [props.fullWidth=true] - Se o campo deve ocupar toda a largura disponível
 * @param {React.ReactNode} [props.startIcon] - Ícone no início do campo
 * @param {React.ReactNode} [props.endIcon] - Ícone no final do campo
 * @param {boolean} [props.multiline=false] - Se o campo é multiline
 * @param {number} [props.rows=1] - Número de linhas (para multiline)
 * @param {string} [props.type='text'] - Tipo do campo
 * @param {string} [props.variant='outlined'] - Variante do campo
 * @param {boolean} [props.error=false] - Se o campo tem erro
 * @param {string} [props.helperText] - Texto de ajuda/erro
 * @param {Object} [props.sx] - Estilos adicionais
 */
const StyledTextField = ({ 
  name, 
  value, 
  onChange, 
  label, 
  placeholder, 
  required = false, 
  fullWidth = true,
  startIcon,
  endIcon,
  multiline = false,
  rows = 1,
  type = 'text',
  variant = 'outlined',
  error = false,
  helperText,
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <TextField
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      label={label}
      placeholder={placeholder}
      fullWidth={fullWidth}
      required={required}
      variant={variant}
      multiline={multiline}
      rows={rows}
      type={type}
      error={error}
      helperText={helperText}
      InputProps={{
        startAdornment: startIcon ? (
          <InputAdornment position="start">
            {React.cloneElement(startIcon, {
              sx: {
                color: error 
                  ? theme.palette.error.main 
                  : theme.palette.mode === 'dark'
                    ? alpha(theme.palette.primary.main, 0.8)
                    : alpha(theme.palette.primary.main, 0.7),
                fontSize: 20
              }
            })}
          </InputAdornment>
        ) : null,
        endAdornment: endIcon ? (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ) : null
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
          height: multiline ? 'auto' : '56px',
          transition: 'all 0.2s ease',
          backgroundColor: theme.palette.mode === 'dark' 
            ? alpha(theme.palette.background.paper, 0.6) 
            : 'transparent',
          '&:hover': { 
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
          },
          '&.Mui-focused': {
            boxShadow: `0 0 0 2px ${alpha(
              error ? theme.palette.error.main : theme.palette.primary.main, 
              theme.palette.mode === 'dark' ? 0.3 : 0.2
            )}`
          }
        },
        ...sx
      }}
    />
  );
};

export default StyledTextField;
