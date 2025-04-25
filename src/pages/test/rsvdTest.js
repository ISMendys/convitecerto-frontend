import React, { useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, Button, TextField, Checkbox, Divider, Stepper, Step, StepLabel } from '@mui/material';
import { WhatsApp as WhatsAppIcon, Check as CheckIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';

/**
 * Componente de demonstração para implementação de RSVP
 */
const RSVPIntegrationDemo = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);
  
  // Exemplo de ID de convidado
  const guestId = 'abc123def456';
  const baseUrl = 'https://seu-site.com';
  const rsvpUrl = `${baseUrl}/rsvp/${guestId}`;
  
  // Passos de implementação
  const steps = [
    'Configuração do Backend',
    'Integração do Frontend',
    'Teste da Página',
    'Compartilhamento'
  ];
  
  // Avançar para o próximo passo
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Simular cópia do link
  const handleCopyLink = () => {
    // Em uma implementação real, isso copiaria o link para a área de transferência
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Renderizar conteúdo com base no passo atual
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              1. Configuração do Backend
            </Typography>
            
            <Typography variant="body1" paragraph>
              Para implementar o RSVP, você precisa ter dois endpoints no seu backend:
            </Typography>
            
            <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" gutterBottom>
                Endpoint para buscar dados do convite:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ overflowX: 'auto', p: 1 }}>
                GET /api/invites/public/:guestId
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" gutterBottom>
                Endpoint para enviar resposta RSVP:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ overflowX: 'auto', p: 1 }}>
                POST /api/guests/rsvp/:id
                {'\n'}
                {/* Body: { status: "confirmed"|"declined", plusOne: boolean, plusOneName: string } */}
              </Typography>
            </Paper>
            
            <Typography variant="body1" paragraph>
              Certifique-se de que estes endpoints estão implementados no seu backend antes de prosseguir.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" onClick={handleNext}>
                Próximo
              </Button>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              2. Integração do Frontend
            </Typography>
            
            <Typography variant="body1" paragraph>
              Adicione a rota RSVP ao seu arquivo de rotas principal:
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
              <Typography variant="body2" component="pre" sx={{ overflowX: 'auto', p: 1 }}>
                {`<Route path="/rsvp/:guestId" element={<RsvpPage />} />`}
              </Typography>
            </Paper>
            
            <Typography variant="body1" paragraph>
              Certifique-se de que as ações Redux estão implementadas:
            </Typography>
            
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" gutterBottom>
                Em guestActions.js:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ overflowX: 'auto', p: 1 }}>
                {`export const submitRsvp = createAsyncThunk(
  'guests/submitRsvp',
  async ({ id, rsvpData }, { rejectWithValue }) => {
    try {
      const response = await api.post(\`/guests/rsvp/\${id}\`, rsvpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao enviar resposta');
    }
  }
);`}
              </Typography>
            </Paper>
            
            <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" gutterBottom>
                Em inviteActions.js:
              </Typography>
              <Typography variant="body2" component="pre" sx={{ overflowX: 'auto', p: 1 }}>
                {`export const fetchPublicInvite = createAsyncThunk(
  'invites/fetchPublicInvite',
  async (guestId, { rejectWithValue }) => {
    try {
      const response = await api.get(\`/invites/public/\${guestId}\`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erro ao buscar convite');
    }
  }
);`}
              </Typography>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Voltar
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Próximo
              </Button>
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              3. Teste da Página
            </Typography>
            
            <Typography variant="body1" paragraph>
              Para testar a página de RSVP, siga estes passos:
            </Typography>
            
            <Box component="ol" sx={{ pl: 2, mb: 3 }}>
              <li>
                <Typography variant="body1" paragraph>
                  Crie um evento de teste em seu sistema
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Adicione um convidado ao evento
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Obtenha o ID do convidado do banco de dados
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Acesse a URL: <code>{rsvpUrl}</code>
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Verifique se os dados do evento são exibidos corretamente
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Teste confirmar presença e recusar o convite
                </Typography>
              </li>
              <li>
                <Typography variant="body1" paragraph>
                  Verifique se o status do convidado foi atualizado no banco de dados
                </Typography>
              </li>
            </Box>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.50', borderLeft: '4px solid', borderColor: 'primary.main' }}>
              <Typography variant="subtitle1" gutterBottom>
                Dica de Teste
              </Typography>
              <Typography variant="body2">
                Você pode usar o componente <code>RSVPExample.jsx</code> para visualizar como a página deve ficar, sem precisar configurar todo o backend.
              </Typography>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Voltar
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Próximo
              </Button>
            </Box>
          </Box>
        );
      
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              4. Compartilhamento
            </Typography>
            
            <Typography variant="body1" paragraph>
              Depois de implementar e testar a página de RSVP, você pode compartilhar os links com seus convidados:
            </Typography>
            
            <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.100' }}>
              <Typography variant="subtitle1" gutterBottom>
                Link de RSVP para compartilhar:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={rsvpUrl}
                  InputProps={{
                    readOnly: true,
                  }}
                  size="small"
                />
                <Button
                  variant="contained"
                  color={copied ? "success" : "primary"}
                  startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                  onClick={handleCopyLink}
                  sx={{ ml: 1, minWidth: '120px' }}
                >
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                Opções de compartilhamento:
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="success"
                    fullWidth
                    startIcon={<WhatsAppIcon />}
                    href={`https://wa.me/?text=Confirme sua presença no evento: ${rsvpUrl}`}
                    target="_blank"
                  >
                    Compartilhar via WhatsApp
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    href={`mailto:?subject=Convite para evento&body=Confirme sua presença no evento: ${rsvpUrl}`}
                  >
                    Compartilhar via Email
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            
            <Typography variant="body1" paragraph>
              Você também pode gerar QR Codes para os links de RSVP e incluí-los em convites impressos.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button onClick={handleBack}>
                Voltar
              </Button>
              <Button variant="contained" color="success">
                Concluir
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Implementação da Página de RSVP
        </Typography>
        
        <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
          Siga este guia passo a passo para implementar a funcionalidade de RSVP no seu sistema.
        </Typography>
        
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 2 }}>
          {renderStepContent(activeStep)}
        </Box>
      </Paper>
    </Container>
  );
};

export default RSVPIntegrationDemo;
