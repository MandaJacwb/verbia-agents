

# Página de Configurações da Conta

## Resumo
Criar a página `/configuracoes` com menu lateral interno (Conta, Horário de Atendimento, Canais de Atendimento), formulários de dados da empresa, contato e endereço, validação de CNPJ e store de estado da conta.

## Implementação

### 1. Criar `src/lib/accountStore.ts`
Store com dados da empresa (nome, tipo, razão social, CNPJ, administrador, situação), contato (email, telefone), endereço (CEP, rua). Função `isAccountActive()` que verifica se CNPJ está preenchido e situação é "Ativa". Exportar getter/setter para persistência em memória.

### 2. Criar `src/pages/Configuracoes.tsx`
Página com layout de duas colunas:

- **Menu lateral esquerdo** (nav interno com 3 opções): Conta, Horário de Atendimento, Canais de Atendimento — usando estado local para alternar seções
- **Área de conteúdo à direita** com 3 seções na aba "Conta":
  - **Dados da Empresa:** Nome (input), Tipo da empresa (Select/dropdown), Razão Social (input), CNPJ (input com máscara), Administrador (input), Situação (badge Ativa/Inativa)
  - **Dados para Contato:** Email e Telefone com ícones (Mail, Phone)
  - **Endereço:** CEP e Rua
- Botão "Salvar Alterações" com validação de CNPJ (formato XX.XXX.XXX/XXXX-XX) e toast de feedback
- Seções "Horário de Atendimento" e "Canais de Atendimento" como placeholders iniciais

**Design:** glass-card, neon-border, responsivo a Light/Dark Mode

### 3. Validação de CNPJ
Ao salvar, validar formato do CNPJ. Se válido e situação "Ativa", liberar agentes. Exportar `isAccountActive()` do store para uso no Dashboard.

### 4. Atualizar `src/App.tsx`
Adicionar rota `/configuracoes` com import do novo componente.

### 5. Atualizar `src/components/AppSidebar.tsx`
Adicionar item "Configurações" (ícone `Settings`) no menu, visível para `admin_conta`.

## Arquivos
- `src/lib/accountStore.ts` (novo)
- `src/pages/Configuracoes.tsx` (novo)
- `src/App.tsx` — nova rota
- `src/components/AppSidebar.tsx` — novo item de menu

