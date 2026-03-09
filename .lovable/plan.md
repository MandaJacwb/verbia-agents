

# Sistema de Alternância de Temas (Light/Dark Mode)

## Implementação

### 1. `src/index.css` — Adicionar tokens Light Mode

Mover os valores atuais para `.dark` e criar novos valores `:root` para o modo claro:

- **Light:** Fundo branco/cinza claro, textos escuros, primary verde mantido, cards brancos, borders cinza suave, sidebar clara
- **Dark:** Exatamente os valores atuais (fundo escuro, verde neon, glass-card)
- Chart colors adaptados para ambos os modos

### 2. `src/App.tsx` — Wrapper ThemeProvider

Usar `next-themes` (já instalado) para envolver a app com `<ThemeProvider>`:
- `attribute="class"`, `defaultTheme="dark"`, `storageKey="verbia-theme"` (persiste no localStorage automaticamente)

### 3. `src/components/AppLayout.tsx` — Botão Toggle

Adicionar botão Sun/Moon no header (ao lado do sino):
- Importar `useTheme` de `next-themes`
- Ícone `Sun` quando dark, `Moon` quando light
- `onClick` alterna entre `"light"` e `"dark"`

### 4. `src/pages/Index.tsx` e `src/pages/Relatorios.tsx` — Gráficos adaptáveis

Substituir cores hardcoded nos gráficos (CartesianGrid stroke, XAxis/YAxis stroke, Tooltip contentStyle) por variáveis CSS via `getComputedStyle` ou usar classes CSS que respondem ao tema. Abordagem: criar um hook `useChartColors()` que retorna as cores corretas baseado no tema atual.

### 5. `tailwind.config.ts` — Habilitar darkMode

Já configurado com `darkMode: ["class"]` — sem alterações necessárias.

## Arquivos editados
- `src/index.css` — Light tokens + mover dark para `.dark`
- `src/App.tsx` — ThemeProvider wrapper
- `src/components/AppLayout.tsx` — Toggle button
- `src/hooks/useChartColors.ts` (novo) — Hook para cores de gráficos
- `src/pages/Index.tsx` — Usar hook de cores
- `src/pages/Relatorios.tsx` — Usar hook de cores

