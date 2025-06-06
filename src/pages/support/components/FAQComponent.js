import React from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  ExpandMore as ExpandMoreIcon,
  Help as HelpIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Mail as MailIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckCircleIcon,
  Analytics as AnalyticsIcon
} from '@mui/icons-material';

/**
 * Componente de FAQ (Perguntas Frequentes) para a página de suporte
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.theme - Tema do Material-UI
 */
const FAQComponent = ({ theme }) => {
  // Dados para as seções de FAQ
  const faqSections = [
    {
      id: 'eventos',
      title: 'Eventos',
      icon: <EventIcon color="primary" />,
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
      icon: <PeopleIcon color="primary" />,
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
      icon: <MailIcon color="primary" />,
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
      icon: <WhatsAppIcon color="primary" />,
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
      icon: <CheckCircleIcon color="primary" />,
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
      icon: <AnalyticsIcon color="primary" />,
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
    <>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <HelpIcon sx={{ mr: 1 }} color="primary" />
        Perguntas Frequentes
      </Typography>
      
      <Typography variant="body2" paragraph color="text.secondary">
        Encontre respostas rápidas para as dúvidas mais comuns sobre nossa plataforma.
      </Typography>
      
      <Box sx={{ mt: 3 }}>
        {faqSections.map((section) => (
          <Accordion key={section.id} sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
              sx={{ 
                bgcolor: theme.palette.background.secondary,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.05) }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ mr: 1 }}>{section.icon}</Box>
                <Typography variant="h6">{section.title}</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {section.questions.map((item, index) => (
                <Box key={index} sx={{ mb: index < section.questions.length - 1 ? 3 : 0 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {item.question}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {item.answer}
                  </Typography>
                  {index < section.questions.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </>
  );
};

export default FAQComponent;

