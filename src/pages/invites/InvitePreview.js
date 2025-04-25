import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Button,
  useTheme,
  alpha
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
      {/* Título removido para economizar espaço */}
      
      <Box 
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 1.5, // Reduzido de p: 2 para p: 1.5
          bgcolor: alpha('#f5f5f5', 0.7),
          borderRadius: 2,
          overflow: 'hidden',
          perspective: '1500px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.05)'
        }}
      >
        <Card 
          sx={{ 
            maxWidth: 350, // Reduzido de 400 para 350
            width: '100%',
            mx: 'auto',
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)',
            fontFamily: fontFamily || 'Roboto',
            transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformStyle: 'preserve-3d',
            transform: 'perspective(1500px) rotateY(0deg)',
            '&:hover': {
              transform: 'perspective(1500px) rotateY(180deg)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(0, 0, 0, 0.15)',
            },
            position: 'relative',
            height: '400px', // Reduzido de 450px para 400px
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {/* Frente do card */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transformStyle: 'preserve-3d',
              display: 'flex',
              flexDirection: 'column',
              transform: 'translateZ(1px)',
            }}
          >
            {imageUrl ? (
              <CardMedia
                component="img"
                height="180" // Reduzido de 200 para 180
                image={imageUrl}
                alt={title}
                sx={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
            ) : (
              <Box 
                sx={{ 
                  height: 180, // Reduzido de 200 para 180
                  background: `linear-gradient(135deg, ${bgColor} 30%, ${alpha(bgColor, 0.8)} 90%)`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: '#fff',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <ImageIcon sx={{ 
                  fontSize: 60, // Reduzido de 70 para 60
                  opacity: 0.8,
                  filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
                }} />
              </Box>
            )}
            
            <CardContent sx={{ 
              flexGrow: 1, 
              p: 2, // Reduzido de p: 3 para p: 2
              display: 'flex',
              flexDirection: 'column'
            }}>
              <Typography 
                variant="h5" 
                component="div" 
                gutterBottom
                sx={{ 
                  color: bgColor,
                  fontFamily: 'inherit',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  mb: 1.5, // Reduzido de mb: 2 para mb: 1.5
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {title || 'Título do Convite'}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 1.5, // Reduzido de mb: 2 para mb: 1.5
                  fontFamily: 'inherit',
                  textAlign: 'center',
                  color: textColor,
                  fontWeight: 500
                }}
              >
                {eventTitle || 'Nome do Evento'}
              </Typography>
              
              {description && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mb: 1.5, // Reduzido de mb: 2 para mb: 1.5
                    fontFamily: 'inherit',
                    color: textColor,
                    lineHeight: 1.6
                  }}
                >
                  {description}
                </Typography>
              )}
              
              <Divider sx={{ 
                mb: 1.5, // Reduzido de mb: 2 para mb: 1.5
                borderColor: alpha(bgColor, 0.3),
                width: '80%',
                mx: 'auto'
              }} />
              
              <Typography 
                variant="body2" 
                sx={{ 
                  mb: 1.5, // Reduzido de mb: 2 para mb: 1.5
                  fontFamily: 'inherit',
                  color: textColor,
                  lineHeight: 1.6,
                  flexGrow: 1
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
                  fontStyle: 'italic',
                  opacity: 0.8,
                  mt: 'auto'
                }}
              >
                Confirme sua presença respondendo este convite.
              </Typography>
            </CardContent>
          </Box>
          
          {/* Verso do card */}
          <Box
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: `linear-gradient(135deg, ${bgColor} 30%, ${alpha(bgColor, 0.8)} 90%)`,
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 3,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none'
              }
            }}
          >
            <Typography 
              variant="h4" 
              component="div" 
              gutterBottom
              sx={{ 
                fontFamily: 'inherit',
                fontWeight: 'bold',
                mb: 2, // Reduzido de mb: 3 para mb: 2
                textShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }}
            >
              {title || 'Título do Convite'}
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3, // Reduzido de mb: 4 para mb: 3
                fontFamily: 'inherit',
                opacity: 0.9,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {eventTitle || 'Nome do Evento'}
            </Typography>
            
            <Box 
              sx={{ 
                p: 2, // Reduzido de p: 3 para p: 2
                bgcolor: 'rgba(255,255,255,0.15)', 
                borderRadius: 2,
                mb: 3, // Reduzido de mb: 4 para mb: 3
                backdropFilter: 'blur(5px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                width: '80%',
                maxWidth: '280px', // Reduzido de 300px para 280px
                transform: 'translateZ(30px)',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'translateZ(50px) scale(1.05)'
                }
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'inherit',
                  fontStyle: 'italic',
                  lineHeight: 1.6
                }}
              >
                "Esperamos você neste evento especial!"
              </Typography>
            </Box>
            
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: 'inherit',
                opacity: 0.8,
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                textAlign: 'center'
              }}
            >
              Passe o mouse para ver os detalhes do convite
            </Typography>
          </Box>
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
              borderRadius: 10,
              px: 3,
              py: 0.8, // Reduzido de py: 1.2 para py: 0.8
              color: '#25D366',
              borderColor: '#25D366',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.15)',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#25D366',
                backgroundColor: 'rgba(37, 211, 102, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(37, 211, 102, 0.2)'
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
