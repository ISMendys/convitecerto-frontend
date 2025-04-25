import React, { useState, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Typography,
  FormHelperText,
  Grid,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  LocationOn as LocationOnIcon,
  Place as PlaceIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import SelectBrasil from '@logicamente.info/react-select-brasil';

/**
 * Componente para seleção hierárquica de localização usando react-select-brasil
 * com estilo visual baseado diretamente nas propriedades do tema do usuário
 */
const LocationSelector = ({
  value = { estado: '', cidade: '', rua: '', completo: '' },
  onChange,
  error,
  helperText,
  required = false
}) => {
  const theme = useTheme();
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [selectedCidade, setSelectedCidade] = useState(null);
  
  // Inicializar estado e cidade a partir do valor inicial
  useEffect(() => {
    if (value.estado && !selectedEstado) {
      // Encontrar o objeto de estado correspondente
      const estadoObj = { value: value.estado, label: getEstadoLabel(value.estado) };
      setSelectedEstado(estadoObj);
    }
  }, [value.estado]);
  
  // Função auxiliar para obter o nome do estado a partir da sigla
  const getEstadoLabel = (sigla) => {
    const estados = {
      'AC': 'Acre',
      'AL': 'Alagoas',
      'AP': 'Amapá',
      'AM': 'Amazonas',
      'BA': 'Bahia',
      'CE': 'Ceará',
      'DF': 'Distrito Federal',
      'ES': 'Espírito Santo',
      'GO': 'Goiás',
      'MA': 'Maranhão',
      'MT': 'Mato Grosso',
      'MS': 'Mato Grosso do Sul',
      'MG': 'Minas Gerais',
      'PA': 'Pará',
      'PB': 'Paraíba',
      'PR': 'Paraná',
      'PE': 'Pernambuco',
      'PI': 'Piauí',
      'RJ': 'Rio de Janeiro',
      'RN': 'Rio Grande do Norte',
      'RS': 'Rio Grande do Sul',
      'RO': 'Rondônia',
      'RR': 'Roraima',
      'SC': 'Santa Catarina',
      'SP': 'São Paulo',
      'SE': 'Sergipe',
      'TO': 'Tocantins'
    };
    
    return estados[sigla] || sigla;
  };
  
  // Manipular mudança de estado
  const handleEstadoChange = (estadoObj) => {
    setSelectedEstado(estadoObj);
    setSelectedCidade(null);
    
    onChange({
      ...value,
      estado: estadoObj?.value || '',
      cidade: '',
      completo: atualizarCompleto(estadoObj?.label || '', '', value.rua)
    });
  };
  
  // Manipular mudança de cidade
  const handleCidadeChange = (cidadeObj) => {
    setSelectedCidade(cidadeObj);
    
    if (selectedEstado) {
      onChange({
        ...value,
        cidade: cidadeObj?.value || '',
        completo: atualizarCompleto(selectedEstado.label, cidadeObj?.label || '', value.rua)
      });
    }
  };
  
  // Manipular mudança de rua
  const handleRuaChange = (event) => {
    const novaRua = event.target.value;
    
    onChange({
      ...value,
      rua: novaRua,
      completo: atualizarCompleto(
        selectedEstado?.label || '', 
        selectedCidade?.label || '', 
        novaRua
      )
    });
  };
  
  // Função para atualizar o campo completo
  const atualizarCompleto = (estado, cidade, rua) => {
    const partes = [];
    
    if (rua) partes.push(rua);
    if (cidade) partes.push(cidade);
    if (estado) partes.push(estado);
    
    return partes.join(', ');
  };
  
  // Estilo customizado para os selects usando diretamente as propriedades do tema
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '56px',
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      borderColor: error 
        ? theme.palette.error.main 
        : state.isFocused 
          ? theme.palette.primary.main 
          : alpha(theme.palette.primary.main, 0.3),
      boxShadow: error 
        ? `0 0 0 2px ${alpha(theme.palette.error.main, 0.2)}` 
        : state.isFocused 
          ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`
          : 'none',
      '&:hover': {
        borderColor: error 
          ? theme.palette.error.main 
          : theme.palette.primary.main,
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
      },
      transition: 'all 0.2s ease',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 14px',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
      color: theme.palette.text.primary,
    }),
    singleValue: (provided) => ({
      ...provided,
      color: theme.palette.text.primary,
    }),
    placeholder: (provided) => ({
      ...provided,
      color: theme.palette.text.secondary,
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: theme.palette.primary.main,
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.primary.main,
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      zIndex: 1000,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? theme.palette.primary.dark
        : state.isFocused 
          ? theme.palette.primary.main
          : theme.palette.divider,
      color: state.isSelected 
        ? theme.palette.primary.contrastText
        : state.isFocused 
          ? theme.palette.primary.contrastText
          : theme.palette.secondary.black ,
      '&:hover': {
        color: theme.palette.primary.contrastText,
        backgroundColor: state.isSelected 
          ? theme.palette.primary.main
          : theme.palette.primary.main
      },
      padding: '10px 14px',
    }),
    noOptionsMessage: (provided) => ({
      ...provided,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
    }),
    loadingMessage: (provided) => ({
      ...provided,
      color: theme.palette.text.secondary,
      backgroundColor: theme.palette.background.paper,
    }),
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        gap: 1
      }}>
        <LocationOnIcon color="primary" />
        <Typography 
          variant="body1" 
          sx={{ 
            fontWeight: 500,
            fontSize: '1rem',
            color: theme.palette.text.primary
          }}
        >
          Localização {required && <span style={{ color: theme.palette.error.main }}>*</span>}
        </Typography>
      </Box>
      

      <Box
  sx={{
    display: 'flex',
    gap: 2,             // espaçamento entre os campos
    flexWrap: 'nowrap', // força todos na mesma linha
    width: '100%',
    '& > div': {
      flex: 1,          // cada filho ocupa igual espaço
      minWidth: 0       // permite que encolha corretamente
    }
  }}
>
  {/* Estado */}
  <Box>
    <SelectBrasil.Estados
      placeholder="Selecione o estado"
      value={selectedEstado}
      onChange={handleEstadoChange}
      styles={customStyles}
      isClearable
      isSearchable
      noOptionsMessage={() => "Nenhum estado encontrado"}
      loadingMessage={() => "Carregando..."}
    />
  </Box>

  {/* Cidade */}
  <Box>
    <SelectBrasil.Cidades
      placeholder="Selecione a cidade"
      estado={selectedEstado?.value || ''}
      value={selectedCidade}
      onChange={handleCidadeChange}
      styles={customStyles}
      isDisabled={!selectedEstado}
      isClearable
      isSearchable
      noOptionsMessage={() =>
        selectedEstado ? "Nenhuma cidade encontrada" : "Selecione um estado primeiro"
      }
      loadingMessage={() => "Carregando..."}
    />
  </Box>

  {/* Rua */}
  <Box>
    <TextField
      fullWidth
      label="Rua, número, bairro"
      value={value.rua || ''}
      onChange={handleRuaChange}
      placeholder="Ex: Av. Brasil, 123 - Centro"
      disabled={!selectedCidade}
      required={required}
      error={!!error}
      helperText={error ? helperText : ''}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <HomeIcon color="primary" />
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: '56px',
          borderRadius: theme.shape.borderRadius,
          transition: 'all 0.2s ease',
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            backgroundColor: alpha(theme.palette.background.paper, 0.9),
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main
          },
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
          }
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          }
        }
      }}
    />
  </Box>
</Box>
      
      {error && (
        <FormHelperText error sx={{ ml: 2, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
      
      {/* Visualização da localização completa */}
      {value.completo && (
        <Box 
          sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: theme.shape.borderRadius,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <PlaceIcon color="primary" fontSize="small" />
          <Typography variant="body2" color="textSecondary">
            {value.completo}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default LocationSelector;
