import React from 'react';
import {
  Box,
  Tab,
  Tabs,
  useTheme,
  alpha,
  Badge
} from '@mui/material';
import {
  Event as EventIcon,
  People as PeopleIcon,
  Mail as MailIcon
} from '@mui/icons-material';

const MobileTabs = ({ 
  value, 
  onChange, 
  guestsCount = 0, 
  invitesCount = 0 
}) => {
  const theme = useTheme();

  // Labels reduzidos para mobile
  const tabs = [
    {
      label: 'Info',
      icon: <EventIcon />,
      fullLabel: 'Detalhes'
    },
    {
      label: 'Pessoas',
      icon: <PeopleIcon />,
      fullLabel: 'Convidados',
      count: guestsCount
    },
    {
      label: 'Convites',
      icon: <MailIcon />,
      fullLabel: 'Convites',
      count: invitesCount
    }
  ];

  return (
    <Box
      sx={{
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        bgcolor: alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        variant="fullWidth"
        sx={{
          minHeight: 56,
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
          },
          '& .MuiTab-root': {
            minHeight: 56,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.8rem',
            color: theme.palette.text.secondary,
            transition: 'all 0.2s ease',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: 700
            },
            '&:hover': {
              color: theme.palette.primary.main,
              bgcolor: alpha(theme.palette.primary.main, 0.04)
            }
          }
        }}
      >
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            icon={
              tab.count !== undefined ? (
                <Badge 
                  badgeContent={tab.count} 
                  color="primary"
                  sx={{
                    '& .MuiBadge-badge': {
                      fontSize: '0.6rem',
                      minWidth: 16,
                      height: 16,
                      borderRadius: '8px'
                    }
                  }}
                >
                  {tab.icon}
                </Badge>
              ) : (
                tab.icon
              )
            }
            label={tab.label}
            iconPosition="top"
            sx={{
              gap: 0.5,
              px: 1,
              '& .MuiTab-iconWrapper': {
                mb: 0.5
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default MobileTabs;
