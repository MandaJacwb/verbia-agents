# Configuração de Agentes por Canal

## Resumo

Criar a página `Integracoes.tsx` reformulada (ou uma nova rota) que combine cards de conexão por canal, tabela de agentes ativos por canal, e lógica de etiquetagem automática por origem.

## Implementação

### 1. Reescrever `src/pages/Integracoes.tsx`

**Cards de Conexão:**

- Cards lado a lado: WhatsApp, Instagram, Messenger e site
- Cada card: ícone colorido, identificador (número/@ handle), badge de status (Conectado/Desconectado), botão "Alterar Agente" que abre um Select para vincular um agente existente ao canal

**Tabela de Agentes Ativos:**

- Colunas: Nome do Agente, Canal (ícone colorido), Equipe Padrão (Vendas/Suporte via Badge), Status (Em uso/Rascunho)
- Ações: botões icon para Configurações (navega a `/agentes/:id`), Duplicar, Editar, Excluir
- Dados mock vinculando agentes existentes a canais

**Design:** glass-card, neon-border, Dark Mode consistente

### 2. Atualizar `src/lib/contactsStore.ts`

- Adicionar tags de canal ao `TAG_COLORS`: `"WHATSAPP"`, `"INSTAGRAM"`, `"MESSENGER"` , "SITE" com cores correspondentes ao projeto que ja estamos atuando
- Adicionar função `addChannelTag(contactId, channel)` que aplica automaticamente a etiqueta do canal de origem
- Atualizar `addContact` para aceitar um parâmetro opcional `channel` que auto-aplica a tag

### 3. Rota

- Manter rota `/integracoes` existente no `App.tsx` — apenas reescrever o conteúdo da página