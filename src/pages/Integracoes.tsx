import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { MessageCircle, Instagram, Facebook, Webhook, CheckCircle2, XCircle } from "lucide-react";

const channels = [
  {
    id: "whatsapp",
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-400",
    connected: true,
    config: { phone: "+55 11 99999-0000" },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-400",
    connected: false,
    config: {},
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-400",
    connected: true,
    config: { page: "Manda Já Logística" },
  },
  {
    id: "n8n",
    name: "n8n",
    icon: Webhook,
    color: "text-orange-400",
    connected: true,
    config: { webhook: "https://n8n.mandaja.com/webhook/sdr" },
  },
];

const Integracoes = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display">Integrações</h1>
        <p className="text-muted-foreground mt-1">Conecte seus canais de comunicação</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((ch) => (
          <Card key={ch.id} className="glass-card neon-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <ch.icon className={`h-5 w-5 ${ch.color}`} />
                  {ch.name}
                </CardTitle>
                <Badge
                  variant={ch.connected ? "default" : "secondary"}
                  className="gap-1"
                >
                  {ch.connected ? (
                    <><CheckCircle2 className="h-3 w-3" /> Conectado</>
                  ) : (
                    <><XCircle className="h-3 w-3" /> Desconectado</>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {ch.id === "whatsapp" && (
                <div>
                  <Label>Número</Label>
                  <Input defaultValue={ch.config.phone} className="mt-1.5 bg-background/50" />
                </div>
              )}
              {ch.id === "instagram" && (
                <div>
                  <Label>Token de Acesso</Label>
                  <Input type="password" placeholder="Cole seu token aqui" className="mt-1.5 bg-background/50" />
                </div>
              )}
              {ch.id === "facebook" && (
                <div>
                  <Label>Página</Label>
                  <Input defaultValue={ch.config.page} className="mt-1.5 bg-background/50" />
                </div>
              )}
              {ch.id === "n8n" && (
                <div>
                  <Label>Webhook URL</Label>
                  <Input defaultValue={ch.config.webhook} className="mt-1.5 bg-background/50" />
                </div>
              )}
              <Button variant={ch.connected ? "outline" : "default"} className="w-full">
                {ch.connected ? "Reconectar" : "Conectar"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Integracoes;
