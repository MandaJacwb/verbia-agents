

# Centro de Atendimento em Tempo Real

## Arquivos a criar/editar

### 1. `src/pages/Atendimento.tsx` — Página principal
Layout de 3 colunas usando `ResizablePanelGroup` (já disponível no projeto):

**Coluna Esquerda (~25%)** — Lista de Chats:
- ScrollArea com lista de conversas mockadas
- Cada item: Avatar, nome, tag colorida (Badge), indicador IA/Humano, contador não-lidas, tempo desde última msg
- Estado selecionado com destaque neon

**Coluna Central (~45%)** — Janela de Chat:
- Header com info do cliente + botão "Assumir Atendimento" / "Devolver ao Agente" (toggle)
- Área de mensagens com balões distintos (cores diferentes para Cliente, IA, Humano)
- Tabs no rodapé: "Chat" e "Sussurro" (anotações internas)
- Input com botões de anexo e emoji

**Coluna Direita (~30%)** — Inteligência & Follow-up:
- Tabs: "Tarefas", "Memória", "Agenda"
- **Tarefas**: Lista drag-and-drop (Pendente ↔ Concluído) usando estado React + handlers onDragStart/onDrop nativos do HTML5
- **Memória**: Resumo IA mockado dos pontos discutidos
- **Agenda**: Mini calendário (componente Calendar já existe) + lista de agendamentos

### 2. `src/App.tsx` — Adicionar rota
- Nova rota `/atendimento` com componente `Atendimento`

### 3. `src/components/AppSidebar.tsx` — Adicionar nav item
- Item "Atendimento" com ícone `Headphones` entre "Meus Agentes" e "Integrações"

## Dados mockados
- ~6 conversas com tags variadas (Vendas, Suporte, Manda Já, Estética)
- ~10 mensagens por conversa alternando Cliente/IA/Humano
- ~4 tarefas de follow-up
- Resumo de memória por lead

## Componentes Shadcn utilizados
ScrollArea, Tabs, Badge, Avatar, Button, Card, Calendar, Separator

