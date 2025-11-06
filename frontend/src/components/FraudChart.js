import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PieChart, BarChart3, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

const FraudChart = ({ results }) => {
  const fraudCount = results.filter(r => r.label === 'Fraud').length;
  const benignCount = results.filter(r => r.label === 'Benign').length;
  const total = results.length;
  
  const fraudPercentage = total > 0 ? (fraudCount / total) * 100 : 0;
  const benignPercentage = total > 0 ? (benignCount / total) * 100 : 0;

  const avgConfidence = total > 0
    ? (results.reduce((sum, r) => sum + r.confidence, 0) / total)
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            <span>Detection Summary</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Distribution of fraud vs benign reviews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="relative pt-4">
              <div className="flex justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-slate-300">Fraud</span>
                </div>
                <span className="text-sm font-bold text-red-400">{fraudCount} ({fraudPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-1000 ease-out"
                  style={{ width: `${fraudPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="relative">
              <div className="flex justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-slate-300">Benign</span>
                </div>
                <span className="text-sm font-bold text-green-400">{benignCount} ({benignPercentage.toFixed(1)}%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-600 to-green-500 transition-all duration-1000 ease-out"
                  style={{ width: `${benignPercentage}%` }}
                ></div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Total Reviews</span>
                <span className="text-2xl font-bold text-white">{total}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Model Performance</span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            Classification confidence metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-400">Average Confidence</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">
                {(avgConfidence * 100).toFixed(1)}%
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden mt-3">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ease-out"
                  style={{ width: `${avgConfidence * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-red-950/20 border border-red-900/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <span className="text-xs text-red-400 font-medium">Fraud Rate</span>
                </div>
                <div className="text-2xl font-bold text-red-400">
                  {fraudPercentage.toFixed(1)}%
                </div>
              </div>

              <div className="bg-green-950/20 border border-green-900/50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">Benign Rate</span>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {benignPercentage.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudChart;
