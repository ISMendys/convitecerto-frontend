import React, { useState } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import { formatarTelefone } from '../utils/formatters'; // Importe a função

/**
 * Componente que exibe um número de telefone formatado, com ícone
 * e funcionalidade de "clicar para copiar".
 */
export const FormattedPhone = ({ phone, isWhatsApp = false }) => {
  const [tooltipTitle, setTooltipTitle] = useState('Copiar número');

  // O número que será copiado (sem formatação)
  const rawPhoneNumber = phone.replace(/\D/g, '');

  const handleCopy = () => {
    // Usa a API do navegador para copiar o texto
    navigator.clipboard.writeText(rawPhoneNumber).then(() => {
      // Sucesso na cópia
      setTooltipTitle('Copiado!');
      // Volta ao texto original após 2 segundos
      setTimeout(() => {
        setTooltipTitle('Copiar número');
      }, 2000);
    }).catch(err => {
      console.error('Falha ao copiar o número: ', err);
      setTooltipTitle('Erro ao copiar');
       setTimeout(() => {
        setTooltipTitle('Copiar número');
      }, 2000);
    });
  };

  return (
    <Tooltip title={tooltipTitle} arrow>
      <Box 
        onClick={handleCopy} 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer', // Muda o cursor para indicar que é clicável
          '&:hover': {
            opacity: 0.8
          }
        }}
      >
        {isWhatsApp ? (
          <WhatsAppIcon fontSize="small" color="success" sx={{ mr: 1, flexShrink: 0 }} />
        ) : (
          <PhoneIcon fontSize="small" color="action" sx={{ mr: 1, flexShrink: 0 }} />
        )}
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {formatarTelefone(phone)}
        </Typography>
      </Box>
    </Tooltip>
  );
};

export default FormattedPhone;
