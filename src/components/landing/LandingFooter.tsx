import { Zap } from "lucide-react";

const LandingFooter = () => (
  <footer className="border-t border-border py-10 px-4">
    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-primary" />
        <span className="font-display font-bold text-primary">VerbiA</span>
      </div>
      <div className="flex gap-6 text-sm text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer transition-colors">Termos</span>
        <span className="hover:text-foreground cursor-pointer transition-colors">Privacidade</span>
        <span className="hover:text-foreground cursor-pointer transition-colors">Contato</span>
      </div>
      <p className="text-xs text-muted-foreground">© 2026 VerbiA. Todos os direitos reservados.</p>
    </div>
  </footer>
);

export default LandingFooter;
