

# VerbIA - Plataforma de Agentes SDR Multissetoriais

## Visão Geral
Dashboard SaaS dark mode elegante para gestão de agentes de IA SDR e atendimento ao cliente, com foco em múltiplos setores (logística, saúde, imobiliário, advocacia, turismo, consórcio).

## Identidade Visual
- **Dark mode** com acentos em verde neon (#39FF14 / tons de emerald)
- Tipografia moderna e clean
- Ícones Lucide-react
- Cards com glassmorphism sutil e bordas em verde neon

## Estrutura de Navegação (Sidebar)
- 🏠 Dashboard
- 🤖 Meus Agentes
- 🔗 Integrações (n8n, WhatsApp, Instagram, Facebook)
- 🎯 Leads Qualificados
- 💰 Faturamento

## Páginas e Funcionalidades

### 1. Dashboard Principal
- **Cards de métricas**: Conversas Ativas, Agendamentos Realizados, Leads Quentes, ROI Mensal
- **Gráfico de desempenho** (Recharts) — conversões ao longo do tempo
- **Feed em tempo real** das últimas interações dos agentes
- Filtro por agente e por período

### 2. Meus Agentes
- Lista de agentes criados com status (ativo/inativo)
- Botão "Criar Novo Agente" que abre o fluxo de configuração
- **Seletor de Segmento ("Cérebro")**: Manda Já (Logística), Saúde/Estética/Dentistas, Imobiliário, Advocacia, Turismo, Consórcio — cada um com ícone e descrição do foco

### 3. Tela de Configuração do Agente
- **Prompt Mestre**: campo de texto para personalidade do agente
- **Memória Persistente**: seletor de retenção (7 dias, 30 dias, Para Sempre) com slider visual
- **Booking Engine**: componente visual para conectar Google Calendar / Outlook (UI mockup com status de conexão)
- **Knowledge Base (RAG)**: drag-and-drop para upload de PDFs + campo para inserir links
- **Termômetro de Lead**: interface para definir palavras-chave e ações que marcam lead como 🔥
- **Filtro de Discernimento**: toggle "Modo Abundância vs. Urgência"
- **Webhook URL**: campo para integração com n8n
- **Toggle Transbordo**: ativar "Modo de Negociação Humana"
- **API Key de Memória**: campo de configuração

### 4. Integrações
- Cards para cada canal: WhatsApp, Instagram, Facebook, n8n
- Status de conexão (conectado/desconectado)
- Campo de configuração por canal (número, token, webhook URL)

### 5. Leads Qualificados
- Tabela com leads capturados, com score visual (frio/morno/quente 🔥)
- Filtros por agente, segmento, data e score
- Detalhes do lead em painel lateral (histórico de conversa, ações realizadas)

### 6. Faturamento
- Resumo do plano atual
- Histórico de faturas
- Métricas de uso (conversas, agentes ativos)

## Observações Técnicas
- Dados mockados (sem backend real nesta fase)
- Todas as páginas responsivas
- Componentes Shadcn/UI customizados para o tema dark + verde neon
- React Router para navegação entre páginas

