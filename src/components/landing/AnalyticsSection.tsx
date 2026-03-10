import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, MessageSquare, BarChart3 } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis } from "recharts";

const growthData = [
  { m: "Jan", v: 120 }, { m: "Fev", v: 210 }, { m: "Mar", v: 380 },
  { m: "Abr", v: 520 }, { m: "Mai", v: 710 }, { m: "Jun", v: 950 },
  { m: "Jul", v: 1340 }, { m: "Ago", v: 1800 },
];

const metrics = [
  { icon: TrendingUp, label: "Conversões", value: 340, suffix: "%", prefix: "+", color: "hsl(var(--primary))" },
  { icon: Users, label: "Leads qualificados", value: 12400, suffix: "", prefix: "", color: "hsl(160,70%,45%)" },
  { icon: MessageSquare, label: "Atendimentos/mês", value: 48000, suffix: "", prefix: "", color: "hsl(45,100%,60%)" },
  { icon: BarChart3, label: "Tempo de resposta", value: 2, suffix: "s", prefix: "<", color: "hsl(200,80%,55%)" },
];

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(".0", "") + "k";
  return n.toString();
}

function AnimatedCounter({ value, prefix, suffix, color }: { value: number; prefix: string; suffix: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-2xl sm:text-3xl font-bold font-display" style={{ color }}>
      {prefix}{formatNumber(count)}{suffix}
    </div>
  );
}

const AnalyticsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="py-20 px-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-primary opacity-[0.03] blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-3xl sm:text-4xl font-bold font-display text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Analytics que <span className="text-primary">impulsionam</span> resultados
        </motion.h2>
        <motion.p
          className="text-center text-muted-foreground mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Dados em tempo real para decisões estratégicas
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * i }}
            >
              <Card className="bg-card/80 border-border backdrop-blur-sm">
                <CardContent className="p-5 text-center space-y-2">
                  <m.icon className="h-6 w-6 mx-auto" style={{ color: m.color }} />
                  <AnimatedCounter value={m.value} prefix={m.prefix} suffix={m.suffix} color={m.color} />
                  <p className="text-xs sm:text-sm text-muted-foreground">{m.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-card/80 border-border backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-primary" />
                <span className="font-display font-semibold">Crescimento de conversões</span>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData}>
                    <defs>
                      <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                    <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fill="url(#growthGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
