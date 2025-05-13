import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isLidarSupported, processLidarData } from '../utils/LidarUtils';
import { getClimateFromZipcode, getHardinessZone, getRecommendedPlants, getFengShuiRecommendations } from '../utils/ClimateUtils';
import './ScanLand.css';

const ScanLand = ({ setLandData }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [landSize, setLandSize] = useState('');
  const [climate, setClimate] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [hardinessZone, setHardinessZone] = useState('');
  const [soilType, setSoilType] = useState('');
  const [existingFeatures, setExistingFeatures] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [hasLidar, setHasLidar] = useState(false);
  const [isLidarScanning, setIsLidarScanning] = useState(false);
  const [lidarData, setLidarData] = useState(null);
  const [recommendedPlants, setRecommendedPlants] = useState(null);
  const [fengShuiElements, setFengShuiElements] = useState(null);
  
  const fileInputRef = useRef(null);
  const lidarContainerRef = useRef(null);
  const navigate = useNavigate();
  
  // Check if device supports LiDAR
  useEffect(() => {
    const checkLidarSupport = async () => {
      const supported = await isLidarSupported();
      setHasLidar(supported);
    };
    
    checkLidarSupport();
  }, []);

  // Handle file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle camera capture with LiDAR if available
  const captureImage = () => {
    if (hasLidar) {
      startLidarScan();
    } else {
      // For devices without LiDAR, use regular camera/file upload
      triggerFileInput();
    }
  };
  
  // Handle zipcode change
  const handleZipcodeChange = (e) => {
    const newZipcode = e.target.value;
    setZipcode(newZipcode);
    
    if (newZipcode.length >= 5) {
      // Auto-detect climate zone and hardiness zone from zipcode
      const detectedClimate = getClimateFromZipcode(newZipcode);
      const detectedHardinessZone = getHardinessZone(newZipcode);
      
      setClimate(detectedClimate);
      setHardinessZone(detectedHardinessZone);
      
      // Get plant recommendations based on climate and hardiness zone
      const plants = getRecommendedPlants(newZipcode, detectedClimate, detectedHardinessZone);
      setRecommendedPlants(plants);
      
      // Get feng shui element recommendations
      const fengShui = getFengShuiRecommendations(detectedClimate);
      setFengShuiElements(fengShui);
    }
  };
  
  // Start LiDAR scanning process
  const startLidarScan = () => {
    setIsLidarScanning(true);
    
    // In a real implementation, this would initialize WebXR and LiDAR scanning
    // For our MVP, we'll simulate the scanning process
    
    // Simulate scanning progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAnalysisProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate mock LiDAR data
        const mockLidarData = processLidarData(new ArrayBuffer(10), 640, 480);
        setLidarData(mockLidarData);
        
        // Set a placeholder image for the scan result
        setCapturedImage('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQwIiBoZWlnaHQ9IjQ4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNENBRjUwIiBvcGFjaXR5PSIwLjMiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjMzMzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5MaURBUiBTY2FuIENvbXBsZXRlPC90ZXh0Pjwvc3ZnPg==');
        
        setIsLidarScanning(false);
      }
    }, 200);
  };

  // Analyze land with or without LiDAR data
  const analyzeLand = () => {
    if (!capturedImage) {
      alert('Please upload or capture an image of your land first.');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setAnalysisProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate analysis data, incorporating LiDAR data if available
        const landData = {
          image: capturedImage,
          size: landSize,
          climate: climate,
          hardinessZone: hardinessZone,
          zipcode: zipcode,
          soilType: soilType,
          existingFeatures: existingFeatures.split(',').map(item => item.trim()),
          terrain: lidarData ? lidarData.terrainType : 'Slightly sloped',
          sunExposure: 'Mostly sunny with afternoon shade',
          waterSources: ['Natural rainfall', 'Nearby stream'],
          recommendedPlants: recommendedPlants || {
            trees: ['Apple', 'Maple', 'Oak', 'Cherry', 'Dogwood'],
            shrubs: ['Hydrangea', 'Lilac', 'Boxwood', 'Azalea', 'Rhododendron'],
            perennials: ['Lavender', 'Echinacea', 'Black-eyed Susan', 'Daylily', 'Hosta'],
            annuals: ['Marigold', 'Zinnia', 'Petunia', 'Sunflower', 'Cosmos'],
            groundcovers: ['Creeping Thyme', 'Sedum', 'Vinca', 'Pachysandra', 'Ajuga'],
            edibles: ['Tomato', 'Pepper', 'Lettuce', 'Herbs', 'Berries']
          },
          fengShuiElements: fengShuiElements || {
            water: {
              placement: 'North and East areas of the garden',
              plants: ['Ferns', 'Hostas', 'Astilbe', 'Japanese Iris', 'Water Lilies'],
              features: ['Small pond', 'Fountain', 'Birdbath', 'Rain garden']
            },
            wood: {
              placement: 'East and Southeast areas of the garden',
              plants: ['Trees', 'Shrubs', 'Tall Perennials', 'Vines', 'Bamboo'],
              features: ['Wooden arbors', 'Trellises', 'Raised beds']
            },
            fire: {
              placement: 'South area of the garden',
              plants: ['Red Flowers', 'Spiky Plants', 'Plants with Red Berries', 'Red Foliage'],
              features: ['Fire pit', 'Outdoor lighting', 'Red garden art']
            },
            earth: {
              placement: 'Center, Southwest and Northeast areas of the garden',
              plants: ['Low-growing Plants', 'Yellow and Orange Flowers', 'Square-shaped Plants', 'Edibles'],
              features: ['Stone pathways', 'Rock gardens', 'Terracotta containers']
            },
            metal: {
              placement: 'West and Northwest areas of the garden',
              plants: ['White Flowers', 'Round-leaf Plants', 'Silver or Gray Foliage', 'Aromatic Herbs'],
              features: ['Metal sculptures', 'Wind chimes', 'Garden arches']
            }
          }
        };
        
        // Add LiDAR-specific data if available
        if (lidarData) {
          landData.lidarData = {
            elevationPoints: lidarData.elevationPoints,
            contourLines: lidarData.contourLines,
            detectedFeatures: lidarData.features
          };
        }
        
        // Set the land data in the parent component
        setLandData(landData);
        
        // Navigate to design page
        setTimeout(() => {
          setIsAnalyzing(false);
          navigate('/design');
        }, 1000);
      }
    }, 200);
  };

  return (
    <div className="scan-land">
      <h2>Scan Your Land</h2>
      
      <div className="image-capture-section">
        <div className="image-container">
          {capturedImage ? (
            <img src={capturedImage} alt="Captured land" />
          ) : (
            <div className="placeholder">
              <p>No image captured yet</p>
            </div>
          )}
          {/* Container for LiDAR visualization */}
          <div ref={lidarContainerRef} className="lidar-container"></div>
        </div>
        
        <div className="capture-buttons">
          <button className="btn" onClick={captureImage}>
            {hasLidar ? 'Scan with LiDAR' : 'Take Photo'}
          </button>
          <button className="btn btn-secondary" onClick={triggerFileInput}>
            Upload Image
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
        </div>
        
        {hasLidar ? (
          <div className="lidar-info">
            <p><strong>LiDAR Detected!</strong> Your device supports advanced 3D scanning.</p>
            <p>Using LiDAR will provide more accurate terrain analysis and better design recommendations.</p>
          </div>
        ) : (
          <div className="lidar-instructions">
            <h4>Don't have LiDAR?</h4>
            <p>For best results, consider one of these options:</p>
            <ul>
              <li>Use a device with LiDAR (iPhone 12 Pro or newer, iPad Pro 2020 or newer)</li>
              <li>Take multiple photos from different angles of your land</li>
              <li>Include photos that clearly show elevation changes and existing features</li>
              <li>If available, upload a topographic map or survey of your property</li>
            </ul>
          </div>
        )}
      </div>
      
      <div className="land-details-form">
        <h3>Land Details</h3>
        <p>Please provide additional information about your land to improve our analysis</p>
        
        <div className="form-control">
          <label>Approximate Land Size (in sq ft or acres)</label>
          <input 
            type="text" 
            value={landSize} 
            onChange={(e) => setLandSize(e.target.value)} 
            placeholder="e.g., 1/4 acre or 10,000 sq ft" 
          />
        </div>
        
        <div className="form-control">
          <label>Zipcode (for climate detection)</label>
          <input 
            type="text" 
            value={zipcode}
            onChange={handleZipcodeChange} 
            placeholder="Enter your zipcode" 
            maxLength="10"
          />
        </div>
        
        <div className="form-control">
          <label>Detected Climate Zone</label>
          <input 
            type="text" 
            value={climate} 
            readOnly 
            className="detected-climate"
            placeholder="Will be detected from zipcode"
          />
          <small className="field-note">Climate will be automatically detected from your zipcode</small>
        </div>
        
        <div className="form-control">
          <label>Plant Hardiness Zone</label>
          <input 
            type="text" 
            value={hardinessZone} 
            readOnly 
            className="detected-climate"
            placeholder="Will be detected from zipcode"
          />
          <small className="field-note">USDA hardiness zone determines which plants will thrive in your area</small>
        </div>
        
        <div className="form-control">
          <label>Soil Type</label>
          <select value={soilType} onChange={(e) => setSoilType(e.target.value)}>
            <option value="">Select soil type</option>
            <option value="clay">Clay</option>
            <option value="sandy">Sandy</option>
            <option value="silty">Silty</option>
            <option value="peaty">Peaty</option>
            <option value="chalky">Chalky</option>
            <option value="loamy">Loamy</option>
          </select>
        </div>
        
        <div className="form-control">
          <label>Existing Features (comma separated)</label>
          <textarea 
            value={existingFeatures} 
            onChange={(e) => setExistingFeatures(e.target.value)} 
            placeholder="e.g., oak tree, pond, stone wall, vegetable garden"
          />
        </div>
      </div>
      
      {isLidarScanning ? (
        <div className="analysis-progress">
          <h3>LiDAR Scanning in Progress...</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <p>{analysisProgress}% Complete</p>
          <p className="scan-tip">Hold your device steady and slowly pan across your landscape</p>
        </div>
      ) : isAnalyzing ? (
        <div className="analysis-progress">
          <h3>Analyzing Your Land...</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${analysisProgress}%` }}
            ></div>
          </div>
          <p>{analysisProgress}% Complete</p>
          {lidarData && (
            <p className="analysis-detail">Processing terrain data with {lidarData.elevationPoints.length} elevation points</p>
          )}
        </div>
      ) : (
        <button className="btn analyze-btn" onClick={analyzeLand}>
          Analyze Land
        </button>
      )}
    </div>
  );
};

export default ScanLand;
