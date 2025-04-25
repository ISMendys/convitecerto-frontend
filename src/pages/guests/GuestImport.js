import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Save as SaveIcon,
  FileDownload as FileDownloadIcon,
  Help as HelpIcon
} from '@mui/icons-material';
import { importGuests } from '../../store/actions/guestActions';

const GuestImport = () => {
  const { eventId } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [parsedData, setParsedData] = useState([]);
  const [mappings, setMappings] = useState({
    name: '',
    email: '',
    phone: '',
    group: ''
  });
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);
  
  // Passos do processo de importação
  const steps = [
    'Selecionar Arquivo',
    'Mapear Colunas',
    'Revisar e Confirmar'
  ];
  
  // Manipular upload de arquivo
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) {
      return;
    }
    
    // Verificar tipo de arquivo
    if (selectedFile.type !== 'text/csv' && 
        selectedFile.type !== 'application/vnd.ms-excel' &&
        !selectedFile.name.endsWith('.csv')) {
      setFileError('Por favor, selecione um arquivo CSV válido');
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
    setFileError('');
    
    // Ler arquivo
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csvData = event.target.result;
        const parsedCSV = parseCSV(csvData);
        
        if (parsedCSV.length < 2) {
          setFileError('O arquivo não contém dados suficientes');
          return;
        }
        
        // Extrair cabeçalhos
        const headers = parsedCSV[0];
        
        // Extrair dados
        const data = parsedCSV.slice(1).map(row => {
          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = row[index] || '';
          });
          return rowData;
        });
        
        setParsedData(data);
        
        // Tentar mapear colunas automaticamente
        const autoMappings = {
          name: '',
          email: '',
          phone: '',
          group: ''
        };
        
        headers.forEach(header => {
          const lowerHeader = header.toLowerCase();
          
          if (lowerHeader.includes('nome')) {
            autoMappings.name = header;
          } else if (lowerHeader.includes('email') || lowerHeader.includes('e-mail')) {
            autoMappings.email = header;
          } else if (lowerHeader.includes('telefone') || lowerHeader.includes('celular') || lowerHeader.includes('whatsapp')) {
            autoMappings.phone = header;
          } else if (lowerHeader.includes('grupo') || lowerHeader.includes('categoria')) {
            autoMappings.group = header;
          }
        });
        
        setMappings(autoMappings);
        
      } catch (error) {
        setFileError('Erro ao processar o arquivo: ' + error.message);
      }
    };
    
    reader.onerror = () => {
      setFileError('Erro ao ler o arquivo');
    };
    
    reader.readAsText(selectedFile);
  };
  
  // Função para analisar CSV
  const parseCSV = (text) => {
    const lines = text.split(/\\r?\\n/).filter(line => line.trim());
    return lines.map(line => {
      // Lidar com campos entre aspas que podem conter vírgulas
      const result = [];
      let inQuotes = false;
      let currentField = '';
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          result.push(currentField.trim());
          currentField = '';
        } else {
          currentField += char;
        }
      }
      
      result.push(currentField.trim());
      return result;
    });
  };
  
  // Manipular mudança de mapeamento
  const handleMappingChange = (field, value) => {
    setMappings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Gerar dados de pré-visualização
  const generatePreview = () => {
    if (!mappings.name) {
      setSnackbarMessage('O campo Nome é obrigatório para importação');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    
    const preview = parsedData.map(row => {
      const guest = {
        name: row[mappings.name] || '',
        email: mappings.email ? row[mappings.email] || '' : '',
        phone: mappings.phone ? row[mappings.phone] || '' : '',
        group: mappings.group ? row[mappings.group] || 'default' : 'default',
        status: 'pending',
        whatsapp: true
      };
      
      return guest;
    }).filter(guest => guest.name.trim());
    
    if (preview.length === 0) {
      setSnackbarMessage('Nenhum convidado válido encontrado após o mapeamento');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return false;
    }
    
    setPreviewData(preview);
    return true;
  };
  
  // Avançar para o próximo passo
  const handleNext = () => {
    if (activeStep === 0) {
      if (!file) {
        setFileError('Por favor, selecione um arquivo');
        return;
      }
      
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (generatePreview()) {
        setActiveStep(2);
      }
    } else if (activeStep === 2) {
      handleImport();
    }
  };
  
  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };
  
  // Importar convidados
  const handleImport = async () => {
    try {
      setLoading(true);
      
      // Adicionar eventId a cada convidado
      const guestsWithEventId = previewData.map(guest => ({
        ...guest,
        eventId
      }));
      
      await dispatch(importGuests({ eventId, guests: guestsWithEventId })).unwrap();
      
      setSnackbarMessage(`${previewData.length} convidados importados com sucesso!`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Redirecionar após um breve delay
      setTimeout(() => {
        navigate(`/events/${eventId}/guests`);
      }, 2000);
    } catch (err) {
      setSnackbarMessage(err || 'Erro ao importar convidados');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Baixar modelo de CSV
  const handleDownloadTemplate = () => {
    const headers = ['Nome', 'Email', 'Telefone', 'Grupo'];
    const sampleData = [
      ['João Silva', 'joao@exemplo.com', '11987654321', 'Família'],
      ['Maria Oliveira', 'maria@exemplo.com', '11912345678', 'Amigos'],
      ['Carlos Santos', 'carlos@exemplo.com', '11955556666', 'Trabalho']
    ];
    
    const csvContent = [
      headers.join(','),
      ...sampleData.map(row => row.join(','))
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'modelo_convidados.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Renderizar conteúdo do passo atual
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Selecione um arquivo CSV contendo a lista de convidados para importar.
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3 }}>
              <input
                accept=".csv"
                style={{ display: 'none' }}
                id="upload-csv-file"
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="upload-csv-file">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUploadIcon />}
                  size="large"
                >
                  Selecionar Arquivo CSV
                </Button>
              </label>
              
              {fileError && (
                <FormHelperText error sx={{ mt: 1 }}>
                  {fileError}
                </FormHelperText>
              )}
              
              {file && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body1">
                    Arquivo selecionado: <strong>{file.name}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={handleDownloadTemplate}
              >
                Baixar Modelo CSV
              </Button>
            </Box>
          </Box>
        );
      
      case 1:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Mapeie as colunas do seu arquivo CSV para os campos correspondentes.
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Campo Nome *"
                  value={mappings.name}
                  onChange={(e) => handleMappingChange('name', e.target.value)}
                  fullWidth
                  required
                  error={!mappings.name}
                  helperText={!mappings.name ? 'Campo obrigatório' : ''}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Selecione uma coluna</option>
                  {parsedData.length > 0 && 
                    Object.keys(parsedData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Campo Email"
                  value={mappings.email}
                  onChange={(e) => handleMappingChange('email', e.target.value)}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Selecione uma coluna</option>
                  {parsedData.length > 0 && 
                    Object.keys(parsedData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Campo Telefone"
                  value={mappings.phone}
                  onChange={(e) => handleMappingChange('phone', e.target.value)}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Selecione uma coluna</option>
                  {parsedData.length > 0 && 
                    Object.keys(parsedData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Campo Grupo"
                  value={mappings.group}
                  onChange={(e) => handleMappingChange('group', e.target.value)}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">Selecione uma coluna</option>
                  {parsedData.length > 0 && 
                    Object.keys(parsedData[0]).map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                </TextField>
              </Grid>
            </Grid>
            
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Prévia dos Dados
              </Typography>
              
              <TableContainer sx={{ maxHeight: 300 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      {parsedData.length > 0 && 
                        Object.keys(parsedData[0]).map((header) => (
                          <TableCell key={header}>
                            {header}
                            {header === mappings.name && (
                              <Chip 
                                label="Nome" 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                            {header === mappings.email && (
                              <Chip 
                                label="Email" 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                            {header === mappings.phone && (
                              <Chip 
                                label="Telefone" 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                            {header === mappings.group && (
                              <Chip 
                                label="Grupo" 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }} 
                              />
                            )}
                          </TableCell>
                        ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {parsedData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        {Object.values(row).map((cell, cellIndex) => (
                          <TableCell key={cellIndex}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              {parsedData.length > 5 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  Mostrando 5 de {parsedData.length} registros
                </Typography>
              )}
            </Box>
          </Box>
        );
      
      case 2:
        return (
          <Box>
            <Typography variant="body1" paragraph>
              Revise os dados antes de importar. Serão importados {previewData.length} convidados.
            </Typography>
            
            <TableContainer sx={{ maxHeight: 400 }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Telefone</TableCell>
                    <TableCell>Grupo</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewData.map((guest, index) => (
                    <TableRow key={index}>
                      <TableCell>{guest.name}</TableCell>
                      <TableCell>{guest.email}</TableCell>
                      <TableCell>{guest.phone}</TableCell>
                      <TableCell>
                        {guest.group === 'default' ? 'Geral' : 
                         guest.group === 'family' ? 'Família' :
                         guest.group === 'friends' ? 'Amigos' :
                         guest.group === 'colleagues' ? 'Colegas' :
                         guest.group === 'vip' ? 'VIP' : guest.group}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label="Pendente" 
                          size="small" 
                          color="warning" 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Total: {previewData.length} convidados
              </Typography>
              
              <Box>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => navigate(`/events/${eventId}/guests`)}
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
                
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleImport}
                  disabled={loading}
                >
                  {loading ? 'Importando...' : 'Importar Convidados'}
                </Button>
              </Box>
            </Box>
          </Box>
        );
      
      default:
        return 'Passo desconhecido';
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          variant="text"
          color="inherit"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/events/${eventId}/guests`)}
          sx={{ mb: 2 }}
        >
          Voltar para Lista de Convidados
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Importar Convidados
          </Typography>
          
          <IconButton color="primary" onClick={() => setHelpDialogOpen(true)}>
            <HelpIcon />
          </IconButton>
        </Box>
        
        <Typography variant="body1" color="text.secondary">
          Importe sua lista de convidados a partir de um arquivo CSV
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel={!isMobile} orientation={isMobile ? 'vertical' : 'horizontal'}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>
      
      <Paper sx={{ p: 3, mb: 3 }}>
        {getStepContent(activeStep)}
      </Paper>
      
      {activeStep !== 2 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
          >
            Voltar
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={<ArrowForwardIcon />}
          >
            {activeStep === steps.length - 1 ? 'Importar' : 'Próximo'}
          </Button>
        </Box>
      )}
      
      {/* Diálogo de ajuda */}
      <Dialog
        open={helpDialogOpen}
        onClose={() => setHelpDialogOpen(false)}
        maxWidth="md"
      >
        <DialogTitle>Como Importar Convidados</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="subtitle1" gutterBottom>
              Formato do Arquivo CSV
            </Typography>
            
            <Typography variant="body2" paragraph>
              O arquivo CSV deve conter pelo menos uma coluna com os nomes dos convidados. Colunas adicionais para email, telefone e grupo são opcionais.
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              Exemplo de Arquivo CSV:
            </Typography>
            
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, fontFamily: 'monospace', mb: 2 }}>
              Nome,Email,Telefone,Grupo<br />
              João Silva,joao@exemplo.com,11987654321,Família<br />
              Maria Oliveira,maria@exemplo.com,11912345678,Amigos<br />
              Carlos Santos,carlos@exemplo.com,11955556666,Trabalho
            </Box>
            
            <Typography variant="subtitle1" gutterBottom>
              Dicas:
            </Typography>
            
            <ul>
              <li>Certifique-se de que a primeira linha contenha os cabeçalhos das colunas</li>
              <li>O campo Nome é obrigatório para cada convidado</li>
              <li>Para números de telefone, recomendamos o formato com DDD (ex: 11987654321)</li>
              <li>Grupos serão mapeados automaticamente para as categorias do sistema</li>
              <li>Todos os convidados importados terão o status inicial "Pendente"</li>
            </ul>
            
            <Typography variant="subtitle1" gutterBottom>
              Precisa de ajuda?
            </Typography>
            
            <Typography variant="body2">
              Você pode baixar um modelo de arquivo CSV clicando no botão "Baixar Modelo CSV" na primeira etapa do assistente.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpDialogOpen(false)} color="primary">
            Entendi
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default GuestImport;
