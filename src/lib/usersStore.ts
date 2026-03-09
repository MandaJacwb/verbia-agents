export type UserRole = "admin_conta" | "admin" | "atendente";

export interface AppUser {
  id: string;
  name: string;
  login: string;
  role: UserRole;
  avatar?: string;
}

const ROLE_LABELS: Record<UserRole, string> = {
  admin_conta: "Administrador da Conta",
  admin: "Administrador",
  atendente: "Atendente",
};

const PLAN_USER_LIMIT = 5;

let users: AppUser[] = [
  { id: "1", name: "Victor Moura", login: "victor@verbia.ai", role: "admin_conta" },
  { id: "2", name: "Ana Silva", login: "ana@verbia.ai", role: "admin" },
  { id: "3", name: "Carlos Mendes", login: "carlos@verbia.ai", role: "atendente" },
  { id: "4", name: "Fernanda Lima", login: "fernanda@verbia.ai", role: "atendente" },
  { id: "5", name: "Rafael Costa", login: "rafael@verbia.ai", role: "admin" },
];

// Simulated current user — change to test different roles
let currentUserId = "1";

export function getUsers(): AppUser[] {
  return [...users];
}

export function getCurrentUser(): AppUser {
  return users.find((u) => u.id === currentUserId)!;
}

export function setCurrentUserId(id: string) {
  currentUserId = id;
}

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function getPlanUserLimit(): number {
  return PLAN_USER_LIMIT;
}

export function addUser(user: Omit<AppUser, "id">): AppUser {
  const newUser: AppUser = { ...user, id: crypto.randomUUID() };
  users = [...users, newUser];
  return newUser;
}

export function removeUser(id: string) {
  users = users.filter((u) => u.id !== id);
}

export function updateUser(id: string, data: Partial<Omit<AppUser, "id">>) {
  users = users.map((u) => (u.id === id ? { ...u, ...data } : u));
}
