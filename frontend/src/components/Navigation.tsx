import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Network, Github, FileText, Settings } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Network className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                GE-GNN
              </span>
            </div>
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              v1.0
            </Badge>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="#hero" className="text-foreground hover:text-primary transition-colors">
              Overview
            </a>
            <a href="#datasets" className="text-muted-foreground hover:text-primary transition-colors">
              Datasets
            </a>
            <a href="#performance" className="text-muted-foreground hover:text-primary transition-colors">
              Performance
            </a>
            <a href="#docs" className="text-muted-foreground hover:text-primary transition-colors">
              Documentation
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;