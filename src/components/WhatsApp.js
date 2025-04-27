import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';

/**
 * Componente para exibir opções de WhatsApp no menu de ações do convidado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.guest - Dados do convidado
 * @param {Function} props.onSendInvite - Função para enviar convite
 * @param {Function} props.onSendReminder - Função para enviar lembrete
 */
export const WhatsAppMenuItems = ({ 
  guest, 
  onSendInvite, 
  onSendReminder
}) => {
  const theme = useTheme();
  
  // Verificar se o convidado tem telefone
  const hasPhone = !!guest?.phone;
  // Verificar se o convidado tem convite vinculado
  const hasInvite = !!guest?.inviteId;
  
  return (
    <>
      <Divider />
      <MenuItem
        onClick={onSendInvite}
        disabled={!hasPhone || !hasInvite}
        sx={{
          color: theme.palette.success.main,
          '&.Mui-disabled': {
            opacity: 0.5,
          }
        }}
      >
        <ListItemIcon>
          <WhatsAppIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText primary="Enviar Convite WhatsApp" />
      </MenuItem>
      
      <MenuItem
        onClick={onSendReminder}
        disabled={!hasPhone}
        sx={{
          color: theme.palette.success.main,
          '&.Mui-disabled': {
            opacity: 0.5,
          }
        }}
      >
        <ListItemIcon>
          <NotificationsIcon fontSize="small" color="success" />
        </ListItemIcon>
        <ListItemText primary="Enviar Lembrete WhatsApp" />
      </MenuItem>
    </>
  );
};

/**
 * Componente para exibir botão de ação em massa para WhatsApp
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onClick - Função para enviar mensagem em massa
 * @param {boolean} props.disabled - Se o botão deve estar desabilitado
 */
export const WhatsAppBulkAction = ({ onClick, disabled = false }) => {
  const theme = useTheme();
  
  return (
    <Button
      variant="contained"
      color="success"
      startIcon={<WhatsAppIcon />}
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: 2,
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(76, 175, 80, 0.2)',
        background: `linear-gradient(45deg, ${theme.palette.success.main} 30%, ${theme.palette.success.light} 90%)`,
        '&.Mui-disabled': {
          opacity: 0.5,
        }
      }}
    >
      Enviar WhatsApp em Massa
    </Button>
  );
};

/**
 * Configuração para ação de WhatsApp no SpeedDial
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Function} props.onClick - Função ao clicar
 * @param {boolean} props.disabled - Se a ação deve estar desabilitada
 */
export const WhatsAppSpeedDialAction = ({ 
  onClick, 
  disabled = false 
}) => {
  return {
    icon: <WhatsAppIcon />,
    tooltipTitle: "Enviar WhatsApp em Massa",
    onClick,
    disabled
  };
};

export default {
  WhatsAppMenuItems,
  WhatsAppBulkAction,
  WhatsAppSpeedDialAction
};
