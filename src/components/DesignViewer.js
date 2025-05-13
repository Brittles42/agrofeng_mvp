import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './DesignViewer.css';

const DesignViewer = ({ landData, designData, setDesignData }) => {
  const [currentView, setCurrentView] = useState('present');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showTerrain3D, setShowTerrain3D] = useState(false);
  
  const terrainContainerRef = useRef(null);
  const terrainSceneRef = useRef(null);
  
  const navigate = useNavigate();

  // Generate design if we have land data but no design data
  useEffect(() => {
    if (landData && !designData) {
      generateDesign();
    }
  }, [landData, designData]);
  
  // Initialize 3D terrain visualization when LiDAR data is available
  useEffect(() => {
    if (showTerrain3D && landData?.lidarData && terrainContainerRef.current) {
      initTerrain3D();
      
      return () => {
        // Cleanup Three.js resources when component unmounts
        if (terrainSceneRef.current) {
          terrainSceneRef.current.renderer.dispose();
          terrainSceneRef.current = null;
        }
      };
    }
  }, [showTerrain3D, landData]);
  
  // Initialize 3D terrain visualization using Three.js
  const initTerrain3D = () => {
    const container = terrainContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 5, 10);
    
    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    
    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Create terrain from LiDAR data
    createTerrainFromLidarData(scene, landData.lidarData);
    
    // Add grid helper
    const gridHelper = new THREE.GridHelper(20, 20);
    scene.add(gridHelper);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Store references for cleanup
    terrainSceneRef.current = {
      scene,
      camera,
      renderer,
      controls
    };
  };
  
  // Create terrain mesh from LiDAR data
  const createTerrainFromLidarData = (scene, lidarData) => {
    if (!lidarData || !lidarData.elevationPoints) return;
    
    // Create terrain geometry
    const geometry = new THREE.BufferGeometry();
    
    // Convert elevation points to vertices
    const vertices = [];
    const colors = [];
    
    lidarData.elevationPoints.forEach(point => {
      // Scale points to fit scene
      const x = (point.x - 0.5) * 20;
      const y = point.y * 5; // Exaggerate height for visibility
      const z = (point.z - 0.5) * 20;
      
      vertices.push(x, y, z);
      
      // Color based on elevation
      const color = new THREE.Color();
      color.setHSL(0.3 - point.y * 0.5, 0.7, 0.5); // Green to brown gradient
      colors.push(color.r, color.g, color.b);
    });
    
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    // Create point cloud material
    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true
    });
    
    // Create point cloud
    const pointCloud = new THREE.Points(geometry, material);
    scene.add(pointCloud);
    
    // Add detected features as simple meshes
    if (lidarData.detectedFeatures) {
      lidarData.detectedFeatures.forEach(feature => {
        let mesh;
        const position = {
          x: (feature.position.x - 0.5) * 20,
          y: feature.position.y * 5,
          z: (feature.position.z - 0.5) * 20
        };
        
        if (feature.type === 'tree') {
          // Simple tree representation
          const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 1, 8),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
          );
          trunk.position.set(position.x, position.y + 0.5, position.z);
          
          const foliage = new THREE.Mesh(
            new THREE.ConeGeometry(1, 2, 8),
            new THREE.MeshLambertMaterial({ color: 0x228B22 })
          );
          foliage.position.set(position.x, position.y + 2, position.z);
          
          scene.add(trunk);
          scene.add(foliage);
        } else if (feature.type === 'structure') {
          // Simple structure representation
          mesh = new THREE.Mesh(
            new THREE.BoxGeometry(feature.size.width * 10, 1, feature.size.height * 10),
            new THREE.MeshLambertMaterial({ color: 0xA9A9A9 })
          );
          mesh.position.set(position.x, position.y + 0.5, position.z);
          scene.add(mesh);
        } else if (feature.type === 'water') {
          // Simple water representation
          mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(feature.size.width * 10, feature.size.height * 10),
            new THREE.MeshLambertMaterial({ color: 0x4682B4, transparent: true, opacity: 0.7 })
          );
          mesh.rotation.x = -Math.PI / 2;
          mesh.position.set(position.x, position.y + 0.05, position.z);
          scene.add(mesh);
        }
      });
    }
  };

  // Simulate design generation
  const generateDesign = () => {
    if (!landData) {
      navigate('/scan');
      return;
    }

    setIsGenerating(true);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setGenerationProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate mock design data
        const mockDesignData = {
          presentView: null, // Using null to indicate we'll use placeholders instead of actual images
          oneYearView: null,
          threeYearView: null,
          fiveYearView: null,
          plantingZones: [
            {
              name: 'Food Forest',
              location: 'Eastern section',
              plants: ['Apple trees', 'Pear trees', 'Blueberry bushes', 'Strawberries', 'Herbs'],
              fengShuiElement: 'Wood',
              description: 'A multi-layered edible ecosystem that produces fruit, berries, and herbs.'
            },
            {
              name: 'Vegetable Garden',
              location: 'Southern section',
              plants: ['Tomatoes', 'Peppers', 'Kale', 'Carrots', 'Beans'],
              fengShuiElement: 'Fire',
              description: 'Annual vegetables arranged in companion planting patterns.'
            },
            {
              name: 'Water Garden',
              location: 'Northern section',
              plants: ['Water lilies', 'Cattails', 'Lotus', 'Watercress'],
              fengShuiElement: 'Water',
              description: 'A small pond with edible aquatic plants and habitat for beneficial wildlife.'
            },
            {
              name: 'Meditation Space',
              location: 'Center',
              plants: ['Lavender', 'Rosemary', 'Ornamental grasses'],
              fengShuiElement: 'Earth',
              description: 'A peaceful central area for relaxation and contemplation.'
            },
            {
              name: 'Herb Spiral',
              location: 'Western section',
              plants: ['Thyme', 'Sage', 'Mint', 'Chives', 'Basil'],
              fengShuiElement: 'Metal',
              description: 'A spiral-shaped herb garden that creates multiple microclimates.'
            }
          ],
          pathways: [
            {
              type: 'Main path',
              material: 'Wood chips',
              pattern: 'Curved',
              purpose: 'Primary access through the garden'
            },
            {
              type: 'Secondary paths',
              material: 'Stepping stones',
              pattern: 'Meandering',
              purpose: 'Access to individual planting zones'
            }
          ],
          waterFeatures: [
            {
              type: 'Pond',
              location: 'Northern section',
              purpose: 'Habitat, irrigation, and feng shui water element'
            },
            {
              type: 'Swale',
              location: 'Along contour lines',
              purpose: 'Water harvesting and passive irrigation'
            }
          ]
        };
        
        // Set the design data in the parent component
        setDesignData(mockDesignData);
        setIsGenerating(false);
      }
    }, 150);
  };

  // Handle time view changes
  const changeTimeView = (view) => {
    setCurrentView(view);
  };

  // If no land data, prompt user to scan land first
  if (!landData) {
    return (
      <div className="design-viewer empty-state">
        <h2>No Land Data Available</h2>
        <p>Please scan your land first to generate a design.</p>
        <button className="btn" onClick={() => navigate('/scan')}>
          Scan Land
        </button>
      </div>
    );
  }

  // If generating design, show progress
  if (isGenerating) {
    return (
      <div className="design-viewer generating">
        <h2>Generating Your AgroFeng Design</h2>
        <div className="generation-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${generationProgress}%` }}
            ></div>
          </div>
          <p>{generationProgress}% Complete</p>
        </div>
        <div className="generation-steps">
          <div className={`step ${generationProgress >= 20 ? 'active' : ''}`}>
            Analyzing terrain
          </div>
          <div className={`step ${generationProgress >= 40 ? 'active' : ''}`}>
            Applying feng shui principles
          </div>
          <div className={`step ${generationProgress >= 60 ? 'active' : ''}`}>
            Selecting plant combinations
          </div>
          <div className={`step ${generationProgress >= 80 ? 'active' : ''}`}>
            Creating visualization
          </div>
          <div className={`step ${generationProgress >= 100 ? 'active' : ''}`}>
            Finalizing design
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="design-viewer">
      <h2>Your AgroFeng Design</h2>
      
      <div className="time-selector">
        <button 
          className={`time-btn ${currentView === 'present' ? 'active' : ''}`}
          onClick={() => changeTimeView('present')}
        >
          Present
        </button>
        <button 
          className={`time-btn ${currentView === 'oneYear' ? 'active' : ''}`}
          onClick={() => changeTimeView('oneYear')}
        >
          1 Year
        </button>
        <button 
          className={`time-btn ${currentView === 'threeYears' ? 'active' : ''}`}
          onClick={() => changeTimeView('threeYears')}
        >
          3 Years
        </button>
        <button 
          className={`time-btn ${currentView === 'fiveYears' ? 'active' : ''}`}
          onClick={() => changeTimeView('fiveYears')}
        >
          5 Years
        </button>
      </div>
      
      <div className="design-visualization">
        {landData?.lidarData && (
          <div className="visualization-controls">
            <button 
              className={`viz-toggle ${showTerrain3D ? 'active' : ''}`}
              onClick={() => setShowTerrain3D(!showTerrain3D)}
            >
              {showTerrain3D ? 'Hide 3D Terrain' : 'Show 3D Terrain'}
            </button>
            <div className="viz-info">
              <p>LiDAR data available: {landData.lidarData.elevationPoints.length} data points</p>
            </div>
          </div>
        )}
        
        {showTerrain3D && landData?.lidarData ? (
          <div className="terrain-3d-container" ref={terrainContainerRef}></div>
        ) : (
          <div className="visualization-placeholder">
            <p>Visualization for {currentView} view</p>
            <p className="placeholder-note">
              {landData?.lidarData 
                ? 'Click "Show 3D Terrain" to view LiDAR-based terrain model' 
                : '(In the full app, this would show a 3D rendering of your land design)'}
            </p>
          </div>
        )}
      </div>
      
      <div className="design-details">
        <h3>Design Elements</h3>
        
        {landData?.hardinessZone && (
          <div className="climate-info">
            <div className="info-badge">
              <span className="badge-label">Climate:</span>
              <span className="badge-value">{landData.climate}</span>
            </div>
            <div className="info-badge">
              <span className="badge-label">Hardiness Zone:</span>
              <span className="badge-value">{landData.hardinessZone}</span>
            </div>
            <p className="climate-note">Plant recommendations are customized for your specific climate and hardiness zone</p>
          </div>
        )}
        
        <div className="element-section">
          <h4>Recommended Plants by Category</h4>
          <div className="elements-grid">
            {landData?.recommendedPlants && Object.entries(landData.recommendedPlants).map(([category, plants]) => (
              <div className="element-card" key={category}>
                <h5>{category.charAt(0).toUpperCase() + category.slice(1)}</h5>
                <div className="plants-list">
                  <ul>
                    {plants.slice(0, 5).map((plant, i) => (
                      <li key={i}>{plant}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="element-section">
          <h4>Feng Shui Elements</h4>
          <div className="elements-grid">
            {landData?.fengShuiElements && Object.entries(landData.fengShuiElements).map(([element, details]) => (
              <div className="element-card feng-shui-card" key={element}>
                <h5>{element.charAt(0).toUpperCase() + element.slice(1)} Element</h5>
                <p><strong>Placement:</strong> {details.placement}</p>
                <div className="feng-shui-details">
                  <div>
                    <strong>Recommended Plants:</strong>
                    <ul className="compact-list">
                      {details.plants.slice(0, 3).map((plant, i) => (
                        <li key={i}>{plant}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Features:</strong>
                    <ul className="compact-list">
                      {details.features.slice(0, 3).map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="element-section">
          <h4>Planting Zones</h4>
          <div className="elements-grid">
            {designData?.plantingZones.map((zone, index) => (
              <div className="element-card" key={index}>
                <h5>{zone.name}</h5>
                <p><strong>Location:</strong> {zone.location}</p>
                <p><strong>Feng Shui Element:</strong> {zone.fengShuiElement}</p>
                <p>{zone.description}</p>
                <div className="plants-list">
                  <strong>Plants:</strong>
                  <ul>
                    {zone.plants.map((plant, i) => (
                      <li key={i}>{plant}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="element-section">
          <h4>Pathways & Water Features</h4>
          <div className="elements-grid">
            {designData?.pathways.map((path, index) => (
              <div className="element-card" key={index}>
                <h5>{path.type}</h5>
                <p><strong>Material:</strong> {path.material}</p>
                <p><strong>Pattern:</strong> {path.pattern}</p>
                <p>{path.purpose}</p>
              </div>
            ))}
            
            {designData?.waterFeatures.map((feature, index) => (
              <div className="element-card" key={index}>
                <h5>{feature.type}</h5>
                <p><strong>Location:</strong> {feature.location}</p>
                <p>{feature.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="design-actions">
        <button 
          className="btn"
          onClick={() => navigate('/implement')}
        >
          View Implementation Guide
        </button>
      </div>
    </div>
  );
};

export default DesignViewer;
