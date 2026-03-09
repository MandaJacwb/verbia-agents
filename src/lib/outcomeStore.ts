export type OutcomeType =
  | "venda"
  | "agendamento"
  | "sem_resposta"
  | "desinteresse"
  | "preco"
  | "outros";

export interface Outcome {
  conversationId: string;
  outcome: OutcomeType;
  reason?: string;
  timestamp: Date;
}

const outcomeLabels: Record<OutcomeType, string> = {
  venda: "Venda Concluída",
  agendamento: "Agendamento",
  sem_resposta: "Sem Resposta",
  desinteresse: "Desinteresse",
  preco: "Preço",
  outros: "Outros",
};

const outcomeColors: Record<OutcomeType, string> = {
  venda: "hsl(120, 100%, 62%)",
  agendamento: "hsl(160, 70%, 45%)",
  sem_resposta: "hsl(45, 100%, 60%)",
  desinteresse: "hsl(0, 70%, 55%)",
  preco: "hsl(25, 90%, 55%)",
  outros: "hsl(220, 15%, 50%)",
};

// Pre-populated mock data
const outcomes: Outcome[] = [
  { conversationId: "a1", outcome: "venda", timestamp: new Date("2026-03-01") },
  { conversationId: "a2", outcome: "venda", timestamp: new Date("2026-03-02") },
  { conversationId: "a3", outcome: "agendamento", timestamp: new Date("2026-03-01") },
  { conversationId: "a4", outcome: "agendamento", timestamp: new Date("2026-03-03") },
  { conversationId: "a5", outcome: "agendamento", timestamp: new Date("2026-03-04") },
  { conversationId: "a6", outcome: "sem_resposta", timestamp: new Date("2026-03-02") },
  { conversationId: "a7", outcome: "sem_resposta", timestamp: new Date("2026-03-05") },
  { conversationId: "a8", outcome: "sem_resposta", timestamp: new Date("2026-03-06") },
  { conversationId: "a9", outcome: "sem_resposta", timestamp: new Date("2026-03-07") },
  { conversationId: "a10", outcome: "desinteresse", timestamp: new Date("2026-03-03") },
  { conversationId: "a11", outcome: "desinteresse", timestamp: new Date("2026-03-04") },
  { conversationId: "a12", outcome: "preco", timestamp: new Date("2026-03-05") },
  { conversationId: "a13", outcome: "preco", timestamp: new Date("2026-03-06") },
  { conversationId: "a14", outcome: "preco", timestamp: new Date("2026-03-07") },
  { conversationId: "a15", outcome: "outros", reason: "Mudou de cidade", timestamp: new Date("2026-03-04") },
];

type Listener = () => void;
const listeners: Listener[] = [];

export function subscribe(fn: Listener) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

function notify() {
  listeners.forEach((fn) => fn());
}

export function addOutcome(o: Outcome) {
  outcomes.push(o);
  notify();
}

export function getOutcomes(): Outcome[] {
  return outcomes;
}

export function getOutcomeCounts(): { name: string; value: number; fill: string; type: OutcomeType }[] {
  const counts: Record<OutcomeType, number> = {
    venda: 0,
    agendamento: 0,
    sem_resposta: 0,
    desinteresse: 0,
    preco: 0,
    outros: 0,
  };
  for (const o of outcomes) {
    counts[o.outcome]++;
  }
  return (Object.keys(counts) as OutcomeType[]).map((type) => ({
    name: outcomeLabels[type],
    value: counts[type],
    fill: outcomeColors[type],
    type,
  }));
}

export function getOutcomeForConversation(conversationId: string): Outcome | undefined {
  return outcomes.find((o) => o.conversationId === conversationId);
}

export { outcomeLabels, outcomeColors };
