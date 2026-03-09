import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Agentes from "./pages/Agentes";
import AgentConfig from "./pages/AgentConfig";
import Integracoes from "./pages/Integracoes";
import Leads from "./pages/Leads";
import Faturamento from "./pages/Faturamento";
import Atendimento from "./pages/Atendimento";
import Envios from "./pages/Envios";
import ModelosMensagem from "./pages/ModelosMensagem";
import Relatorios from "./pages/Relatorios";
import Contatos from "./pages/Contatos";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" storageKey="verbia-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/agentes" element={<Agentes />} />
              <Route path="/agentes/novo" element={<AgentConfig />} />
              <Route path="/agentes/:id" element={<AgentConfig />} />
              <Route path="/atendimento" element={<Atendimento />} />
              <Route path="/integracoes" element={<Integracoes />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/faturamento" element={<Faturamento />} />
              <Route path="/envios" element={<Envios />} />
              <Route path="/modelos" element={<ModelosMensagem />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/contatos" element={<Contatos />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
