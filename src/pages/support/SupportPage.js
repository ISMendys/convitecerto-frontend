import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Card,
  CardContent,
  useMediaQuery,
  CircularProgress,
  InputAdornment,
  Chip,
  Avatar,
  Fade,
  Grow,
  IconButton,
  Tooltip,
  alpha,
  Stack
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Send as SendIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Mail as MailIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Analytics as AnalyticsIcon,
  Search as SearchIcon,
  QuestionAnswer as QuestionAnswerIcon,
  ContactSupport as ContactSupportIcon,
  ArrowForward as ArrowForwardIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { help } from '../../store/actions/configActions';

// Componente para o cabeçalho da página
const PageHeader = ({ title, description }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        mb: 4,
        position: 'relative',
        pb: 2,
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <Grow in={true} timeout={800}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{
              fontWeight: 700,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-flex',
              alignItems: 'center',
              mb: 1
            }}
          >
            <ContactSupportIcon 
              sx={{ 
                mr: 1.5, 
                fontSize: '1.8rem',
                color: theme.palette.primary.main
              }} 
            />
            {title}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              color: alpha(theme.palette.text.primary, 0.8)
            }}
          >
            {description}
          </Typography>
        </Box>
      </Grow>
    </Box>
  );
};

// Componente para a barra de pesquisa
const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const theme = useTheme();
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  return (
    <Paper
      elevation={0}
      sx={{
        p: 0.5,
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        mb: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.15)}`,
          borderColor: alpha(theme.palette.primary.main, 0.5),
        },
        backgroundColor: alpha(theme.palette.background.paper, 0.8),
      }}
    >
      <InputAdornment position="start" sx={{ pl: 1.5 }}>
        <SearchIcon color="primary" />
      </InputAdornment>
      <TextField
        fullWidth
        placeholder="Pesquisar nas perguntas frequentes..."
        variant="standard"
        value={query}
        onChange={handleSearch}
        InputProps={{
          disableUnderline: true,
          sx: { 
            px: 1,
            py: 1,
            fontSize: '1rem',
          }
        }}
      />
    </Paper>
  );
};

// Componente para as categorias de FAQ
const FAQCategory = ({ category, expanded, onChange, searchQuery }) => {
  const theme = useTheme();
  const [filteredQuestions, setFilteredQuestions] = useState(category.questions);
  
  // Filtrar perguntas com base na consulta de pesquisa
  useEffect(() => {
    if (!searchQuery) {
      setFilteredQuestions(category.questions);
      return;
    }
    
    const filtered = category.questions.filter(
      item => 
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredQuestions(filtered);
  }, [searchQuery, category.questions]);
  
  // Se não houver perguntas após a filtragem, não renderizar a categoria
  if (filteredQuestions.length === 0) {
    return null;
  }
  
  return (
    <Accordion 
      expanded={searchQuery ? true : expanded} 
      onChange={onChange(category.id)}
      sx={{ 
        mb: 2,
        borderRadius: '12px !important',
        overflow: 'hidden',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: (searchQuery ? true : expanded === category.id) 
          ? `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
          : '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease',
        '&:before': {
          display: 'none',
        },
        '&:hover': {
          boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
        }
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${category.id}-content`}
        id={`${category.id}-header`}
        sx={{ 
          backgroundColor: (searchQuery ? true : expanded === category.id)
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.background.paper, 0.8),
          '&:hover': { 
            backgroundColor: alpha(theme.palette.primary.main, 0.12)
          },
          '& .MuiAccordionSummary-content': {
            margin: '12px 0',
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
              width: 40,
              height: 40,
              mr: 2,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            {category.icon}
          </Avatar>
          <Box>
            <Typography 
              variant="h6"
              sx={{ 
                fontWeight: 600,
                color: (searchQuery ? true : expanded === category.id)
                  ? theme.palette.primary.main
                  : theme.palette.text.primary
              }}
            >
              {category.title}
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ display: { xs: 'none', sm: 'block' } }}
            >
              {filteredQuestions.length} {filteredQuestions.length === 1 ? 'pergunta' : 'perguntas'}
            </Typography>
          </Box>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 0 }}>
        <Box sx={{ p: 2, pt: 1 }}>
          {filteredQuestions.map((item, index) => (
            <Box 
              key={index} 
              sx={{ 
                mb: index < filteredQuestions.length - 1 ? 3 : 0,
                p: 2,
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.background.paper, 0.5),
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.background.paper, 0.9),
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }
              }}
            >
              <Typography 
                variant="subtitle1" 
                fontWeight="bold" 
                gutterBottom
                sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  color: theme.palette.primary.main
                }}
              >
                <QuestionAnswerIcon 
                  sx={{ 
                    mr: 1, 
                    mt: 0.3, 
                    fontSize: '1rem',
                    color: alpha(theme.palette.primary.main, 0.7)
                  }} 
                />
                {item.question}
              </Typography>
              <Typography 
                variant="body2" 
                paragraph
                sx={{ 
                  pl: 3.5,
                  color: alpha(theme.palette.text.primary, 0.9),
                  lineHeight: 1.6
                }}
              >
                {item.answer}
              </Typography>
              {index < filteredQuestions.length - 1 && (
                <Divider sx={{ mt: 2, opacity: 0.6 }} />
              )}
            </Box>
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

// Componente para o formulário de contato
const ContactForm = ({ onSubmit, isSubmitting }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  
  // Validação de campos
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim() === '' ? 'Nome é obrigatório' : '';
      case 'email':
        return !/^\S+@\S+\.\S+$/.test(value) ? 'Email inválido' : '';
      case 'subject':
        return value.trim() === '' ? 'Assunto é obrigatório' : '';
      case 'message':
        return value.trim() === '' ? 'Mensagem é obrigatória' : '';
      default:
        return '';
    }
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar campo ao digitar
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos os campos antes de enviar
    const newErrors = {};
    let hasError = false;
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        hasError = true;
      }
    });
    
    setErrors(newErrors);
    
    if (!hasError) {
      onSubmit(formData);
    }
  };
  
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 3,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ 
            fontWeight: 600,
            color: theme.palette.text.primary,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
              width: 40,
              height: 40,
              mr: 2,
              boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.2)}`,
            }}
          >
            <SendIcon />
          </Avatar>
          Entre em Contato
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ ml: 7, mb: 2 }}
        >
          Não encontrou o que procurava? Envie sua dúvida diretamente para nossa equipe de suporte.
        </Typography>
      </Box>
      
      {/* Canais de Contato */}
      <Box sx={{ mb: 3, p: 2, borderRadius: 2, backgroundColor: alpha(theme.palette.background.paper, 0.7), border: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', color: theme.palette.text.primary }}>
          <ChatIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Canais de Contato
        </Typography>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body1" color="text.secondary">
              Email: <Typography component="span" fontWeight={500}>suporte@convitecerto.com</Typography>
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="body1" color="text.secondary">
              Telefone: <Typography component="span" fontWeight={500}>Temporariamente indisponível.</Typography>
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              label="Nome"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              fullWidth
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="subject"
              label="Assunto"
              fullWidth
              required
              value={formData.subject}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.subject}
              helperText={errors.subject}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="message"
              label="Mensagem"
              fullWidth
              required
              multiline
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.message}
              helperText={errors.message}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 'auto', pt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            disabled={isSubmitting}
            endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
            sx={{ 
              borderRadius: 2,
              px: 4,
              py: 1.2,
              boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
              '&:hover': {
                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.6)}`,
                transform: 'translateY(-2px)'
              }
            }}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

// Componente principal da página de suporte
const SupportPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  
  // Estado para o acordeão expandido
  const [expanded, setExpanded] = useState(false);
  
  // Estado para pesquisa
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para o formulário de contato
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para feedback de envio
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Manipuladores de eventos
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    // If there's a search query, we want all matching FAQs to be expanded.
    // If no search query, reset expanded to false to collapse all.
    if (query) {
      setExpanded('all'); // This will make all accordions expanded if they have filtered questions
    } else {
      setExpanded(false); // Collapse all when search is cleared
    }
  };
  
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Simulação de envio bem-sucedido (já que não temos o endpoint real)
      // Na implementação real, você usaria:
      const response = await dispatch(help(formData)).unwrap();
      
      // Simulando um atraso de rede
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulando uma resposta bem-sucedida
      setSnackbar({
        open: true,
        message: 'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        severity: 'success'
      });
      
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao enviar mensagem. Por favor, tente novamente.',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };
  
  // Dados para as seções de FAQ
  const faqSections = [
    {
      id: 'eventos',
      title: 'Eventos',
      icon: <EventIcon />,
      questions: [
        {
          question: 'Como criar um novo evento?',
          answer: 'Para criar um novo evento, acesse o painel principal e clique no botão "Criar Evento". Preencha as informações básicas como título, data, hora e local. Você pode adicionar uma descrição e uma imagem de capa para personalizar seu evento. Após preencher todos os campos obrigatórios, clique em "Salvar" para criar o evento.'
        },
        {
          question: 'Como editar um evento existente?',
          answer: 'Para editar um evento existente, acesse a lista de eventos no painel principal, encontre o evento que deseja modificar e clique no ícone de edição (lápis). Você será direcionado para a página de edição onde poderá alterar qualquer informação do evento. Após fazer as alterações necessárias, clique em "Salvar" para aplicar as mudanças.'
        },
        {
          question: 'Como excluir um evento?',
          answer: 'Para excluir um evento, acesse a lista de eventos no painel principal, encontre o evento que deseja remover e clique no ícone de menu (três pontos verticais). Selecione a opção "Excluir" no menu que aparece. Um diálogo de confirmação será exibido para evitar exclusões acidentais. Confirme a exclusão e o evento será removido permanentemente.'
        }
      ]
    },
    {
      id: 'convidados',
      title: 'Convidados',
      icon: <PeopleIcon />,
      questions: [
        {
          question: 'Como adicionar convidados manualmente?',
          answer: 'Para adicionar convidados manualmente, acesse a página do evento e clique na aba "Convidados". Em seguida, clique no botão "Adicionar Convidado". Preencha os campos com as informações do convidado (nome, email, telefone, etc.) e clique em "Salvar". O convidado será adicionado à lista do evento.'
        },
        {
          question: 'Como importar uma lista de convidados?',
          answer: 'Para importar uma lista de convidados, acesse a página do evento e clique na aba "Convidados". Em seguida, clique no botão "Importar Convidados". Você pode fazer upload de um arquivo CSV ou Excel com os dados dos convidados. Certifique-se de que o arquivo segue o modelo fornecido. Após o upload, você poderá revisar os dados antes de confirmar a importação.'
        },
        {
          question: 'Como organizar convidados em grupos?',
          answer: 'Para organizar convidados em grupos, acesse a página do evento e clique na aba "Convidados". Você pode criar grupos clicando no botão "Gerenciar Grupos" e adicionando os nomes dos grupos desejados. Depois, você pode atribuir convidados a grupos específicos editando cada convidado individualmente ou selecionando múltiplos convidados e usando a opção "Atribuir ao Grupo" no menu de ações em massa.'
        }
      ]
    },
    {
      id: 'convites',
      title: 'Convites',
      icon: <MailIcon />,
      questions: [
        {
          question: 'Como personalizar um convite?',
          answer: 'Para personalizar um convite, acesse a página do evento e clique na aba "Convites". Selecione um modelo base e clique em "Personalizar". Na página de edição, você pode modificar cores, fontes, textos e adicionar imagens. Use a visualização em tempo real para ver como o convite ficará. Quando estiver satisfeito com o resultado, clique em "Salvar Convite".'
        },
        {
          question: 'Como visualizar o convite antes de enviar?',
          answer: 'Para visualizar o convite antes de enviar, acesse a página do evento, clique na aba "Convites" e selecione o convite que deseja visualizar. Clique no botão "Visualizar" para ver como o convite aparecerá para os convidados. Você também pode usar o botão "Testar Link" para acessar a versão online do convite exatamente como um convidado veria.'
        },
        {
          question: 'Como compartilhar o link do convite?',
          answer: 'Para compartilhar o link do convite, acesse a página do evento, clique na aba "Convites" e selecione o convite desejado. Clique no botão "Compartilhar" para ver as opções disponíveis. Você pode copiar o link diretamente, compartilhar via email, ou usar as integrações com redes sociais. Cada convidado receberá um link único que permite rastrear confirmações.'
        }
      ]
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      icon: <WhatsAppIcon />,
      questions: [
        {
          question: 'Como conectar minha conta do WhatsApp?',
          answer: 'Para conectar sua conta do WhatsApp, acesse o menu "Integrações" no painel lateral e selecione "WhatsApp". Clique em "Conectar WhatsApp" e siga as instruções para escanear o QR code com seu aplicativo WhatsApp. Mantenha seu telefone conectado à internet durante o processo. Após a conexão bem-sucedida, você verá o status "Conectado" na página.'
        },
        {
          question: 'Como enviar convites via WhatsApp?',
          answer: 'Para enviar convites via WhatsApp, primeiro certifique-se de que sua conta esteja conectada. Em seguida, acesse a página do evento, clique na aba "Convites" e selecione o convite que deseja enviar. Clique no botão "Enviar via WhatsApp", selecione os convidados que receberão a mensagem e personalize o texto se necessário. Clique em "Enviar" para iniciar o envio das mensagens.'
        },
        {
          question: 'O que fazer se a conexão com o WhatsApp cair?',
          answer: 'Se a conexão com o WhatsApp cair, acesse o menu "Integrações" no painel lateral e selecione "WhatsApp". Você verá um aviso indicando que a conexão foi perdida. Clique em "Reconectar" e siga as instruções para escanear o QR code novamente. Certifique-se de que seu telefone esteja conectado à internet e que o aplicativo WhatsApp esteja aberto durante o processo.'
        }
      ]
    },
    {
      id: 'rsvp',
      title: 'Confirmações (RSVP)',
      icon: <CheckCircleIcon />,
      questions: [
        {
          question: 'Como os convidados confirmam presença?',
          answer: 'Os convidados podem confirmar presença de duas maneiras: 1) Clicando no link do convite digital e selecionando "Confirmar Presença" ou "Não Poderei Comparecer" na página do evento; 2) Respondendo diretamente à mensagem de WhatsApp com as palavras-chave configuradas (por padrão, "Sim" para confirmar e "Não" para recusar). Todas as confirmações são registradas automaticamente no sistema.'
        },
        {
          question: 'Como acompanhar as confirmações recebidas?',
          answer: 'Para acompanhar as confirmações recebidas, acesse a página do evento e clique na aba "Convidados". Você verá uma lista de todos os convidados com seus respectivos status de confirmação (Pendente, Confirmado, Recusado). Você também pode visualizar estatísticas gerais na aba "Dashboard" do evento, que mostra gráficos e números totais de confirmações.'
        },
        {
          question: 'Como alterar manualmente o status de um convidado?',
          answer: 'Para alterar manualmente o status de um convidado, acesse a página do evento e clique na aba "Convidados". Encontre o convidado na lista e clique no ícone de edição (lápis). Na janela de edição, você pode alterar o status para "Pendente", "Confirmado" ou "Recusado". Você também pode selecionar múltiplos convidados e usar a opção "Alterar Status" no menu de ações em massa.'
        }
      ]
    },
    {
      id: 'estatisticas',
      title: 'Estatísticas',
      icon: <AnalyticsIcon />,
      questions: [
        {
          question: 'Quais estatísticas estão disponíveis?',
          answer: 'O sistema oferece diversas estatísticas para ajudar no planejamento do seu evento: 1) Taxa de confirmação (porcentagem de convidados que responderam); 2) Distribuição de respostas (confirmados vs. recusados); 3) Tempo médio de resposta; 4) Taxa de abertura dos convites; 5) Distribuição de convidados por grupo; 6) Número de acompanhantes confirmados. Todas essas informações estão disponíveis na aba "Dashboard" do evento.'
        },
        {
          question: 'Como exportar relatórios de estatísticas?',
          answer: 'Para exportar relatórios de estatísticas, acesse a página do evento e clique na aba "Dashboard". No canto superior direito, você encontrará o botão "Exportar Relatório". Você pode escolher entre os formatos PDF, Excel ou CSV. Selecione as seções que deseja incluir no relatório (Resumo Geral, Lista de Convidados, Estatísticas Detalhadas) e clique em "Gerar Relatório". O download começará automaticamente.'
        },
        {
          question: 'Como interpretar o gráfico de confirmações ao longo do tempo?',
          answer: 'O gráfico de confirmações ao longo do tempo mostra a evolução das respostas desde o envio dos convites. O eixo horizontal representa o tempo (em dias) e o eixo vertical mostra o número acumulado de confirmações. Este gráfico é útil para identificar padrões de resposta e planejar lembretes para convidados que ainda não responderam. Um aumento acentuado na curva geralmente indica o resultado de uma campanha de lembrete bem-sucedida.'
        }
      ]
    }
  ];
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <PageHeader 
        title="Central de Suporte" 
        description="Bem-vindo à página de suporte do Convite Certo. Aqui você encontrará respostas para as perguntas mais frequentes e poderá entrar em contato conosco caso precise de ajuda adicional."
      />
      
      <Grid container spacing={4}>
        {/* Seção de FAQ */}
        <Grid item xs={12} md={7}>
          <Box sx={{ mb: 4 }}>
            <SearchBar onSearch={handleSearch} />
            
            {faqSections.map((section) => (
              <FAQCategory
                key={section.id}
                category={section}
                expanded={searchQuery ? true : expanded === section.id}
                onChange={handleAccordionChange}
                searchQuery={searchQuery}
              />
            ))}
            
            {/* Mensagem quando não há resultados de pesquisa */}
            {searchQuery && faqSections.every(section => 
              section.questions.every(q => 
                !q.question.toLowerCase().includes(searchQuery.toLowerCase()) && 
                !q.answer.toLowerCase().includes(searchQuery.toLowerCase())
              )
            ) && (
              <Paper 
                sx={{ 
                  p: 3, 
                  textAlign: 'center',
                  borderRadius: 2,
                  backgroundColor: alpha(theme.palette.background.paper, 0.7)
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Nenhum resultado encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Não encontramos nenhuma pergunta ou resposta relacionada a "{searchQuery}".
                  <br />
                  Tente usar termos diferentes ou entre em contato conosco.
                </Typography>
              </Paper>
            )}
          </Box>
        </Grid>
        
        {/* Formulário de Contato */}
        <Grid item xs={12} md={5}>
          <ContactForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Grid>
      </Grid>
      
      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ 
            width: '100%',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default SupportPage;
