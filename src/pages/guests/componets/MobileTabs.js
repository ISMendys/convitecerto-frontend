import React from 'react';
import {
  Box,
  Tabs,
  Tab,
  useTheme,
  alpha
} from '@mui/material';
import {
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  HelpOutline as HelpOutlineIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const MobileTabs = ({ 
  value, 
  onChange, 
  guests 
}) => {
  const theme = useTheme();

  const confirmedCount = guests.filter(g => g.status === 'confirmed').length;
  const pendingCount = guests.filter(g => g.status === 'pending').length;
  const declinedCount = guests.filter(g => g.status === 'declined').length;

  const tabsData = [
    {
      label: 'Todos',
      shortLabel: 'Todos',
      count: guests.length,
      icon: <PersonIcon fontSize="small" />,
      color: theme.palette.primary.main
    },
    {
      label: 'Confirmados',
      shortLabel: 'Confirm.',
      count: confirmedCount,
      icon: <CheckCircleIcon fontSize="small" />,
      color: theme.palette.success.main
    },
    {
      label: 'Pendentes',
      shortLabel: 'Pend.',
      count: pendingCount,
      icon: <HelpOutlineIcon fontSize="small" />,
      color: theme.palette.warning.main
    },
    {
      label: 'Recusados',
      shortLabel: 'Recus.',
      count: declinedCount,
      icon: <CancelIcon fontSize="small" />,
      color: theme.palette.error.main
    }
  ];

  return (
    <Box sx={{
      borderBottom: 1,
      borderColor: 'divider',
      bgcolor: 'background.paper',
      borderRadius: '12px 12px 0 0',
      overflow: 'hidden'
    }}>
      <Tabs
        value={value}
        onChange={onChange}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          minHeight: 48,
          '& .MuiTabs-flexContainer': {
            gap: 0.5
          },
          '& .MuiTab-root': {
            minWidth: 'auto',
            minHeight: 48,
            px: 1.5,
            py: 1,
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            mx: 0.25,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.08)
            },
            '&.Mui-selected': {
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, 0.12)
            }
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            backgroundColor: theme.palette.primary.main
          },
          '& .MuiTabs-scrollButtons': {
            width: 32,
            '&.Mui-disabled': {
              opacity: 0.3
            }
          }
        }}
      >
        {tabsData.map((tab, index) => (
          <Tab
            key={index}
            icon={tab.icon}
            iconPosition="start"
            label={
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 0.5
              }}>
                <span>{tab.shortLabel}</span>
                <Box
                  component="span"
                  sx={{
                    bgcolor: value === index ? tab.color : alpha(tab.color, 0.2),
                    color: value === index ? 'white' : tab.color,
                    borderRadius: '10px',
                    px: 0.75,
                    py: 0.25,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    minWidth: 20,
                    textAlign: 'center',
                    lineHeight: 1.2
                  }}
                >
                  {tab.count}
                </Box>
              </Box>
            }
            sx={{
              '& .MuiTab-iconWrapper': {
                color: value === index ? tab.color : alpha(tab.color, 0.7),
                marginBottom: 0,
                marginRight: 0.5
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default MobileTabs;

