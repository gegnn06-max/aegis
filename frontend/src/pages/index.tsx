import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DatasetPanel from "@/components/DatasetPanel";
import ModelDashboard from "@/components/ModelDashboard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <div id="hero">
          <HeroSection />
        </div>
        <div id="datasets">
          <DatasetPanel />
        </div>
        <div id="performance">
          <ModelDashboard />
        </div>
      </main>
    </div>
  );
};

export default Index;
