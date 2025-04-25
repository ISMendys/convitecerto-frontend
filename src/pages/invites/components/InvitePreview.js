import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
  useTheme
} from '@mui/material';
import {
  Image as ImageIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';

const InvitePreview = ({ 
  title, 
  eventTitle, 
  description, 
  customText, 
  imageUrl, 
  bgColor, 
  textColor, 
  fontFamily,
  showActions = false,
  onWhatsAppTest
}) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
        Pré-visualização
      </Typography>
      
      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 2,
          bgcolor: '#f5f5f5',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Card 
          sx={{ 
            maxWidth: 400,
            width: '100%',
            mx: 'auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            fontFamily: fontFamily,
            transition: 'all 0.3s ease',
            transform: 'perspective(1000px) rotateY(0deg)',
            '&:hover': {
              transform: 'perspective(1000px) rotateY(5deg)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          {imageUrl ? (
            <CardMedia
              component="img"
              height="200"
              image={imageUrl}
              alt={title}
            />
          ) : (
            <Box 
              sx={{ 
                height: 200, 
                bgcolor: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff'
              }}
            >
              <ImageIcon sx={{ fontSize: 60, opacity: 0.7 }} />
            </Box>
          )}
          
          <CardContent>
            <Typography 
              variant="h5" 
              component="div" 
              gutterBottom
              sx={{ 
                color: bgColor,
                fontFamily: 'inherit',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              {title || 'Título do Convite'}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                fontFamily: 'inherit',
                textAlign: 'center',
                color: textColor
              }}
            >
              {eventTitle || 'Nome do Evento'}
            </Typography>
            
            {description && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 2,
                  fontFamily: 'inherit',
                  color: textColor
                }}
              >
                {description}
              </Typography>
            )}
            
            <Divider sx={{ mb: 2 }} />
            
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 2,
                fontFamily: 'inherit',
                color: textColor
              }}
            >
              {customText || 'Mensagem personalizada do convite...'}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontFamily: 'inherit',
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              Confirme sua presença respondendo este convite.
            </Typography>
          </CardContent>
        </Card>
      </Box>
      
      {showActions && (
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="outlined"
            color="success"
            startIcon={<WhatsAppIcon />}
            onClick={onWhatsAppTest}
            sx={{ 
              borderRadius: 8,
              px: 3,
              color: '#25D366',
              borderColor: '#25D366',
              '&:hover': {
                borderColor: '#25D366',
                backgroundColor: 'rgba(37, 211, 102, 0.1)'
              }
            }}
          >
            Testar no WhatsApp
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default InvitePreview;
