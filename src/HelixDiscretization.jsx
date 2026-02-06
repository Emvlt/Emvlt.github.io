import React, { useState, useMemo, useRef } from 'react';
import { Settings, Info, Box, Activity, Move, RotateCcw, Scan, Eye, Share2, FileText } from 'lucide-react';

const HelixDiscretization = () => {
  // --- State for Cylinder and Helix Parameters ---
  const [radius, setRadius] = useState(10);
  const [height, setHeight] = useState(40);
  const [turns, setTurns] = useState(2.5);
  const [samples, setSamples] = useState(15);
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'connectivity' | 'docs'

  // --- State for Connectivity Analysis ---
  const [kHops, setKHops] = useState(1);

  // --- State for FOV and Camera ---
  const [fovWidth, setFovWidth] = useState(45); // Degrees
  const [fovHeight, setFovHeight] = useState(10); // Vertical units
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(0); // Default to first node

  // --- State for Main View Camera ---
  const [viewState, setViewState] = useState({
    rotation: 0,
    zoom: 7,
    panX: 300,
    panY: 450
  });
  
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // --- Tab Info Descriptions ---
  const tabInfo = {
    visual: {
      title: "3D Spatial Discretization",
      description: "Visualizes the helical sensor path in 3D space. Each vertex represents a discrete sampling point along the curve, a source position.",
      details: [
        "Hovering over a vertex show its neighbourhood and the sensor view.",
        "Click a vertex to lock camera (vertex appears green)",
        "Drag to rotate and pan view",
        "Scroll to zoom in/out"
        
      ]
    },
    connectivity: {
      title: "Graph Connectivity Analysis",
      description: "Examines the network topology. Edges illustrate connections between nodes within 'k' hops.",
      details: [
        "Blue lines: Direct neighbors",
        "Pink lines: Multi-hop connections",
        "Use slider to adjust range (k)"
      ]
    },
    docs: {
      title: "Project Documentation",
      description: "Explanations of the approach.",
    }
  };

  // --- Calculations ---
  
  // Define a placeholder object "Core" inside the cylinder
  const coreFeatures = useMemo(() => {
    return [
      { id: 'top', z: height * 0.9, color: '#ef4444', label: 'Top Marker' },
      { id: 'mid', z: height * 0.5, color: '#10b981', label: 'Core Center' },
      { id: 'bot', z: height * 0.1, color: '#f59e0b', label: 'Base Unit' }
    ];
  }, [height]);

  const graphData = useMemo(() => {
    const nodes = [];
    const edges = [];
    
    const totalAngle = turns * 2 * Math.PI;
    const step = totalAngle / (samples - 1);
    const heightStep = height / (samples - 1);

    for (let i = 0; i < samples; i++) {
      const t = i * step;
      const z = i * heightStep;
      
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);
      
      const node = {
        id: i,
        t: t,
        x: x,
        y: y,
        z: z,
        u: t * radius,
        v: z
      };
      nodes.push(node);

      if (i > 0) {
        const prev = nodes[i - 1];
        const dist = Math.sqrt(
          Math.pow(node.u - prev.u, 2) + 
          Math.pow(node.v - prev.v, 2)
        );

        edges.push({
          source: i - 1,
          target: i,
          weight: dist
        });
      }
    }
    return { nodes, edges };
  }, [radius, height, turns, samples]);

  const continuousPath = useMemo(() => {
    const points = [];
    const resolution = 100;
    const totalAngle = turns * 2 * Math.PI;
    
    for (let i = 0; i <= resolution; i++) {
      const t = (i / resolution) * totalAngle;
      const z = (i / resolution) * height;
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);
      points.push({ x, y, z });
    }
    return points;
  }, [radius, height, turns]);

  // --- 3D Projection Logic with Camera Controls ---
  const project = (x, y, z) => {
    const rot = viewState.rotation;
    const rx = x * Math.cos(rot) - y * Math.sin(rot);
    const ry = x * Math.sin(rot) + y * Math.cos(rot);
    const isoAngle = Math.PI / 6;
    
    const nx = Number(rx);
    const ny = Number(ry);
    const nz = Number(z);

    const px = viewState.panX + (nx - ny * Math.cos(isoAngle)) * viewState.zoom;
    const py = viewState.panY + (-nz + (nx + ny) * Math.sin(isoAngle) * 0.5) * viewState.zoom;

    return { x: px, y: py };
  };

  // --- Mouse Handlers for Interaction ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    
    setViewState(prev => ({
      ...prev,
      rotation: prev.rotation + dx * 0.01,
      panY: prev.panY + dy,
      panX: prev.panX + dx * 0.5
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleWheel = (e) => {
    const zoomFactor = -e.deltaY * 0.01;
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(2, Math.min(20, prev.zoom + zoomFactor))
    }));
  };

  const resetCamera = () => {
    setViewState({
      rotation: 0,
      zoom: 7,
      panX: 300,
      panY: 450
    });
  };

  // --- Rendering Helpers ---
  const renderCylinderWireframe = () => {
    const steps = 30;
    const bottomRing = [];
    const topRing = [];
    
    for (let i = 0; i <= steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const x = radius * Math.cos(t);
      const y = radius * Math.sin(t);
      bottomRing.push(project(x, y, 0));
      topRing.push(project(x, y, height));
    }

    const pathString = (points) => {
      return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    };

    return (
      <g className="opacity-20 stroke-slate-500 pointer-events-none">
        <path d={pathString(bottomRing)} fill="none" strokeWidth="1" />
        <path d={pathString(topRing)} fill="none" strokeWidth="1" />
        <line x1={bottomRing[0].x} y1={bottomRing[0].y} x2={topRing[0].x} y2={topRing[0].y} strokeWidth="1" />
        <line x1={bottomRing[15].x} y1={bottomRing[15].y} x2={topRing[15].x} y2={topRing[15].y} strokeWidth="1" />
      </g>
    );
  };

  const renderCoreObject = () => {
    const base = project(0, 0, 0);
    const top = project(0, 0, height);

    return (
      <g className="pointer-events-none">
        <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} stroke="#94a3b8" strokeWidth="4" opacity="0.5" strokeLinecap="round" />
        {coreFeatures.map((feat) => {
          const p = project(0, 0, feat.z);
          return (
            <g key={feat.id}>
              <circle cx={p.x} cy={p.y} r={4 * (viewState.zoom/7)} fill={feat.color} />
              <circle cx={p.x} cy={p.y} r={8 * (viewState.zoom/7)} stroke={feat.color} fill="none" opacity="0.5" />
            </g>
          );
        })}
      </g>
    );
  };

  const renderFOVRectangle = (node) => {
    const apex = project(node.x, node.y, node.z);

    // Calculate Frustum Corners at the Central Axis
    const rads = (fovWidth * Math.PI) / 180;
    const halfWidth = radius * Math.tan(rads / 2);
    const halfHeight = fovHeight / 2;
    const sinT = Math.sin(node.t);
    const cosT = Math.cos(node.t);

    const c1 = { x: -halfWidth * (-sinT), y: -halfWidth * (cosT), z: node.z + halfHeight };
    const c2 = { x: halfWidth * (-sinT), y: halfWidth * (cosT), z: node.z + halfHeight };
    const c3 = { x: halfWidth * (-sinT), y: halfWidth * (cosT), z: node.z - halfHeight };
    const c4 = { x: -halfWidth * (-sinT), y: -halfWidth * (cosT), z: node.z - halfHeight };

    const p1 = project(c1.x, c1.y, c1.z);
    const p2 = project(c2.x, c2.y, c2.z);
    const p3 = project(c3.x, c3.y, c3.z);
    const p4 = project(c4.x, c4.y, c4.z);

    return (
      <g className="pointer-events-none fade-in">
        {/* Frustum Sides */}
        <line x1={apex.x} y1={apex.y} x2={p1.x} y2={p1.y} stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
        <line x1={apex.x} y1={apex.y} x2={p2.x} y2={p2.y} stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
        <line x1={apex.x} y1={apex.y} x2={p3.x} y2={p3.y} stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
        <line x1={apex.x} y1={apex.y} x2={p4.x} y2={p4.y} stroke="#f59e0b" strokeWidth="1" opacity="0.3" />

        {/* Rectangular Plane */}
        <polygon 
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
          fill="#f59e0b"
          fillOpacity="0.15"
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="2 2"
        />

        {/* Center Line */}
        <line 
          x1={apex.x} y1={apex.y} 
          x2={project(0,0,node.z).x} y2={project(0,0,node.z).y} 
          stroke="#f59e0b" 
          strokeDasharray="4 2" 
          opacity="0.8" 
        />
        
        {/* Vertical Center Strip */}
        <line 
          x1={project(0,0,node.z+halfHeight).x} y1={project(0,0,node.z+halfHeight).y} 
          x2={project(0,0,node.z-halfHeight).x} y2={project(0,0,node.z-halfHeight).y} 
          stroke="#f59e0b" 
          strokeWidth="2" 
        />
      </g>
    );
  };

  const renderMultiHopEdges = () => {
    const edgesToRender = [];
    for (let i = 0; i < graphData.nodes.length; i++) {
      const startNode = graphData.nodes[i];
      for (let k = 1; k <= kHops; k++) {
        if (i + k < graphData.nodes.length) {
          const endNode = graphData.nodes[i + k];
          
          const segments = 20; 
          const dt = (endNode.t - startNode.t) / segments;
          const dz = (endNode.z - startNode.z) / segments;
          
          let pathData = `M ${project(startNode.x, startNode.y, startNode.z).x},${project(startNode.x, startNode.y, startNode.z).y}`;
          
          for (let step = 1; step <= segments; step++) {
            const t = startNode.t + dt * step;
            const z = startNode.z + dz * step;
            const x = radius * Math.cos(t);
            const y = radius * Math.sin(t);
            const proj = project(x, y, z);
            pathData += ` L ${proj.x},${proj.y}`;
          }

          const isPrimary = k === 1;
          const isHighlighted = hoveredNode !== null && (i === hoveredNode || (i + k) === hoveredNode);

          edgesToRender.push(
            <path 
              key={`conn-${i}-${k}`}
              d={pathData}
              fill="none"
              // Highlight color logic:
              // - If k=1: Default blue, Pink if highlighted
              // - If k>1: Always pink
              stroke={isPrimary ? (isHighlighted ? "#d946ef" : "#3b82f6") : "#d946ef"} 
              
              // Thickness logic:
              // - Thicker (3px) if highlighted
              // - Normal (2px) if k=1
              // - Thin (1px) if k>1 and not highlighted
              strokeWidth={isHighlighted ? 3 : (isPrimary ? 2 : 1)}
              
              // Opacity logic:
              // - Full opacity (1) if highlighted
              // - Full opacity (1) if k=1 (primary chain)
              // - Faded opacity based on distance for non-highlighted k>1 edges
              opacity={isHighlighted ? 1 : (isPrimary ? 1 : Math.max(0.1, 0.6 - (k * 0.1)))} 
              
              className="pointer-events-none transition-all duration-300"
            />
          );
        }
      }
    }
    return edgesToRender;
  };

  // Helper for rendering the Documentation Template
  const renderDocumentation = () => (
    <div className="w-full h-full overflow-y-auto bg-white/50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-sm border border-slate-200 prose prose-slate">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Discretization of an acquisition geometry</h1>
        
        <div className="space-y-8">
          
          {/* Section 1: Overview */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">1. Overview</h2>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              In computational imaging, such as Computed Tomography, the images are reconstructed from a sequence of measurements along an acquisition geometry. That is, a source/detector pair moves on a surface following a trajectory, and their position is recorded for use in the image reconstruction process.<br/>

              I propose to represent this geometry as a graph, and leverage geometric deep-learning Graph-Neural Networks' message-passing mechanism to aggregate data for image reconstruction.
              This App is a visual support to explain the discretization of a contiuous curve into a graph.
              
              Check the full paper <a style={{fontWeight: "bold", color: "blue"}} href="https://www.arxiv.org/abs/2511.12730">here</a>.
              <br/>
            </p>
          </section>

          {/* Section 2: Mathematical Model */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">2. Mathematical Model</h2>
            <p className="text-sm text-slate-600 mb-4">
              A graph is defined as 
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-xs text-blue-700 mb-4">
              G = (V, E, W)<br/>
            </div>
            <p className="text-sm text-slate-600 mb-2">Where:</p>
            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
              <li><strong>G:</strong> The graph </li>
              <li><strong>V:</strong> The set of vertices. The feature of each vertex is the recorded measurement at the source position</li>
              <li><strong>E:</strong> The set of edges. An edge exists between two consecutive measurements.</li>
              <li><strong>W:</strong> The edge's weights. The weight depends on the intrinsic distance (the length of the geodesic) between the vertices.</li>
            </ul>
            <br/> 
            <p className="text-sm text-slate-600 mb-4">
              A deep GNN is then built by stacking graph convolutional layers that use message-passing to aggregate information between neighbouring measurements and grid convolution to filter noise from the measurements. 
            </p>
          </section>

        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-800 font-sans">
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Activity className="text-blue-600" size={24} />
          <h1 className="text-xl font-bold text-slate-800">Helix Discretization Engine</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto z-10">
          
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <Settings size={14} /> Structure Parameters
            </h2>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold block text-slate-600">Discretization Samples (Nodes)</label>
              <input 
                type="range" min="3" max="50" value={samples} 
                onChange={(e) => setSamples(parseInt(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold block text-slate-600">Cylinder Radius (R)</label>
              <input 
                type="range" min="5" max="15" step="0.5" value={radius} 
                onChange={(e) => setRadius(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold block text-slate-600">Cylinder Height (H)</label>
              <input 
                type="range" min="20" max="60" value={height} 
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold block text-slate-600">Winding Number (Turns)</label>
              <input 
                type="range" min="0.5" max="5" step="0.1" value={turns} 
                onChange={(e) => setTurns(parseFloat(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>

          {(activeTab === 'connectivity') ? (
            <div className="space-y-4 border-t border-slate-100 pt-4 animate-in slide-in-from-left-2 duration-300">
              <h2 className="text-sm font-bold uppercase tracking-wider text-pink-600 flex items-center gap-2">
                <Share2 size={14} /> Connectivity Depth
              </h2>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold block text-slate-600">Neighbor Hops (k)</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="range" min="1" max="5" step="1" value={kHops} 
                    onChange={(e) => setKHops(parseInt(e.target.value))}
                    className="w-full accent-pink-500"
                  />
                  <span className="text-xs font-mono font-bold text-pink-600 w-8 text-right">{kHops}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                   Connects node v_i to neighbors within distance k. Use to analyze graph density and robustness.
                </p>
              </div>
            </div>
          ) : activeTab === 'docs' ? (
            <div className="space-y-4 border-t border-slate-100 pt-4 animate-in slide-in-from-left-2 duration-300">
              <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs text-slate-500 text-center">
                 Select other tabs to configure visualization parameters.
              </div>
            </div>
          ) : (
            <div className="space-y-4 border-t border-slate-100 pt-4 animate-in slide-in-from-left-2 duration-300">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Scan size={14} /> Sensor FOV Parameters
              </h2>
              
              <div className="space-y-2">
                <label className="text-xs font-semibold block text-slate-600">Vertical FOV (Height Units)</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="range" min="2" max="20" step="1" value={fovHeight} 
                    onChange={(e) => setFovHeight(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-xs font-mono w-8 text-right">{fovHeight}</span>
                </div>
              </div>

               <div className="space-y-2">
                <label className="text-xs font-semibold block text-slate-600">Horizontal FOV (Degrees)</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="range" min="10" max="120" step="5" value={fovWidth} 
                    onChange={(e) => setFovWidth(parseFloat(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <span className="text-xs font-mono w-8 text-right">{fovWidth}°</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-2">
            <h3 className="text-blue-800 font-bold text-sm flex items-center gap-2">
              <Info size={14} /> Math Model
            </h3>
            <p className="text-xs text-blue-700 font-mono">
              x = R · cos(t)<br/>
              y = R · sin(t)<br/>
              z = c · t
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-slate-50/50 relative">
          <div className="flex border-b border-slate-200 bg-white">
            <button 
              onClick={() => setActiveTab('visual')}
              className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'visual' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Box size={16} /> 3D Discretization
            </button>
            <button 
              onClick={() => setActiveTab('connectivity')}
              className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'connectivity' ? 'border-pink-500 text-pink-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <Share2 size={16} /> Connectivity Analysis
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'docs' ? 'border-slate-500 text-slate-800' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              <FileText size={16} /> Documentation
            </button>
          </div>

          <div className="flex-1 p-8 overflow-hidden flex justify-center items-center relative">
            
            {/* Info Panel (Top Right) */}
            <div className="absolute top-4 right-4 w-80 bg-white/90 backdrop-blur rounded-xl border border-slate-200 shadow-sm p-4 z-10 pointer-events-none animate-in slide-in-from-top-2 duration-500">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-2">
                <Info size={14} className="text-blue-500" /> 
                {tabInfo[activeTab].title}
              </h3>
              <div className="text-[10px] text-slate-500 leading-relaxed">
                <p className="mb-2">{tabInfo[activeTab].description}</p>
                {tabInfo[activeTab].details && (
                  <ul className="list-disc pl-3 space-y-1 opacity-80">
                    {tabInfo[activeTab].details.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {activeTab === 'docs' ? (
              renderDocumentation()
            ) : (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
              
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
                 <div className="flex items-center gap-2 text-xs text-slate-400 bg-white/80 p-2 rounded backdrop-blur-sm border border-slate-100 pointer-events-auto">
                    <Move size={12} /> Drag to Rotate/Pan
                 </div>
                 <button 
                  onClick={resetCamera}
                  className="flex items-center gap-2 text-xs text-blue-500 bg-white/90 p-2 rounded backdrop-blur-sm border border-slate-100 hover:bg-blue-50 transition-colors shadow-sm pointer-events-auto"
                 >
                   <RotateCcw size={12} /> Reset View
                 </button>
              </div>

              <svg 
                width="100%" 
                height="100%" 
                viewBox="0 0 600 500" 
                className={`bg-white rounded-xl shadow-lg border border-slate-200 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
              >
                <defs>
                  <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                  </marker>
                </defs>

                {renderCoreObject()}
                {renderCylinderWireframe()}

                <path 
                  d={continuousPath.map((p, i) => {
                    const proj = project(p.x, p.y, p.z);
                    return `${i === 0 ? 'M' : 'L'} ${proj.x},${proj.y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  className="pointer-events-none"
                />

                {activeTab === 'connectivity' ? renderMultiHopEdges() : (
                  graphData.edges.map((edge, i) => {
                    const startNode = graphData.nodes[edge.source];
                    const endNode = graphData.nodes[edge.target];
                    const isConnected = hoveredNode !== null && (edge.source === hoveredNode || edge.target === hoveredNode);
                    
                    const segments = 20; 
                    const dt = (endNode.t - startNode.t) / segments;
                    const dz = (endNode.z - startNode.z) / segments;
                    
                    let pathData = `M ${project(startNode.x, startNode.y, startNode.z).x},${project(startNode.x, startNode.y, startNode.z).y}`;
                    
                    for (let step = 1; step <= segments; step++) {
                      const t = startNode.t + dt * step;
                      const z = startNode.z + dz * step;
                      const x = radius * Math.cos(t);
                      const y = radius * Math.sin(t);
                      const proj = project(x, y, z);
                      pathData += ` L ${proj.x},${proj.y}`;
                    }

                    return (
                      <path 
                        key={`edge-${i}`}
                        d={pathData}
                        fill="none"
                        stroke="#3b82f6" 
                        strokeWidth={isConnected ? "3" : "2"}
                        opacity={isConnected ? 1 : 0.6}
                        className="pointer-events-none transition-colors duration-200"
                      />
                    );
                  })
                )}
                
                {activeTab === 'visual' && hoveredNode !== null && renderFOVRectangle(graphData.nodes[hoveredNode])}

                {graphData.nodes.map((node, i) => {
                  const rot = viewState.rotation;
                  const ry = node.x * Math.sin(rot) + node.y * Math.cos(rot);
                  const isBack = ry < 0; 
                  const p = project(node.x, node.y, node.z);
                  const isHovered = hoveredNode === i;
                  const isSelected = selectedNode === i;
                  
                  let isNeighbor = false;
                  if (hoveredNode !== null) {
                    const diff = Math.abs(hoveredNode - i);
                    if (activeTab === 'connectivity') {
                      isNeighbor = diff > 0 && diff <= kHops;
                    } else {
                      isNeighbor = diff === 1;
                    }
                  }
                  
                  const selectedColor = activeTab === 'connectivity' ? "#d946ef" : "#22c55e";

                  return (
                    <g 
                      key={`node-${i}`} 
                      transform={`translate(${p.x}, ${p.y})`}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                      onClick={() => setSelectedNode(i)}
                    >
                      <circle cx={0} cy={0} r={12} fill="transparent" />
                      
                      <circle 
                        cx={0} cy={0}
                        r={isBack ? 4 : 5} 
                        fill={isHovered ? "#f59e0b" : (isSelected ? selectedColor : (isNeighbor ? (activeTab==='connectivity'?"#d946ef":"#10b981") : (isBack ? "#94a3b8" : "#2563eb")))} 
                        stroke={isSelected ? selectedColor : "white"}
                        strokeWidth={isSelected ? 4 : 2}
                        strokeOpacity={isSelected ? 0.4 : 1}
                        className="transition-transform duration-200 pointer-events-none" 
                        style={{ 
                          transformBox: 'fill-box', 
                          transformOrigin: 'center',
                          transform: isHovered ? 'scale(1.5)' : (isNeighbor ? 'scale(1.2)' : 'scale(1)')
                        }} 
                      />
                      
                      <text 
                        x={10} 
                        y={3}
                        className={`transition-opacity duration-200 text-[10px] font-bold pointer-events-none ${isHovered ? 'opacity-100 fill-amber-600' : (isNeighbor ? (activeTab==='connectivity'?'opacity-100 fill-pink-600':'opacity-100 fill-emerald-600') : 'opacity-0 fill-slate-700')}`}
                      >
                        v{i}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Updated Persistent Extra Window */}
              <div className="absolute bottom-6 right-6 w-64 h-64 bg-white rounded-xl border border-slate-300 shadow-2xl overflow-hidden flex flex-col fade-in ring-1 ring-slate-900/5 z-20">
                <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <Eye size={12} className="text-amber-500" /> 
                    Source Position {hoveredNode !== null ? hoveredNode : selectedNode}
                  </span>
                  
                </div>
                
                <div className="flex-1 relative bg-white overflow-hidden">
                  <div className="absolute inset-0 opacity-40 border-t border-b border-slate-200 top-1/2 -translate-y-1/2 h-1/2 pointer-events-none"></div>
                  <div className="absolute inset-0 opacity-40 border-l border-r border-slate-200 left-1/2 -translate-x-1/2 w-1/2 pointer-events-none"></div>
                  
                  {/* Dynamic Grid */}
                  <div className="absolute inset-0 pointer-events-none" style={{
                      backgroundImage: 'linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)',
                      backgroundSize: `${(20 / fovHeight) * 20}px ${(20 / fovHeight) * 20}px`, 
                      opacity: 0.5
                  }}></div>

                  <div className="absolute inset-0 border border-slate-100 m-4 rounded pointer-events-none"></div>

                  {/* Horizontal FOV Blinders */}
                  <div className="absolute top-0 bottom-0 left-0 bg-slate-100/80 z-10 transition-all duration-300 pointer-events-none" 
                       style={{ width: `${Math.max(0, (120 - fovWidth) / 2.4)}%` }}></div>
                  <div className="absolute top-0 bottom-0 right-0 bg-slate-100/80 z-10 transition-all duration-300 pointer-events-none" 
                       style={{ width: `${Math.max(0, (120 - fovWidth) / 2.4)}%` }}></div>
                  
                  <svg width="100%" height="100%" viewBox="-50 -50 100 100" preserveAspectRatio="none">
                     <g>
                       <rect x="-5" y="-60" width="10" height="120" fill="#e2e8f0" />
                       <line x1="0" y1="-60" x2="0" y2="60" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />

                       {coreFeatures.map((feat) => {
                         const targetId = hoveredNode !== null ? hoveredNode : selectedNode;
                         const nodeZ = graphData.nodes[targetId].z;
                         const deltaZ = feat.z - nodeZ; 
                         const screenY = (deltaZ / (fovHeight / 2)) * -50;
                         if (Math.abs(deltaZ) <= fovHeight / 2 + 1) { 
                           return (
                             <g key={feat.id}>
                               <rect x="-20" y={screenY - 2} width="40" height="4" fill="#cbd5e1" rx="2" />
                               <circle cx="0" cy={screenY} r="6" fill={feat.color} stroke="white" strokeWidth="2" />
                               <text x="12" y={screenY + 3} fontSize="8" fontWeight="bold" fill="#475569" fontFamily="sans-serif">{feat.label}</text>
                             </g>
                           );
                         }
                         return null;
                       })}
                     </g>

                     <line x1="-5" y1="0" x2="5" y2="0" stroke="#f59e0b" strokeWidth="1.5" />
                     <line x1="0" y1="-5" x2="0" y2="5" stroke="#f59e0b" strokeWidth="1.5" />
                  </svg>
                  
                  <div className="absolute bottom-2 left-3 text-[9px] font-mono text-slate-500 z-20">
                     Z-POS: <span className="text-slate-900 font-bold">{graphData.nodes[hoveredNode !== null ? hoveredNode : selectedNode].z.toFixed(1)}</span><br/>
                     APERTURE: {fovHeight}u
                  </div>
                </div>
              </div>

            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelixDiscretization;