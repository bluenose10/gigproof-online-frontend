import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSolution from "@/components/landing/ProblemSolution";
import PlaidExplainer from "@/components/landing/PlaidExplainer";
import HowItWorks from "@/components/landing/HowItWorks";
import LenderSection from "@/components/landing/LenderSection";
import FAQ from "@/components/landing/FAQ";

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProblemSolution />
        <PlaidExplainer />
        <HowItWorks />
        <LenderSection />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
