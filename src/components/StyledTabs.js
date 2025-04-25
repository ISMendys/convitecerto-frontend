import React from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';

/**
 * Componente de abas estilizadas com espaço aumentado
 * 
 * @param {Object} props - Propriedades do componente
 * @param {number} props.value - Valor da aba selecionada
 * @param {Function} props.onChange - Função de mudança de aba
 * @param {Array} props.tabs - Array de objetos de configuração das abas (label, icon, iconPosition)
 * @param {string} [props.variant='standard'] - Variante das abas (standard, fullWidth, scrollable)
 * @param {Object} [props.sx] - Estilos adicionais
 */
export const StyledTabs = ({ 
  value, 
  onChange, 
  tabs = [], 
  variant = 'standard',
  endComponent = null,
  sx = {}
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        display: endComponent ? 'flex' : 'block',
        alignItems: 'center',
        '&&': { gap: 2 },
        backgroundColor: theme.palette.background.paper,
        ...sx.wrapper
      }}
    >
      <Tabs 
        value={value} 
        onChange={onChange} 
        aria-label="styled tabs"
        variant={variant}
        sx={{
          backgroundColor: theme.palette.background.paper,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: theme.palette.primary.main
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.95rem',
            transition: 'all 0.2s ease',
            py: 2.5, // Aumentado para dar mais espaço vertical
            px: 3, // Aumentado para dar mais espaço horizontal
            minHeight: 64, // Altura mínima aumentada
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.05)
            },
            '&.Mui-selected': {
              color: theme.palette.primary.main
            }
          },
          ...sx
        }}
      >
        {tabs.map((tab, index) => (
          <Tab 
            key={index}
            label={tab.label} 
            icon={tab.icon} 
            iconPosition={tab.iconPosition || 'start'}
          />
        ))}
      </Tabs>
      {endComponent && (
        <Box sx={{ ml: 'auto', ...sx.endComponent }}>
          {endComponent}
        </Box>
      )}
    </Box>
  );
};

/**
 * Componente de painel de abas
 * 
 * @param {Object} props - Propriedades do componente
 * @param {React.ReactNode} props.children - Conteúdo do painel
 * @param {number} props.value - Valor da aba atual
 * @param {number} props.index - Índice do painel
 */
export const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`styled-tabpanel-${index}`}
      aria-labelledby={`styled-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3, px: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
};
