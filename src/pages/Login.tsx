import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Zap, Eye, EyeOff, Loader2, ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "forgot";

export default function Login() {
  const { session, loading, signIn } = useAuth();
  const { toast } = useToast();

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  if (!loading && session) {
    return <Navigate to="/" replace />;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao entrar",
        description: "E-mail ou senha incorretos. Verifique e tente novamente.",
      });
    }
    setSubmitting(false);
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar e-mail",
        description: error.message,
      });
    } else {
      setResetSent(true);
    }
    setSubmitting(false);
  }

  function goBackToLogin() {
    setMode("login");
    setResetSent(false);
    setPassword("");
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="h-8 w-8 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold neon-text">VerbIA</h1>
            <p className="text-muted-foreground text-sm mt-1">Agentes Inteligentes</p>
          </div>
        </div>

        <div className="glass-card rounded-xl p-8 border border-border space-y-6">
          {mode === "forgot" ? (
            resetSent ? (
              <div className="flex flex-col items-center gap-4 py-4 text-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">E-mail enviado!</h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Verifique sua caixa de entrada em <span className="text-foreground font-medium">{email}</span> e clique no link para redefinir sua senha.
                  </p>
                </div>
                <Button variant="ghost" className="gap-2 mt-2" onClick={goBackToLogin}>
                  <ArrowLeft className="h-4 w-4" />
                  Voltar ao login
                </Button>
              </div>
            ) : (
              <>
                <div>
                  <button
                    onClick={goBackToLogin}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Voltar
                  </button>
                  <h2 className="text-xl font-semibold text-foreground">Recuperar senha</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Informe seu e-mail e enviaremos um link para redefinir sua senha.
                  </p>
                </div>
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">E-mail</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      disabled={submitting}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={submitting || !email}>
                    {submitting ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Enviando...</>
                    ) : (
                      "Enviar link de recuperação"
                    )}
                  </Button>
                </form>
              </>
            )
          ) : (
            <>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Entrar na plataforma</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Acesse com seu e-mail e senha corporativos
                </p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Senha</Label>
                    <button
                      type="button"
                      onClick={() => setMode("forgot")}
                      className="text-xs text-primary hover:text-primary/80 transition-colors"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      disabled={submitting}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={submitting || !email || !password}>
                  {submitting ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Entrando...</>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Problemas para acessar? Fale com o administrador da sua conta.
        </p>
      </div>
    </div>
  );
}
