import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Upload, Database, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { api } from "@/lib/api";

const DatasetPanel = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setUploadError(null);
      await api.uploadDataset(file);
      // TODO: Add success toast notification
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload dataset');
    } finally {
      setUploading(false);
    }
  }, []);

  const datasets = [
    {
      name: "YelpChi",
      description: "Chicago restaurant reviews with fraud labels",
      size: "45,954 reviews",
      nodes: "67,395 nodes",
      edges: "3,846,979 edges",
      fraudRate: "13.2%",
      status: "loaded",
      progress: 100
    },
    {
      name: "Amazon",
      description: "Product reviews across multiple categories",
      size: "1,689,188 reviews", 
      nodes: "1,780,351 nodes",
      edges: "11,944,429 edges",
      fraudRate: "21.8%",
      status: "loaded",
      progress: 100
    }
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Dataset Management</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            YelpChi and Amazon review datasets with pre-computed graph structures
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {datasets.map((dataset) => (
            <Card key={dataset.name} className="bg-gradient-card border-primary/20 shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-primary" />
                    {dataset.name}
                  </CardTitle>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {dataset.status}
                  </Badge>
                </div>
                <CardDescription>{dataset.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Reviews:</span>
                    <p className="font-semibold">{dataset.size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nodes:</span>
                    <p className="font-semibold">{dataset.nodes}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Edges:</span>
                    <p className="font-semibold">{dataset.edges}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Fraud Rate:</span>
                    <p className="font-semibold text-destructive">{dataset.fraudRate}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Processing Status</span>
                    <span>{dataset.progress}%</span>
                  </div>
                  <Progress value={dataset.progress} className="h-2" />
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="graph" size="sm" className="flex-1">
                    <Database className="mr-2 h-4 w-4" />
                    Graph Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-card border-dashed border-primary/30">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Upload Custom Dataset</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Upload your own review dataset in CSV format with user, product, and review features
            </p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="dataset-upload"
              disabled={uploading}
            />
            <label htmlFor="dataset-upload">
              <Button variant="outline" disabled={uploading} asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Select File'}
                </span>
              </Button>
            </label>
            {uploadError && (
              <div className="mt-4 text-sm text-destructive flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {uploadError}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DatasetPanel;