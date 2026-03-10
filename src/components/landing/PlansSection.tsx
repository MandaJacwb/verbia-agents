import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "197",
    highlight: false,
    features: ["3 Agentes de IA", "2.000 conversas/mês", "3.000 créditos IA", "Suporte por email", "Relatórios básicos"],
  },
  {
    name: "Profissional",
    price: "497",
    highlight: true,
    features: ["10 Agentes de IA", "5.000 conversas/mês", "10.000 créditos IA", "Suporte prioritário", "Analytics avançado", "Integrações ilimitadas"],
  },
  {
    name: "Enterprise",
    price: "997",
    highlight: false,
    features: ["Agentes ilimitados", "Conversas ilimitadas", "50.000 créditos IA", "Gerente dedicado", "SLA garantido", "API personalizada"],
  },
];

interface PlansSectionProps {
  sectionRef: React.RefObject<HTMLDivElement>;
  onBuy: (planName: string) => void;
}

const PlansSection = ({ sectionRef, onBuy }: PlansSectionProps) => {
  const internalRef = useRef<HTMLElement>(null);
  const isInView = useInView(internalRef, { once: true, margin: "-100px" });

  return (
    <section ref={(el) => {
      (internalRef as React.MutableRefObject<HTMLElement | null>).current = el;
      if (sectionRef && 'current' in sectionRef) {
        (sectionRef as React.MutableRefObject<HTMLDivElement | null>).current = el as unknown as HTMLDivElement;
      }
    }} id="planos" className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(160,70%,45%)] opacity-[0.03] blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold font-display text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Escolha seu <span className="text-primary">plano</span>
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Escale conforme sua necessidade
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 * i }}
            >
              <Card
                className={`relative bg-card/80 backdrop-blur-sm transition-all hover:scale-[1.02] ${
                  plan.highlight
                    ? "border-primary/50 shadow-[0_0_30px_hsl(var(--primary)/0.15)]"
                    : "border-border"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground font-bold px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2 pt-8">
                  <CardTitle className="font-display text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold font-display text-primary">R$ {plan.price}</span>
                    <span className="text-muted-foreground">/mês</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => onBuy(plan.name)}
                    className={`w-full font-bold ${
                      plan.highlight
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_20px_hsl(var(--primary)/0.3)]"
                        : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                    }`}
                  >
                    Começar Agora
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlansSection;
