

# Classificacao de Desfecho — Atendimento + Relatorios

## Arquivos a editar

### 1. `src/pages/Atendimento.tsx`

**Modal de Encerramento:**
- Adicionar botao "Encerrar" no header do chat (ao lado do botao Assumir/Devolver)
- Dialog modal com botoes grandes para classificacao: "Venda Concluida", "Agendamento", "Sem Resposta", "Desinteresse", "Preco", "Outros"
- Opcao "Outros" abre campo de texto para motivo customizado
- Ao confirmar, atualiza estado local da conversa com o desfecho

**Estado compartilhado (via contexto ou store simples):**
- Criar estado `closedConversations` que armazena `{ conversationId, outcome, reason?, timestamp }`
- Exportar dados de desfecho para ser consumido pelo Relatorios (usando um arquivo de store compartilhado `src/lib/outcomeStore.ts`)

**Status do Lead na coluna direita:**
- Acima das tabs (Tarefas/Memoria/Agenda), adicionar badge colorida de status:
  - Verde: "Efetivado" (Venda Concluida ou Agendamento)
  - Vermelho: "Perdido" (Desinteresse, Preco, Outros)
  - Amarelo: "Sem Resposta"
  - Cinza: "Em Aberto" (default)

**Follow-up automatico:**
- Se desfecho = "Sem Resposta", inserir automaticamente uma nova tarefa "Follow-up: [nome] — em 2 dias" na lista de pendentes

### 2. `src/lib/outcomeStore.ts` (novo)
- Store simples com estado reativo (usando um pattern de export de estado + listeners ou simplesmente dados estaticos mockados que ambas paginas importam)
- Para manter simplicidade sem backend, usaremos um modulo com dados mockados iniciais + funcao `addOutcome` que atualiza o array em memoria
- Exporta: `outcomes[]`, `addOutcome()`, `getOutcomeCounts()`

### 3. `src/pages/Relatorios.tsx`

**Nova tab "Motivos de Perda"** ou adicionar grafico de pizza na tab "overview":
- Adicionar `PieChart` do recharts na aba "Funil & Volume" mostrando distribuicao dos desfechos
- Categorias: Venda Concluida, Agendamento, Sem Resposta, Desinteresse, Preco, Outros
- Cores consistentes com as badges do Atendimento
- Atualizar dados do funil para refletir os outcomes (mock inicial com dados pre-populados)

## Componentes Shadcn utilizados
- Dialog (modal de encerramento)
- Badge (status do lead)
- Button (botoes de desfecho)
- Textarea (campo "Outros")
- PieChart do recharts (grafico de pizza)

## Fluxo resumido

```text
[Chat Header] --click "Encerrar"--> [Dialog Modal]
  |-- Venda / Agendamento --> status Verde + atualiza store
  |-- Sem Resposta --> status Amarelo + cria tarefa follow-up 2 dias
  |-- Desinteresse / Preco / Outros --> status Vermelho + atualiza store

[Relatorios] importa store --> PieChart "Motivos de Perda"
```

