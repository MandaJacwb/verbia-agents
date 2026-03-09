export interface Contact {
  id: string;
  name: string;
  phone: string;
  instagram?: string;
  email?: string;
  empresa?: string;
  redesSociais?: string;
  opportunityValue?: number;
  tags: string[];
  avatarUrl?: string;
  createdAt: Date;
}

export const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  "ENTREGADOR": { bg: "hsl(25, 90%, 55%)", text: "hsl(0, 0%, 100%)" },
  "CLIENTE REATIVAÇÃO": { bg: "hsl(0, 0%, 20%)", text: "hsl(0, 0%, 95%)" },
  "VIP": { bg: "hsl(120, 100%, 62%)", text: "hsl(160, 10%, 6%)" },
  "LEAD QUENTE": { bg: "hsl(0, 72%, 51%)", text: "hsl(0, 0%, 100%)" },
  "ESTÉTICA": { bg: "hsl(280, 60%, 55%)", text: "hsl(0, 0%, 100%)" },
  "MANDA JÁ": { bg: "hsl(200, 80%, 55%)", text: "hsl(0, 0%, 100%)" },
  "NOVO": { bg: "hsl(160, 70%, 45%)", text: "hsl(0, 0%, 100%)" },
  "INATIVO": { bg: "hsl(160, 10%, 30%)", text: "hsl(150, 10%, 70%)" },
  "LEAD QUALIFICADO": { bg: "hsl(45, 100%, 50%)", text: "hsl(0, 0%, 10%)" },
  "WHATSAPP": { bg: "hsl(120, 100%, 62%)", text: "hsl(160, 10%, 6%)" },
  "INSTAGRAM": { bg: "hsl(340, 75%, 55%)", text: "hsl(0, 0%, 100%)" },
  "MESSENGER": { bg: "hsl(200, 80%, 55%)", text: "hsl(0, 0%, 100%)" },
  "SITE": { bg: "hsl(160, 70%, 45%)", text: "hsl(0, 0%, 100%)" },
};

const contacts: Contact[] = [
  { id: "c1", name: "Maria Souza", phone: "+55 11 98765-4321", instagram: "@mariasouza", email: "maria@email.com", empresa: "Estética Premium", opportunityValue: 2500, tags: ["VIP", "ESTÉTICA"], createdAt: new Date("2026-01-15") },
  { id: "c2", name: "João Silva", phone: "+55 21 91234-5678", instagram: "@joaosilva", email: "joao@email.com", empresa: "Manda Já Logística", opportunityValue: 8000, tags: ["ENTREGADOR", "MANDA JÁ"], createdAt: new Date("2026-01-20") },
  { id: "c3", name: "Ana Costa", phone: "+55 31 99876-5432", tags: ["CLIENTE REATIVAÇÃO"], createdAt: new Date("2026-02-01") },
  { id: "c4", name: "Carlos Oliveira", phone: "+55 11 97654-3210", instagram: "@carlosoliv", email: "carlos@manda.com", empresa: "Manda Já Logística", opportunityValue: 5000, tags: ["ENTREGADOR", "MANDA JÁ"], createdAt: new Date("2026-02-05") },
  { id: "c5", name: "Beatriz Lima", phone: "+55 21 98765-1234", email: "bia@estetica.com", empresa: "Beauty Center", opportunityValue: 1800, tags: ["ESTÉTICA", "VIP"], createdAt: new Date("2026-02-10") },
  { id: "c6", name: "Diego Ferreira", phone: "+55 41 99999-8888", tags: ["LEAD QUENTE"], opportunityValue: 3200, createdAt: new Date("2026-02-15") },
  { id: "c7", name: "Fernanda Alves", phone: "+55 11 91111-2222", instagram: "@fealves", tags: ["NOVO"], createdAt: new Date("2026-03-01") },
  { id: "c8", name: "Gustavo Mendes", phone: "+55 51 93333-4444", email: "gustavo@email.com", tags: ["INATIVO", "CLIENTE REATIVAÇÃO"], createdAt: new Date("2025-12-01") },
  { id: "c9", name: "Helena Ribeiro", phone: "+55 11 95555-6666", instagram: "@helenarib", empresa: "Manda Já Logística", opportunityValue: 12000, tags: ["VIP", "MANDA JÁ"], createdAt: new Date("2026-03-05") },
  { id: "c10", name: "Igor Nascimento", phone: "+55 21 97777-8888", tags: ["ENTREGADOR"], createdAt: new Date("2026-03-07") },
];

type Listener = () => void;
const listeners: Listener[] = [];

function notify() {
  listeners.forEach((fn) => fn());
}

export function subscribe(fn: Listener) {
  listeners.push(fn);
  return () => {
    const idx = listeners.indexOf(fn);
    if (idx >= 0) listeners.splice(idx, 1);
  };
}

export function getContacts(): Contact[] {
  return [...contacts];
}

export type ChannelOrigin = "WHATSAPP" | "INSTAGRAM" | "MESSENGER" | "SITE";

export function addContact(contact: Omit<Contact, "id" | "createdAt">, channel?: ChannelOrigin) {
  const tags = [...(contact.tags || [])];
  if (channel && !tags.includes(channel)) {
    tags.push(channel);
  }
  const newContact: Contact = {
    ...contact,
    tags,
    id: `c${Date.now()}`,
    createdAt: new Date(),
  };
  contacts.push(newContact);
  notify();
  return newContact;
}

export function addChannelTag(contactId: string, channel: ChannelOrigin) {
  const idx = contacts.findIndex((c) => c.id === contactId);
  if (idx >= 0 && !contacts[idx].tags.includes(channel)) {
    contacts[idx] = { ...contacts[idx], tags: [...contacts[idx].tags, channel] };
    notify();
    return contacts[idx];
  }
  return idx >= 0 ? contacts[idx] : undefined;
}

export function updateContact(id: string, data: Partial<Omit<Contact, "id" | "createdAt">>) {
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx >= 0) {
    contacts[idx] = { ...contacts[idx], ...data };
    notify();
    return contacts[idx];
  }
  return undefined;
}

export function findContactByPhone(phone: string): Contact | undefined {
  const clean = phone.replace(/\D/g, "");
  return contacts.find((c) => c.phone.replace(/\D/g, "").includes(clean) || clean.includes(c.phone.replace(/\D/g, "")));
}

export function findContactByName(name: string): Contact | undefined {
  return contacts.find((c) => c.name.toLowerCase().includes(name.toLowerCase()));
}

export function getAllTags(): string[] {
  const tagSet = new Set<string>();
  contacts.forEach((c) => c.tags.forEach((t) => tagSet.add(t)));
  return Array.from(tagSet).sort();
}

export function getTotalOpportunityValue(): number {
  return contacts.reduce((sum, c) => sum + (c.opportunityValue || 0), 0);
}

export function importContactsFromCSV(csvText: string): number {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return 0;
  let count = 0;
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((s) => s.trim());
    if (cols.length >= 2 && cols[0] && cols[1]) {
      addContact({
        name: cols[0],
        phone: cols[1],
        instagram: cols[2] || undefined,
        email: cols[3] || undefined,
        tags: cols[4] ? cols[4].split(";").map((t) => t.trim().toUpperCase()) : [],
      });
      count++;
    }
  }
  return count;
}

export function exportContactsToCSV(): string {
  const header = "Nome,Telefone,Instagram,Email,Empresa,Oportunidade,Etiquetas";
  const rows = contacts.map(
    (c) => `${c.name},${c.phone},${c.instagram || ""},${c.email || ""},${c.empresa || ""},${c.opportunityValue || ""},${c.tags.join(";")}`
  );
  return [header, ...rows].join("\n");
}
