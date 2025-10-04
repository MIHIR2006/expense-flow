import Navigation from "@/components/sections/navigation";
import HeroSection from "@/components/sections/hero";
import FeaturesSection from "@/components/sections/features";
import HowItWorksSection from "@/components/sections/how-it-works";
import TestimonialsSection from "@/components/sections/testimonials";
import PricingSection from "@/components/sections/pricing";
import IntegrationsSection from "@/components/sections/integrations";
import StatsSection from "@/components/sections/stats";
import FAQSection from "@/components/sections/faq";
import CTASection from "@/components/sections/cta";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <IntegrationsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  );
}
