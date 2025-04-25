import React from 'react';
import { Box, TextField, InputAdornment, Grid, MenuItem } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import StyledButton from './StyledButton';

/**
 * Componente de barra de pesquisa e filtros para listagens
 * 
 * @param {Object} props - Propriedades do componente
 * @param {string} props.searchTerm - Termo de busca
 * @param {Function} props.onSearchChange - Função para atualizar o termo de busca
 * @param {React.ReactNode} props.searchIcon - Ícone do campo de busca
 * @param {string} props.filterValue - Valor do filtro atual
 * @param {Function} props.onFilterChange - Função para atualizar o filtro
 * @param {Array} props.filterOptions - Opções de filtro
 * @param {string} props.filterLabel - Label do campo de filtro
 * @param {React.ReactNode} props.filterIcon - Ícone do campo de filtro
 * @param {string} props.sortValue - Valor da ordenação atual
 * @param {Function} props.onSortChange - Função para atualizar a ordenação
 * @param {Array} props.sortOptions - Opções de ordenação
 * @param {React.ReactNode} props.sortIcon - Ícone do campo de ordenação
 * @param {Array} props.actions - Array de objetos de configuração de ações
 * @param {Object} [props.sx] - Estilos adicionais
 */
const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  searchIcon,
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = 'Filtrar por',
  filterIcon,
  sortValue,
  onSortChange,
  sortOptions = [],
  sortIcon,
  actions = [],
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ p: 3, ...sx }}>
      <Grid container spacing={3} alignItems="center">
        {/* Campo de busca */}
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            placeholder="Buscar..."
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {searchIcon}
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  borderWidth: 2
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.light
                }
              }
            }}
          />
        </Grid>
        
        {/* Campo de filtro */}
        {filterOptions.length > 0 && (
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              label={filterLabel}
              value={filterValue}
              onChange={onFilterChange}
              fullWidth
              variant="outlined"
              SelectProps={{
                startAdornment: filterIcon && (
                  <InputAdornment position="start">
                    {filterIcon}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.light
                  }
                }
              }}
            >
              {filterOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        
        {/* Campo de ordenação */}
        {sortOptions.length > 0 && (
          <Grid item xs={6} sm={3} md={2}>
            <TextField
              select
              label="Ordenar por"
              value={sortValue}
              onChange={onSortChange}
              fullWidth
              variant="outlined"
              SelectProps={{
                startAdornment: sortIcon && (
                  <InputAdornment position="start">
                    {sortIcon}
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.light
                  }
                }
              }}
            >
              {sortOptions.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )}
        
        {/* Botões de ação */}
        {actions.length > 0 && (
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
              {actions.map((action, index) => (
                <StyledButton
                  key={index}
                  variant={action.variant || "outlined"}
                  color={action.color || "primary"}
                  startIcon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  sx={{ 
                    borderRadius: 10,
                    px: 2,
                    ...action.sx
                  }}
                >
                  {action.label}
                </StyledButton>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchFilterBar;
