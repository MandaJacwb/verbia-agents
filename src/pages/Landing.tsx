import { useState, useRef } from "react";
import HeroSection from "@/components/landing/HeroSection";
import AnalyticsSection from "@/components/landing/AnalyticsSection";
import PlansSection from "@/components/landing/PlansSection";
import ChatWidget from "@/components/landing/ChatWidget";
import CheckoutDialog from "@/components/landing/CheckoutDialog";
import LandingFooter from "@/components/landing/LandingFooter";

const Landing = () => {
  const plansRef = useRef<HTMLDivElement>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  const scrollToPlans = () => {
    plansRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBuy = (planName: string) => {
    setSelectedPlan(planName);
    setCheckoutOpen(true);
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground overflow-x-hidden">
      <HeroSection onScrollToPlans={scrollToPlans} />
      <AnalyticsSection />
      <PlansSection sectionRef={plansRef} onBuy={handleBuy} />
      <LandingFooter />
      <ChatWidget />
      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} planName={selectedPlan} />
    </div>
  );
};

export default Landing;
