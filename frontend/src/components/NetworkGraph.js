import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Network, Zap, ZoomIn, ZoomOut, RotateCcw, MousePointer } from 'lucide-react';
import { Button } from './ui/button';

const NetworkGraph = ({ graphData }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState([]);
  const [isSimulating, setIsSimulating] = useState(true);

  // Debug logging
  console.log('NetworkGraph render:', { graphData, nodes: nodes.length });

  useEffect(() => {
    if (!canvasRef.current || !graphData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Initialize node positions with better layout
    const initialNodes = graphData.nodes.map((node, i) => {
      const angle = (i / graphData.nodes.length) * 2 * Math.PI;
      const radius = node.group === 'user' ? 150 : 250;
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
        y: height / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 50,
        vx: 0,
        vy: 0,
        fx: null,
        fy: null
      };
    });

    console.log('Initializing nodes:', initialNodes.length);
    setNodes(initialNodes);
  }, [graphData]);

  useEffect(() => {
    if (!canvasRef.current || !graphData || nodes.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Enhanced force simulation
    const simulate = () => {
      if (!isSimulating) return;
      
      // Apply forces
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        
        // Skip fixed nodes
        if (node.fx !== null || node.fy !== null) continue;
        
        // Center force (weaker)
        const centerForce = 0.005;
        node.vx += (width / 2 - node.x) * centerForce;
        node.vy += (height / 2 - node.y) * centerForce;

        // Repulsion between nodes (stronger)
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const other = nodes[j];
          const dx = node.x - other.x;
          const dy = node.y - other.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 800 / (dist * dist);
          node.vx += (dx / dist) * force;
          node.vy += (dy / dist) * force;
        }

        // Edge attraction (stronger)
        graphData.edges.forEach(edge => {
          if (edge.source === node.id) {
            const target = nodes.find(n => n.id === edge.target);
            if (target) {
              const dx = target.x - node.x;
              const dy = target.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = 0.01 * (dist - 100); // Ideal distance of 100px
              node.vx += (dx / dist) * force;
              node.vy += (dy / dist) * force;
            }
          }
          if (edge.target === node.id) {
            const source = nodes.find(n => n.id === edge.source);
            if (source) {
              const dx = source.x - node.x;
              const dy = source.y - node.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const force = 0.01 * (dist - 100);
              node.vx += (dx / dist) * force;
              node.vy += (dy / dist) * force;
            }
          }
        });

        // Damping
        node.vx *= 0.85;
        node.vy *= 0.85;
      }

      // Update positions
      const newNodes = nodes.map(node => ({
        ...node,
        x: node.fx !== null ? node.fx : node.x + node.vx,
        y: node.fy !== null ? node.fy : node.y + node.vy
      }));
      
      setNodes(newNodes);
    };

    // Render function
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      // Draw edges with simple styling
      graphData.edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
          ctx.beginPath();
          ctx.moveTo(source.x, source.y);
          ctx.lineTo(target.x, target.y);
          
          if (edge.relationship === 'similar') {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
          } else {
            ctx.strokeStyle = 'rgba(100, 116, 139, 0.4)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([]);
          }
          ctx.stroke();
        }
      });

      // Draw nodes with better styling
      nodes.forEach(node => {
        const radius = node.group === 'user' ? 10 : 14;
        let color;
        
        if (node.group === 'fraud') {
          color = '#ef4444';
        } else if (node.group === 'benign') {
          color = '#10b981';
        } else {
          color = '#3b82f6';
        }

        // Node shadow
        ctx.beginPath();
        ctx.arc(node.x + 2, node.y + 2, radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Node border
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Confidence ring for review nodes
        if (node.confidence && node.group !== 'user') {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 3, 0, 2 * Math.PI);
          ctx.strokeStyle = `${color}40`;
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // Node label with background
        const label = node.id;
        const metrics = ctx.measureText(label);
        const labelWidth = metrics.width;
        const labelHeight = 12;
        
        // Label background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(node.x - labelWidth/2 - 4, node.y + radius + 8, labelWidth + 8, labelHeight + 4);
        
        // Label text
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, node.x, node.y + radius + 18);
      });

      ctx.restore();
    };

    // Animation loop
    let animationId;
    
    const animate = () => {
      simulate();
      render();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [graphData, scale, offset, isSimulating, nodes]);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev * 1.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.1, prev * 0.8));
  };

  const handleReset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    setIsSimulating(true);
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white flex items-center space-x-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <span>Review Network Graph</span>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Interactive visualization of review relationships and user connections
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={toggleSimulation}
              size="sm"
              variant={isSimulating ? "default" : "outline"}
              className={isSimulating ? "bg-cyan-600 hover:bg-cyan-700" : "border-slate-700 text-slate-300 hover:bg-slate-800"}
            >
              <Zap className="w-4 h-4 mr-1" />
              {isSimulating ? 'Live' : 'Paused'}
            </Button>
            <Button
              onClick={handleReset}
              size="sm"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!graphData ? (
          <div className="bg-slate-950/50 rounded-lg border border-slate-800 p-8 text-center">
            <Network className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No Graph Data</h3>
            <p className="text-slate-500">Upload and classify reviews to see the network graph</p>
          </div>
        ) : (
          <div 
            ref={containerRef}
            className="relative bg-slate-950/50 rounded-lg border border-slate-800 overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={500}
              className="w-full h-auto"
            />
            
            {/* Controls */}
            <div className="absolute top-4 left-4 flex items-center space-x-2">
              <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-800 p-2 flex items-center space-x-1">
                <Button
                  onClick={handleZoomIn}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleZoomOut}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-800 p-3 space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs text-slate-300">Fraud Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-slate-300">Benign Review</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-300">User Node</span>
              </div>
              <div className="text-xs text-slate-400 mt-2">
                <div>• Drag to pan</div>
                <div>• Scroll to zoom</div>
                <div>• Red dashed = similar reviews</div>
              </div>
            </div>

            {/* Stats */}
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-sm rounded-lg border border-slate-800 px-3 py-2">
              <div className="text-xs text-slate-300">
                <div>Nodes: {graphData?.nodes.length || 0}</div>
                <div>Edges: {graphData?.edges.length || 0}</div>
                <div>Zoom: {Math.round(scale * 100)}%</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NetworkGraph;
