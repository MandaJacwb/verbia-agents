import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Agentes from "./pages/Agentes";
import AgentConfig from "./pages/AgentConfig";
import Integracoes from "./pages/Integracoes";
import Leads from "./pages/Leads";
import Faturamento from "./pages/Faturamento";
import Atendimento from "./pages/Atendimento";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/integracoes" element={<Integracoes />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/faturamento" element={<Faturamento />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
