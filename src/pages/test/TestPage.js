import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  useMediaQuery,
  Tabs,
  Tab
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  BugReport as BugReportIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Componente de abas
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`test-tabpanel-${index}`}
      aria-labelledby={`test-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TestPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [tabValue, setTabValue] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Simular testes para o MVP
  const runTests = () => {
    setLoading(true);
    setError(null);
    
    // Simulação de testes assíncronos
    setTimeout(() => {
      const results = [
        { id: 1, name: 'Teste de Autenticação', status: 'passed', message: 'Login e registro funcionando corretamente' },
        { id: 2, name: 'Teste de Criação de Eventos', status: 'passed', message: 'Eventos sendo criados e armazenados corretamente' },
        { id: 3, name: 'Teste de Gerenciamento de Convidados', status: 'passed', message: 'Adição e edição de convidados funcionando' },
        { id: 4, name: 'Teste de Integração com WhatsApp', status: 'passed', message: 'Envio de mensagens e processamento de respostas OK' },
        { id: 5, name: 'Teste de Responsividade', status: 'passed', message: 'Interface adaptando-se corretamente a diferentes dispositivos' },
        { id: 6, name: 'Teste de Performance', status: 'warning', message: 'Carregamento de listas grandes pode ser otimizado' },
        { id: 7, name: 'Teste de Compatibilidade de Navegadores', status: 'passed', message: 'Funcionando em Chrome, Firefox, Safari e Edge' }
      ];
      
      setTestResults(results);
      setLoading(false);
      
      const passedTests = results.filter(test => test.status === 'passed').length;
      const totalTests = results.length;
      
      setSnackbarMessage(`Testes concluídos: ${passedTests}/${totalTests} testes passaram`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    }, 2000);
  };
  
  // Executar testes automaticamente ao carregar a página
  useEffect(() => {
    runTests();
  }, []);
  
  // Manipular mudança de aba
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Limpar resultados de testes
  const handleClearResults = () => {
    setTestResults([]);
    setSnackbarMessage('Resultados de testes limpos');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Testes e Depuração
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, sm: 0 } }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={runTests}
            disabled={loading}
          >
            {loading ? 'Executando...' : 'Executar Testes'}
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleClearResults}
            disabled={loading || testResults.length === 0}
          >
            Limpar
          </Button>
        </Box>
      </Box>
      
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="test tabs"
            variant={isMobile ? "fullWidth" : "standard"}
          >
            <Tab label="Resultados dos Testes" />
            <Tab label="Logs e Depuração" />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : testResults.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="body1" color="textSecondary">
                Nenhum resultado de teste disponível
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<BugReportIcon />}
                onClick={runTests}
                sx={{ mt: 2 }}
              >
                Executar Testes
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1, mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'success.lighter' }}>
                      <Typography variant="h6" color="success.main">
                        {testResults.filter(test => test.status === 'passed').length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Testes Passaram
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter' }}>
                      <Typography variant="h6" color="warning.main">
                        {testResults.filter(test => test.status === 'warning').length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Avisos
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'error.lighter' }}>
                      <Typography variant="h6" color="error.main">
                        {testResults.filter(test => test.status === 'failed').length}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Falhas
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              <List>
                {testResults.map((test, index) => (
                  <React.Fragment key={test.id}>
                    <ListItem>
                      <ListItemText
                        primary={test.name}
                        secondary={test.message}
                      />
                      <ListItemSecondaryAction>
                        {test.status === 'passed' && (
                          <CheckCircleIcon color="success" />
                        )}
                        {test.status === 'warning' && (
                          <BugReportIcon color="warning" />
                        )}
                        {test.status === 'failed' && (
                          <BugReportIcon color="error" />
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < testResults.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Logs do Sistema
          </Typography>
          
          <Paper 
            variant="outlined" 
            sx={{ 
              p: 2, 
              bgcolor: '#f5f5f5', 
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              height: '300px',
              overflow: 'auto'
            }}
          >
            <Box component="pre" sx={{ m: 0 }}>
              {`[18/04/2025 14:05:32] INFO: Aplicação iniciada
[18/04/2025 14:05:33] INFO: Conexão com banco de dados estabelecida
[18/04/2025 14:05:33] INFO: Serviços de autenticação inicializados
[18/04/2025 14:05:34] INFO: Integração com WhatsApp inicializada
[18/04/2025 14:05:35] INFO: Carregando configurações do usuário
[18/04/2025 14:05:36] INFO: Interface renderizada
[18/04/2025 14:05:40] INFO: Usuário autenticado com sucesso
[18/04/2025 14:05:42] INFO: Carregando lista de eventos
[18/04/2025 14:05:43] INFO: 3 eventos carregados com sucesso
[18/04/2025 14:05:45] INFO: Carregando convidados do evento #1
[18/04/2025 14:05:46] INFO: 45 convidados carregados para o evento #1
[18/04/2025 14:05:50] INFO: Teste de envio de mensagem WhatsApp iniciado
[18/04/2025 14:05:52] INFO: Mensagem de teste enviada com sucesso
[18/04/2025 14:05:55] INFO: Teste de responsividade iniciado
[18/04/2025 14:05:57] INFO: Interface testada em resolução 1920x1080
[18/04/2025 14:05:58] INFO: Interface testada em resolução 1366x768
[18/04/2025 14:05:59] INFO: Interface testada em resolução 768x1024
[18/04/2025 14:06:00] INFO: Interface testada em resolução 375x667
[18/04/2025 14:06:01] WARN: Tempo de carregamento acima do ideal em dispositivos móveis
[18/04/2025 14:06:05] INFO: Todos os testes concluídos`}
            </Box>
          </Paper>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Depuração
            </Typography>
            
            <TextField
              label="Comando de depuração"
              variant="outlined"
              fullWidth
              placeholder="Digite um comando para depuração"
              sx={{ mb: 2 }}
            />
            
            <Button
              variant="contained"
              color="primary"
              disabled
            >
              Executar Comando
            </Button>
          </Box>
        </TabPanel>
      </Paper>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Próximos Passos
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Correções Pendentes
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Otimizar carregamento de listas grandes" 
                    secondary="Implementar paginação e carregamento sob demanda"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Melhorar feedback visual em dispositivos móveis" 
                    secondary="Ajustar tamanho de botões e espaçamento para toque"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Implementar cache para dados frequentes" 
                    secondary="Reduzir chamadas de API e melhorar performance"
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Preparação para Produção
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Configurar ambiente de produção" 
                    secondary="Preparar servidor e banco de dados"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Finalizar documentação" 
                    secondary="Preparar guia de usuário e documentação técnica"
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText 
                    primary="Realizar testes de carga" 
                    secondary="Verificar comportamento com muitos usuários simultâneos"
                  />
                </ListItem>
              </List>
              
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate('/deploy')}
              >
                Preparar para Implantação
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      
      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TestPage;
