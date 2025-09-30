import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Network, Brain, Shield } from "lucide-react";
import heroImage from "@/assets/hero-graph.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Graph Neural Network visualization showing interconnected nodes for fraud detection"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/50 to-background/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
          <Network className="mr-2 h-4 w-4" />
          Graph Edge-Enhanced Neural Networks
        </Badge>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
          GE-GNN Fraud Detection
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
          Revolutionary Graph Neural Network that detects fraudulent reviews by analyzing both 
          <span className="text-primary font-semibold"> node features</span> and 
          <span className="text-accent font-semibold"> edge relationships</span> with 
          attention-based gating mechanisms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button variant="hero" size="lg" className="text-lg px-8 py-4">
            <Brain className="mr-2 h-5 w-5" />
            Launch Analysis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-4">
            <Shield className="mr-2 h-5 w-5" />
            View Performance
          </Button>
        </div>

        {/* Key Innovation Points */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-gradient-card p-6 rounded-xl border border-primary/20 shadow-card">
            <Network className="h-8 w-8 text-primary mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">Edge Augmentation</h3>
            <p className="text-muted-foreground text-sm">
              Combines node and edge features for richer relationship modeling
            </p>
          </div>
          
          <div className="bg-gradient-card p-6 rounded-xl border border-accent/20 shadow-card">
            <Brain className="h-8 w-8 text-accent mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">Attention Mechanism</h3>
            <p className="text-muted-foreground text-sm">
              Identifies most important neighbors and relationships
            </p>
          </div>
          
          <div className="bg-gradient-card p-6 rounded-xl border border-primary/20 shadow-card">
            <Shield className="h-8 w-8 text-primary mb-3 mx-auto" />
            <h3 className="text-lg font-semibold mb-2">Gating Control</h3>
            <p className="text-muted-foreground text-sm">
              Balances edge vs. node information for optimal detection
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;