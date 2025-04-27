import React, { useState, useRef, useEffect } from 'react';
import { useTheme, alpha } from '@mui/material/styles';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  FileDownload as FileDownloadIcon,
  Check as CheckIcon,
  Error as ErrorIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import axios from 'axios';

/**
 * Componente para importação de convidados via CSV
 * Delega o processamento real para o backend
 */
const GuestImport = ({ open, onClose, eventId, onSuccess }) => {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState(null);
  const [mappings, setMappings] = useState({
    name: 'name',
    email: 'email',
    phone: 'phone',
    whatsapp: 'whatsapp',
    group: 'group',
    status: 'status'
  });
  const [availableColumns, setAvailableColumns] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Resetar estado quando o diálogo é fechado
  useEffect(() => {
    if (!open) {
      setActiveStep(0);
      setFile(null);
      setPreview([]);
      setError(null);
      setImportResults(null);
    }
  }, [open]);
  
  // Passos do processo de importação
  const steps = ['Selecionar arquivo', 'Mapear colunas', 'Revisar e importar'];
  
  // Manipular seleção de arquivo
  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      
      // Verificar se é um CSV
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Por favor, selecione apenas arquivos CSV.');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Ler o conteúdo do arquivo para preview
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const lines = content.split('\n');
          
          if (lines.length < 2) {
            setError('O arquivo CSV deve conter pelo menos um cabeçalho e uma linha de dados.');
            return;
          }
          
          const headers = lines[0].split(',').map(h => h.trim());
          setAvailableColumns(headers);
          
          // Tentar mapear automaticamente as colunas
          const newMappings = { ...mappings };
          headers.forEach(header => {
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes('nome') || lowerHeader.includes('name')) {
              newMappings.name = header;
            } else if (lowerHeader.includes('email')) {
              newMappings.email = header;
            } else if (lowerHeader.includes('telefone') || lowerHeader.includes('phone')) {
              newMappings.phone = header;
            } else if (lowerHeader.includes('whatsapp')) {
              newMappings.whatsapp = header;
            } else if (lowerHeader.includes('grupo') || lowerHeader.includes('group')) {
              newMappings.group = header;
            } else if (lowerHeader.includes('status')) {
              newMappings.status = header;
            }
          });
          setMappings(newMappings);
          
          // Mostrar apenas as primeiras 5 linhas no preview
          const previewData = [];
          for (let i = 1; i < Math.min(lines.length, 6); i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',');
              const row = {};
              headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
              });
              previewData.push(row);
            }
          }
          
          setPreview(previewData);
          setActiveStep(1); // Avançar para o próximo passo
        } catch (error) {
          console.error('Erro ao processar CSV:', error);
          setError('Erro ao processar o arquivo CSV. Verifique se o formato está correto.');
        }
      };
      reader.readAsText(selectedFile);
    }
  };
  
  // Abrir seletor de arquivo
  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };
  
  // Baixar modelo de CSV
  const handleDownloadTemplate = () => {
    const headers = ['name', 'email', 'phone', 'whatsapp', 'group', 'status'];
    const sampleData = [
      'João Silva,joao@email.com,11999998888,true,family,confirmed',
      'Maria Oliveira,maria@email.com,11988887777,false,friends,pending',
      'Carlos Santos,carlos@email.com,11977776666,true,colleagues,declined'
    ];
    
    const csvContent = [headers.join(','), ...sampleData].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'convidados_modelo.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Avançar para o próximo passo
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  // Voltar para o passo anterior
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Importar CSV
  const handleImport = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Preparar o FormData para envio
      const formData = new FormData();
      formData.append('file', file);
      formData.append('eventId', eventId);
      formData.append('mappings', JSON.stringify(mappings));
      
      // Enviar para o backend
      const response = await axios.post('/api/guests/import-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setImportResults(response.data);
      setActiveStep(3); // Avançar para o resultado
      
      // Notificar sucesso
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (err) {
      console.error('Erro ao importar CSV:', err);
      setError(err.response?.data?.error || 'Erro ao importar convidados. Tente novamente.');
      setSnackbarMessage(err.response?.data?.error || 'Erro ao importar convidados. Tente novamente.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Simular importação (para desenvolvimento)
  const handleSimulateImport = () => {
    setLoading(true);
    setError(null);
    
    // Simular processamento
    setTimeout(() => {
      const results = {
        success: true,
        imported: 3,
        skipped: 1,
        errors: 0,
        details: [
          { name: 'João Silva', status: 'success', message: 'Importado com sucesso' },
          { name: 'Maria Oliveira', status: 'success', message: 'Importado com sucesso' },
          { name: 'Carlos Santos', status: 'success', message: 'Importado com sucesso' },
          { name: 'Ana Pereira', status: 'skipped', message: 'Email duplicado' }
        ]
      };
      
      setImportResults(results);
      setActiveStep(3); // Avançar para o resultado
      
      // Notificar sucesso
      if (onSuccess) {
        onSuccess(results);
      }
      
      setLoading(false);
    }, 2000);
  };
  
  // Renderizar conteúdo do passo atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Selecionar arquivo
        return (
          <Box sx={{ mt: 2 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            
            <Box 
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                mb: 3
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleBrowseClick}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  flexGrow: { xs: 1, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                  boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                }}
              >
                {loading ? 'Processando...' : 'Selecionar Arquivo CSV'}
              </Button>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDownloadTemplate}
                startIcon={<FileDownloadIcon />}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  px: 3,
                  flexGrow: { xs: 1, sm: 0 },
                  width: { xs: '100%', sm: 'auto' }
                }}
              >
                Baixar Modelo
              </Button>
              
              <Typography variant="body2" color="textSecondary">
                {file ? file.name : 'Nenhum arquivo selecionado'}
              </Typography>
            </Box>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Instruções:
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                1. O arquivo CSV deve conter um cabeçalho com os nomes das colunas.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                2. As colunas recomendadas são: name, email, phone, whatsapp, group, status.
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                3. Para valores booleanos como whatsapp, use "true" ou "false".
              </Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                4. Para status, use "confirmed", "pending" ou "declined".
              </Typography>
            </Box>
          </Box>
        );
        
      case 1: // Mapear colunas
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Mapeamento de Colunas
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Associe as colunas do seu CSV aos campos do sistema:
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
              {Object.keys(mappings).map((field) => (
                <FormControl key={field} fullWidth size="small">
                  <InputLabel id={`${field}-mapping-label`}>{field}</InputLabel>
                  <Select
                    labelId={`${field}-mapping-label`}
                    value={mappings[field]}
                    onChange={(e) => setMappings({ ...mappings, [field]: e.target.value })}
                    label={field}
                  >
                    <MenuItem value="">
                      <em>Ignorar</em>
                    </MenuItem>
                    {availableColumns.map((column) => (
                      <MenuItem key={column} value={column}>
                        {column}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ))}
            </Box>
            
            {/* Preview dos dados */}
            <Typography variant="subtitle1" gutterBottom>
              Preview dos dados:
            </Typography>
            
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                maxHeight: 300, 
                overflow: 'auto',
                borderRadius: 2,
                mb: 2
              }}
            >
              <Table preview={preview} />
            </Paper>
          </Box>
        );
        
      case 2: // Revisar e importar
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Revisar e Importar
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" paragraph>
                <strong>Arquivo:</strong> {file?.name}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Número de registros:</strong> {preview.length}
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Mapeamento de colunas:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {Object.entries(mappings).map(([field, column]) => (
                  column && (
                    <Chip 
                      key={field}
                      label={`${field} → ${column}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )
                ))}
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                Os convidados serão importados para o evento atual. Registros duplicados serão ignorados.
              </Alert>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={process.env.NODE_ENV === 'development' ? handleSimulateImport : handleImport}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                disabled={loading}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                }}
              >
                {loading ? 'Importando...' : 'Importar Convidados'}
              </Button>
            </Box>
          </Box>
        );
        
      case 3: // Resultados
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              {importResults?.success ? (
                <CheckIcon color="success" sx={{ fontSize: 60 }} />
              ) : (
                <ErrorIcon color="error" sx={{ fontSize: 60 }} />
              )}
              
              <Typography variant="h6" gutterBottom>
                {importResults?.success ? 'Importação Concluída!' : 'Erro na Importação'}
              </Typography>
              
              <Typography variant="body1" paragraph>
                {importResults?.success 
                  ? `${importResults.imported} convidados importados com sucesso.`
                  : 'Ocorreu um erro durante a importação.'}
              </Typography>
              
              {importResults?.skipped > 0 && (
                <Typography variant="body2" color="textSecondary">
                  {importResults.skipped} registros ignorados devido a duplicações ou erros.
                </Typography>
              )}
            </Box>
            
            {importResults?.details && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Detalhes:
                </Typography>
                
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    maxHeight: 300, 
                    overflow: 'auto',
                    borderRadius: 2
                  }}
                >
                  {importResults.details.map((detail, index) => (
                    <Box 
                      key={index}
                      sx={{ 
                        p: 1, 
                        mb: 1, 
                        borderRadius: 1,
                        bgcolor: detail.status === 'success' 
                          ? alpha(theme.palette.success.main, 0.1)
                          : detail.status === 'skipped'
                            ? alpha(theme.palette.warning.main, 0.1)
                            : alpha(theme.palette.error.main, 0.1)
                      }}
                    >
                      <Typography variant="body2">
                        <strong>{detail.name}</strong>: {detail.message}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>
            )}
          </Box>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      <Dialog
        open={open}
        onClose={activeStep === 3 ? onClose : undefined}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white',
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ mr: 1 }} />
            Importar Convidados
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, pb: 4 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Conteúdo do passo atual */}
          {renderStepContent()}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {activeStep !== 3 && (
            <Button 
              onClick={onClose} 
              variant="outlined"
              color="inherit"
              sx={{ 
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Cancelar
            </Button>
          )}
          
          {activeStep > 0 && activeStep < 3 && (
            <Button 
              onClick={handleBack} 
              variant="outlined"
              color="primary"
              sx={{ 
                borderRadius: 2,
                fontWeight: 600
              }}
            >
              Voltar
            </Button>
          )}
          
          {activeStep < 2 && (
            <Button 
              onClick={handleNext} 
              variant="contained" 
              color="primary"
              disabled={activeStep === 0 && !file}
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              }}
            >
              Próximo
            </Button>
          )}
          
          {activeStep === 3 && (
            <Button 
              onClick={onClose} 
              variant="contained" 
              color="primary"
              sx={{ 
                borderRadius: 2,
                fontWeight: 600,
                boxShadow: '0 4px 12px rgba(94, 53, 177, 0.2)',
                background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
              }}
            >
              Concluir
            </Button>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Snackbar para mensagens */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            borderRadius: 2
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

// Componente de tabela para preview
const Table = ({ preview }) => {
  if (!preview || preview.length === 0) return null;
  
  // Obter cabeçalhos da primeira linha
  const headers = Object.keys(preview[0]);
  
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index} style={{ 
                padding: '8px', 
                textAlign: 'left', 
                borderBottom: '1px solid #ddd',
                backgroundColor: '#f5f5f5'
              }}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {preview.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex} style={{ 
                  padding: '8px', 
                  textAlign: 'left',
                  borderBottom: '1px solid #eee'
                }}>
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default GuestImport;
