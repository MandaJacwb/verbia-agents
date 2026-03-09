

# Landing Page de Alta Conversão — VerbiA

## Resumo
Criar uma landing page pública em `/landing` (rota fora do `AppLayout`) com hero section, widget de chat IA, seção de planos e fluxo de checkout simulado.

## Implementação

### 1. Criar `src/pages/Landing.tsx`
Página completa com as seguintes seções:

- **Hero Section:** Fundo dark com gradientes sutis, logo VerbiA (ícone Zap + texto neon), headline "Escale sua operação com Agentes de IA", subtítulo sobre automação de atendimento, botão CTA "Escalar Minha Operação" que faz scroll até a seção de planos. Elementos visuais de fundo com gráficos estilizados (SVG de linhas de crescimento ascendente e pontos de calor usando gradientes radiais).

- **Seção de Analytics Visual:** Grid com métricas animadas (contadores) e um mini gráfico de área (Recharts) mostrando crescimento, reforçando a ideia de analytics avançado. Uso de gradientes e efeitos de "mapa de calor" via divs com gradientes radiais coloridos.

- **Widget de Chat IA:** Card flutuante fixo no canto inferior direito com:
  - Botão de toggle (ícone Bot) para abrir/fechar
  - Área de mensagens com scroll
  - Input de texto para perguntas
  - Respostas pré-programadas para FAQs (sem integração real de IA por ora)
  - Lógica: se o usuário mencionar palavras-chave de interesse (preço, comprar, contratar, plano), exibir badge "Lead Quente 🔥" na interface do chat e destacar visualmente

- **Seção de Planos:** 3 cards (Starter, Profissional, Enterprise) baseados nos dados de Faturamento:
  - **Starter:** R$ 197/mês, 3 agentes, 2.000 conversas, 3.000 créditos IA
  - **Profissional:** R$ 497/mês (destacado), 10 agentes, 5.000 conversas, 10.000 créditos IA — badge "Mais Popular"
  - **Enterprise:** R$ 997/mês, agentes ilimitados, conversas ilimitadas, 50.000 créditos IA
  - Cada card com botão "Começar Agora" / "Comprar"

- **Fluxo de Checkout:** Ao clicar "Comprar", abre um Dialog/modal simulando checkout (nome, email, cartão placeholder). Ao confirmar, redireciona para `/configuracoes` via `useNavigate`.

- **Footer:** Links institucionais simples e copyright.

### 2. Atualizar `src/App.tsx`
Adicionar rota `/landing` fora do `<Route element={<AppLayout />}>` (sem sidebar/header).

### 3. Design e Estética
- Sempre dark por padrão na landing (classe `dark` forçada ou uso dos tokens dark)
- Elementos visuais: gradientes radiais simulando mapas de calor, linhas SVG de crescimento, partículas/pontos luminosos via CSS
- Animações suaves com `transition` e `animate-pulse-neon`
- Responsivo mobile-first

## Arquivos
- `src/pages/Landing.tsx` (novo) — página completa
- `src/App.tsx` — nova rota `/landing`

