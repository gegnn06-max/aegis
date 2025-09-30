import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Settings, BarChart3, Target, TrendingUp, Zap, Upload, AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { api } from "@/lib/api";

const ModelDashboard = () => {
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<null | {
    predictions: number[];
    fraud_rate: number;
    total_reviews: number;
    fraud_detected: number;
    status: string;
  }>(null);

  const handlePredict = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setPredicting(true);
      setError(null);
      const result = await api.predict(file);
      setPrediction(result);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setPredicting(false);
    }
  }, []);

  return (
    <section className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Model Performance</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Review fraud detection using graph neural networks
          </p>
        </div>

        <div className="flex gap-4 justify-center mb-6">
          <input
            type="file"
            accept=".csv"
            onChange={handlePredict}
            className="hidden"
            id="predict-upload"
            disabled={predicting}
          />
          <label htmlFor="predict-upload">
            <Button variant="hero" size="lg" disabled={predicting} asChild>
              <span>
                <Upload className="mr-2 h-5 w-5" />
                {predicting ? 'Processing...' : 'Upload Reviews for Analysis'}
              </span>
            </Button>
          </label>
          <Button variant="outline" size="lg" disabled={predicting}>
            <Settings className="mr-2 h-5 w-5" />
            Modify Config
          </Button>
        </div>

        {prediction && (
          <Card className="bg-gradient-card border-primary/20 shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Analysis Results
              </CardTitle>
              <CardDescription>
                Fraud detection results from the uploaded reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Reviews Analyzed</span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {prediction.total_reviews}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fraudulent Reviews Detected</span>
                  <Badge variant="destructive">
                    {prediction.fraud_detected}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Legitimate Reviews</span>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    {prediction.total_reviews - prediction.fraud_detected}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fraud Rate</span>
                  <Badge variant="destructive">
                    {(prediction.fraud_rate * 100).toFixed(1)}%
                  </Badge>
                </div>
                {prediction.status === 'success' && (
                  <div>
                    <Progress 
                      value={(1 - prediction.fraud_rate) * 100} 
                      className="h-2" 
                    />
                    <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                      <span>Legitimate</span>
                      <span>Fraudulent</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mt-4 text-sm text-destructive flex items-center gap-2 justify-center">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </section>
  );
};

export default ModelDashboard;