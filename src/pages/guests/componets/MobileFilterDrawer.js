import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Divider,
  Fab,
  useTheme,
  alpha
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  SelectAll as SelectAllIcon,
  Add as AddIcon,
  FileUpload as FileUploadIcon,
  ForwardToInbox as ForwardToInboxIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const MobileFilterDrawer = ({
  open,
  onClose,
  searchTerm,
  onSearchChange,
  sortBy,
  setSortBy,
  sortDirection,
  onToggleSortDirection,
  filterGroup,
  setFilterGroup,
  groups,
  sortOptions,
  selectedGuests,
  filteredGuests,
  onSelectAllGuests,
  onAddGuest,
  onImport,
  onBulkMessage,
  onBulkActions,
  eventId,
  currentEventId,
  currentEvent
}) => {
  const theme = useTheme();

  return (
    <>
      {/* Botão flutuante para abrir filtros */}
      {!open && (
        <Fab
          color="primary"
          aria-label="filtros"
          onClick={() => onClose(false)}
          sx={{
            position: 'fixed',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(94, 53, 177, 0.3)',
          }}
        >
          <FilterListIcon />
        </Fab>
      )}

      {/* Drawer de filtros */}
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
            minHeight: '60vh',
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Header do drawer */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h6" fontWeight="bold">
              Filtros e Ações
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Campo de busca */}
          <Box sx={{ mb: 3 }}>
            <TextField
              placeholder="Buscar convidados..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{
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
          </Box>

          {/* Filtros de ordenação e grupo */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* Ordenação */}
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
              <IconButton 
                color="primary"
                onClick={onToggleSortDirection}
                sx={{ 
                  mr: 1,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                  }
                }}
              >
                {sortDirection === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </IconButton>
              
              <FormControl fullWidth size="small">
                <InputLabel id="sort-label-mobile">Ordenar por</InputLabel>
                <Select
                  labelId="sort-label-mobile"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Ordenar por"
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {sortOptions.map(option => (
                    <MenuItem key={option?.id} value={option?.id}>
                      {option.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Filtro por grupo */}
            <Box sx={{ flex: 1 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="group-filter-label-mobile">Grupo</InputLabel>
                <Select
                  labelId="group-filter-label-mobile"
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  label="Grupo"
                  sx={{
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                    }
                  }}
                >
                  {groups.map(group => (
                    <MenuItem key={group?.id} value={group?.id}>
                      {group.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Botões de ação */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
              Ações Rápidas
            </Typography>
            
            {/* Primeira linha de botões */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<SelectAllIcon />}
                onClick={onSelectAllGuests}
                disabled={filteredGuests.length === 0}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {selectedGuests.length === filteredGuests.length && filteredGuests.length > 0 
                  ? "Desmarcar" 
                  : "Selecionar"}
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={onAddGuest}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Adicionar
              </Button>
            </Box>

            {/* Segunda linha de botões */}
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button
                fullWidth
                variant="contained"
                color="warning"
                startIcon={<FileUploadIcon />}
                onClick={onImport}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Importar
              </Button>
              
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                startIcon={<ForwardToInboxIcon />}
                onClick={onBulkMessage}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Convidar
              </Button>
            </Box>

            {/* Botão de ações em massa (se houver selecionados) */}
            {selectedGuests.length > 0 && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={onBulkActions}
                startIcon={selectedGuests.length > 1 ? <GroupIcon /> : <PersonIcon />}
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  '&:hover': {
                    boxShadow: '0 6px 16px rgba(94, 53, 177, 0.3)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Ações ({selectedGuests.length})
              </Button>
            )}
          </Box>

          {/* Informações de contagem */}
          <Box sx={{ 
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            borderRadius: 2,
            p: 2,
            textAlign: 'center'
          }}>
            <Typography variant="body2" color="primary" fontWeight="bold">
              {filteredGuests.length} convidado(s) encontrado(s)
            </Typography>
            {selectedGuests.length > 0 && (
              <Typography variant="body2" color="primary">
                {selectedGuests.length} selecionado(s)
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default MobileFilterDrawer;

