import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  InputLabel,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  alpha
} from '@mui/material';
import {
  InfoOutlined,
  Email,
  Notifications,
  PhoneAndroid,
  Schedule,
  CheckCircle,
  Cancel,
  Send,
  Update,
  Warning
} from '@mui/icons-material';
import notificationService from '../../services/notificationService';

const NotificationSettings = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Configurações de tipos de notificação
  const notificationTypes = [
    {
      key: 'guestConfirmed',
      title: 'Confirmação de Presença',
      description: 'Quando um convidado confirma presença no evento',
      icon: <CheckCircle sx={{ color: theme.palette.success.main }} />,
      color: 'success'
    },
    {
      key: 'guestDeclined',
      title: 'Recusa de Convite',
      description: 'Quando um convidado recusa o convite',
      icon: <Cancel sx={{ color: theme.palette.error.main }} />,
      color: 'error'
    },
    {
      key: 'inviteSent',
      title: 'Convite Enviado',
      description: 'Quando um convite é enviado para convidados',
      icon: <Send sx={{ color: theme.palette.info.main }} />,
      color: 'info'
    },
    {
      key: 'eventReminder',
      title: 'Lembrete de Evento',
      description: 'Lembretes sobre eventos próximos',
      icon: <Schedule sx={{ color: theme.palette.warning.main }} />,
      color: 'warning'
    }
  ];

  // Canais de notificação
  const channels = [
    {
      key: 'email',
      title: 'Email',
      description: 'Notificações por email',
      icon: <Email />
    },
    {
      key: 'websocket',
      title: 'Tempo Real',
      description: 'Notificações instantâneas no aplicativo',
      icon: <Notifications />
    },
    {
      key: 'push',
      title: 'Push',
      description: 'Notificações push no dispositivo',
      icon: <PhoneAndroid />
    }
  ];

  // Carregar configurações
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await notificationService.getSettings();
      setSettings(data);
    } catch (err) {
      setError('Erro ao carregar configurações de notificação');
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setLoading(false);
    }
  };

  // Salvar configurações
  const saveSettings = async (newSettings) => {
    try {
      setSaving(true);
      setError(null);
      
      await notificationService.updateSettings(newSettings);
      setSettings(newSettings);
      setSuccess(true);
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(false), 3000);
      
    } catch (err) {
      setError('Erro ao salvar configurações');
      console.error('Erro ao salvar configurações:', err);
    } finally {
      setSaving(false);
    }
  };

  // Atualizar configuração de canal para um tipo específico
  const handleChannelChange = (notificationType, channel, enabled) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      [notificationType]: {
        ...settings[notificationType],
        [channel]: enabled
      }
    };

    setSettings(newSettings);
    saveSettings(newSettings);
  };

  // Atualizar configurações globais
  const handleGlobalSettingChange = (field, value) => {
    if (!settings) return;

    const newSettings = {
      ...settings,
      [field]: value
    };

    setSettings(newSettings);
    saveSettings(newSettings);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !settings) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Configurações por tipo de notificação */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Tipos de Notificação
          </Typography>
          <Tooltip title="Configure como deseja receber cada tipo de notificação">
            <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={2}>
          {notificationTypes.map((type) => (
            <Grid item xs={12} key={type.key}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.1)}`
                  }
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ mr: 2, mt: 0.5 }}>
                      {type.icon}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {type.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {type.description}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {channels.map((channel) => (
                      <FormControlLabel
                        key={channel.key}
                        control={
                          <Switch
                            checked={settings?.[type.key]?.[channel.key] || false}
                            onChange={(e) => handleChannelChange(type.key, channel.key, e.target.checked)}
                            size="small"
                            disabled={saving}
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {channel.icon}
                            <Typography variant="body2">
                              {channel.title}
                            </Typography>
                          </Box>
                        }
                        sx={{ 
                          m: 0,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Configurações globais */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Configurações Gerais
          </Typography>
          <Tooltip title="Configurações que afetam todas as notificações">
            <IconButton size="small" sx={{ ml: 1, opacity: 0.7 }}>
              <InfoOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequência de Resumo</InputLabel>
              <Select
                value={settings?.digestFrequency || 'NONE'}
                label="Frequência de Resumo"
                onChange={(e) => handleGlobalSettingChange('digestFrequency', e.target.value)}
                disabled={saving}
              >
                <MenuItem value="NONE">Desabilitado</MenuItem>
                <MenuItem value="DAILY">Diário</MenuItem>
                <MenuItem value="WEEKLY">Semanal</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Fuso Horário</InputLabel>
              <Select
                value={settings?.timezone || 'America/Sao_Paulo'}
                label="Fuso Horário"
                onChange={(e) => handleGlobalSettingChange('timezone', e.target.value)}
                disabled={saving}
              >
                <MenuItem value="America/Sao_Paulo">São Paulo (GMT-3)</MenuItem>
                <MenuItem value="America/New_York">Nova York (GMT-5)</MenuItem>
                <MenuItem value="Europe/London">Londres (GMT+0)</MenuItem>
                <MenuItem value="Europe/Paris">Paris (GMT+1)</MenuItem>
                <MenuItem value="Asia/Tokyo">Tóquio (GMT+9)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Horário Silencioso - Início</InputLabel>
              <Select
                value={settings?.quietHoursStart || ''}
                label="Horário Silencioso - Início"
                onChange={(e) => handleGlobalSettingChange('quietHoursStart', e.target.value || null)}
                disabled={saving}
              >
                <MenuItem value="">Desabilitado</MenuItem>
                {Array.from({ length: 24 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Horário Silencioso - Fim</InputLabel>
              <Select
                value={settings?.quietHoursEnd || ''}
                label="Horário Silencioso - Fim"
                onChange={(e) => handleGlobalSettingChange('quietHoursEnd', e.target.value || null)}
                disabled={saving}
              >
                <MenuItem value="">Desabilitado</MenuItem>
                {Array.from({ length: 24 }, (_, i) => (
                  <MenuItem key={i} value={i}>
                    {i.toString().padStart(2, '0')}:00
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {settings?.quietHoursStart !== null && settings?.quietHoursEnd !== null && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              Durante o horário silencioso ({settings.quietHoursStart}:00 - {settings.quietHoursEnd}:00), 
              você não receberá notificações por email ou push, apenas notificações em tempo real no aplicativo.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Mensagens de status */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Configurações salvas com sucesso!
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {saving && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" color="text.secondary">
            Salvando configurações...
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default NotificationSettings;

