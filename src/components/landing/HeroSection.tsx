import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

interface HeroSectionProps {
  onScrollToPlans: () => void;
}

const HeroSection = ({ onScrollToPlans }: HeroSectionProps) => (
  <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
    {/* Heatmap radial gradients */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary opacity-[0.06] blur-[120px]" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-[hsl(160,70%,45%)] opacity-[0.05] blur-[100px]" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full bg-[hsl(45,100%,60%)] opacity-[0.04] blur-[80px]" />
    </div>

    {/* Growth SVG lines */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.08]" preserveAspectRatio="none" viewBox="0 0 1200 800">
      <motion.path
        d="M0 700 Q200 650 400 500 T800 300 T1200 100"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.path
        d="M0 750 Q300 700 500 550 T900 350 T1200 200"
        stroke="hsl(160,70%,45%)"
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
      />
      <motion.path
        d="M0 780 Q250 730 450 600 T850 400 T1200 280"
        stroke="hsl(45,100%,60%)"
        strokeWidth="1"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.6 }}
      />
    </svg>

    {/* Floating particles */}
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-primary/40"
        style={{
          top: `${20 + i * 12}%`,
          left: `${10 + i * 15}%`,
        }}
        animate={{
          y: [-20, 20, -20],
          opacity: [0.2, 0.6, 0.2],
        }}
        transition={{
          duration: 3 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4,
        }}
      />
    ))}

    <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
      {/* Logo */}
      <motion.div
        className="flex items-center justify-center gap-3 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_30px_hsl(var(--primary)/0.2)]">
          <Zap className="h-8 w-8 text-primary" />
        </div>
        <span className="text-3xl font-bold font-display text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
          VerbiA
        </span>
      </motion.div>

      <motion.h1
        className="text-4xl sm:text-6xl lg:text-7xl font-bold font-display leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        Escale sua operação com{" "}
        <span className="text-primary drop-shadow-[0_0_20px_hsl(var(--primary)/0.4)]">
          Agentes de IA
        </span>
      </motion.h1>

      <motion.p
        className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        Automatize atendimento, qualifique leads e converta mais clientes 24/7.
        Inteligência artificial que trabalha enquanto você dorme.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Button
          onClick={onScrollToPlans}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 font-bold shadow-[0_0_40px_hsl(var(--primary)/0.3)] transition-all hover:shadow-[0_0_60px_hsl(var(--primary)/0.5)]"
        >
          <Zap className="h-5 w-5 mr-2" />
          Escalar Minha Operação
        </Button>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
