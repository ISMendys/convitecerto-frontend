import React from 'react';
import { Box, Card, Avatar, Typography, useTheme, alpha } from '@mui/material';

const MobileStatsGrid = ({ stats }) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      {/* Primeira linha */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        mb: 2,
        '& > *': { flex: 1 }
      }}>
        {stats.slice(0, 2).map((stat, index) => {
          const Icon = stat.icon;
          const SecondaryIcon = stat.secondaryIcon;
          
          return (
            <Card
              key={index}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.3s, transform 0.2s',
                textAlign: 'center',
                bgcolor: stat.bgAlpha > 0
                  ? alpha(theme.palette.primary.main, stat.bgAlpha)
                  : 'background.default',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 1.5,
                    width: 32,
                    height: 32
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  fontWeight={600}
                  sx={{ fontSize: '0.8rem' }}
                >
                  {stat.label}
                </Typography>
              </Box>
              
              <Typography
                variant="h5"
                color={`${stat.color}.main`}
                fontWeight={700}
                sx={{ mb: 0.5, fontSize: '1.5rem' }}
              >
                {stat.value}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                <SecondaryIcon 
                  sx={{ 
                    fontSize: 14, 
                    mr: 0.5, 
                    color: theme.palette.primary.main 
                  }} 
                />
                <Typography 
                  variant="body2"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {stat.secondaryText}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>

      {/* Segunda linha */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        '& > *': { flex: 1 }
      }}>
        {stats.slice(2, 4).map((stat, index) => {
          const Icon = stat.icon;
          const SecondaryIcon = stat.secondaryIcon;
          
          return (
            <Card
              key={index + 2}
              sx={{
                p: 2,
                height: '100%',
                borderRadius: 3,
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'box-shadow 0.3s, transform 0.2s',
                textAlign: 'center',
                bgcolor: stat.bgAlpha > 0
                  ? alpha(theme.palette.primary.main, stat.bgAlpha)
                  : 'background.default',
                '&:hover': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mr: 1.5,
                    width: 32,
                    height: 32
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </Avatar>
                <Typography 
                  variant="subtitle2" 
                  color="text.secondary" 
                  fontWeight={600}
                  sx={{ fontSize: '0.8rem' }}
                >
                  {stat.label}
                </Typography>
              </Box>
              
              <Typography
                variant="h5"
                color={`${stat.color}.main`}
                fontWeight={700}
                sx={{ mb: 0.5, fontSize: '1.5rem' }}
              >
                {stat.value}
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'text.secondary'
                }}
              >
                <SecondaryIcon 
                  sx={{ 
                    fontSize: 14, 
                    mr: 0.5, 
                    color: theme.palette.primary.main 
                  }} 
                />
                <Typography 
                  variant="body2"
                  sx={{ fontSize: '0.75rem' }}
                >
                  {stat.secondaryText}
                </Typography>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default MobileStatsGrid;

