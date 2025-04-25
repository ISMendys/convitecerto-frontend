import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de menu de ações para convidados
 * 
 * @param {Object} props - Propriedades do componente
 * @param {HTMLElement} props.anchorEl - Elemento âncora para o menu
 * @param {boolean} props.open - Se o menu está aberto
 * @param {Function} props.onClose - Função para fechar o menu
 * @param {Array} props.actions - Array de objetos de configuração de ações
 * @param {Object} [props.sx] - Estilos adicionais
 */
const ActionMenu = ({
  anchorEl,
  open,
  onClose,
  actions = [],
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(open && anchorEl)}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          mt: 1.5,
          borderRadius: 2,
          minWidth: 180,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            mx: 0.5,
            my: 0.25,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
            },
          },
          ...sx
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {actions.map((action, index) => (
        <MenuItem 
          key={index} 
          onClick={() => {
            action.onClick();
            onClose();
          }}
          disabled={action.disabled}
          sx={{
            color: action.color ? theme.palette[action.color]?.main : 'inherit',
          }}
        >
          {action.icon && (
            <ListItemIcon sx={{ 
              color: action.color ? theme.palette[action.color]?.main : 'inherit',
              minWidth: 36
            }}>
              {action.icon}
            </ListItemIcon>
          )}
          <ListItemText primary={action.label} />
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ActionMenu;
