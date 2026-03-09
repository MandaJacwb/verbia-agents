export interface AccountData {
  nome: string;
  tipo: string;
  razaoSocial: string;
  cnpj: string;
  administrador: string;
  situacao: "Ativa" | "Inativa";
  email: string;
  telefone: string;
  cep: string;
  rua: string;
}

let accountData: AccountData = {
  nome: "VerbIA Tecnologia",
  tipo: "Tecnologia",
  razaoSocial: "VerbIA Tecnologia LTDA",
  cnpj: "",
  administrador: "Victor Moura",
  situacao: "Inativa",
  email: "contato@verbia.ai",
  telefone: "(11) 99999-9999",
  cep: "",
  rua: "",
};

export function getAccountData(): AccountData {
  return { ...accountData };
}

export function setAccountData(data: Partial<AccountData>) {
  accountData = { ...accountData, ...data };
}

export function formatCNPJ(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, "");
  return digits.length === 14;
}

export function isAccountActive(): boolean {
  return validateCNPJ(accountData.cnpj) && accountData.situacao === "Ativa";
}
