import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImplementationGuide.css';

const ImplementationGuide = ({ designData }) => {
  const [activePhase, setActivePhase] = useState('planning');
  const [completedSteps, setCompletedSteps] = useState([]);
  
  const navigate = useNavigate();

  // Toggle step completion
  const toggleStepCompletion = (stepId) => {
    if (completedSteps.includes(stepId)) {
      setCompletedSteps(completedSteps.filter(id => id !== stepId));
    } else {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const totalSteps = implementationPhases.reduce(
      (total, phase) => total + phase.steps.length, 
      0
    );
    return Math.round((completedSteps.length / totalSteps) * 100);
  };

  // Mock implementation phases and steps
  const implementationPhases = [
    {
      id: 'planning',
      name: 'Planning Phase',
      description: 'Prepare your site and create a detailed implementation plan',
      steps: [
        {
          id: 'plan-1',
          name: 'Mark out zones',
          description: 'Use stakes and string to mark the boundaries of each planting zone',
          materials: ['Stakes', 'String', 'Measuring tape', 'Site plan printout'],
          estimatedTime: '2-3 hours'
        },
        {
          id: 'plan-2',
          name: 'Map water flow',
          description: 'Observe and mark how water naturally flows across your land',
          materials: ['Site plan', 'Marking flags', 'Level tool'],
          estimatedTime: '1-2 hours'
        },
        {
          id: 'plan-3',
          name: 'Create materials list',
          description: 'Compile a list of all plants, materials, and tools needed',
          materials: ['Design plan', 'Spreadsheet or notebook'],
          estimatedTime: '2-3 hours'
        }
      ]
    },
    {
      id: 'earthworks',
      name: 'Earthworks Phase',
      description: 'Shape the land to optimize water flow and create microclimates',
      steps: [
        {
          id: 'earth-1',
          name: 'Dig swales on contour',
          description: 'Create water-harvesting ditches that follow the contour of the land',
          materials: ['Shovel', 'Pick', 'Level', 'Wheelbarrow'],
          estimatedTime: '1-2 days'
        },
        {
          id: 'earth-2',
          name: 'Create pond',
          description: 'Excavate and line the pond in the northern section',
          materials: ['Shovel', 'Pond liner', 'Rocks', 'Aquatic plants'],
          estimatedTime: '2-3 days'
        },
        {
          id: 'earth-3',
          name: 'Build raised beds',
          description: 'Construct raised beds for the vegetable garden area',
          materials: ['Lumber or stones', 'Screws', 'Drill', 'Level', 'Soil mix'],
          estimatedTime: '1-2 days'
        }
      ]
    },
    {
      id: 'planting',
      name: 'Planting Phase',
      description: 'Plant trees, shrubs, and perennials according to your design',
      steps: [
        {
          id: 'plant-1',
          name: 'Plant trees and large shrubs',
          description: 'Start with the largest plants that form the backbone of your design',
          materials: ['Tree saplings', 'Shovel', 'Compost', 'Mulch', 'Water'],
          estimatedTime: '1-2 days'
        },
        {
          id: 'plant-2',
          name: 'Install understory plants',
          description: 'Add smaller shrubs and perennials beneath and around trees',
          materials: ['Shrubs', 'Perennials', 'Trowel', 'Compost', 'Mulch'],
          estimatedTime: '1-2 days'
        },
        {
          id: 'plant-3',
          name: 'Create herb spiral',
          description: 'Build and plant the herb spiral in the western section',
          materials: ['Stones or bricks', 'Soil mix', 'Herb plants', 'Mulch'],
          estimatedTime: '4-6 hours'
        }
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure Phase',
      description: 'Add pathways, irrigation, and other supporting elements',
      steps: [
        {
          id: 'infra-1',
          name: 'Create main pathways',
          description: 'Lay down wood chips for the main garden paths',
          materials: ['Wood chips', 'Shovel', 'Rake', 'Wheelbarrow', 'Landscape fabric (optional)'],
          estimatedTime: '1-2 days'
        },
        {
          id: 'infra-2',
          name: 'Install stepping stones',
          description: 'Place stepping stones for secondary access paths',
          materials: ['Stepping stones', 'Sand', 'Level', 'Rubber mallet'],
          estimatedTime: '3-4 hours'
        },
        {
          id: 'infra-3',
          name: 'Set up irrigation',
          description: 'Install drip irrigation systems for key planting areas',
          materials: ['Drip irrigation kit', 'Timer', 'Hose', 'Connectors'],
          estimatedTime: '1 day'
        }
      ]
    },
    {
      id: 'finishing',
      name: 'Finishing Phase',
      description: 'Add final touches and establish maintenance routines',
      steps: [
        {
          id: 'finish-1',
          name: 'Apply mulch',
          description: 'Mulch all planting areas to retain moisture and suppress weeds',
          materials: ['Organic mulch', 'Wheelbarrow', 'Rake'],
          estimatedTime: '1 day'
        },
        {
          id: 'finish-2',
          name: 'Install meditation space',
          description: 'Create the central meditation area with seating and features',
          materials: ['Bench or stones', 'Gravel or sand', 'Decorative elements'],
          estimatedTime: '4-6 hours'
        },
        {
          id: 'finish-3',
          name: 'Create maintenance schedule',
          description: 'Develop a seasonal maintenance plan for your garden',
          materials: ['Calendar', 'Notebook', 'Reference books or resources'],
          estimatedTime: '2-3 hours'
        }
      ]
    }
  ];

  // If no design data, prompt user to generate a design first
  if (!designData) {
    return (
      <div className="implementation-guide empty-state">
        <h2>No Design Available</h2>
        <p>Please scan your land and generate a design first.</p>
        <button className="btn" onClick={() => navigate('/scan')}>
          Scan Land
        </button>
      </div>
    );
  }

  return (
    <div className="implementation-guide">
      <h2>Implementation Guide</h2>
      
      <div className="progress-overview">
        <h3>Your Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        <p>{calculateProgress()}% Complete</p>
      </div>
      
      <div className="phases-tabs">
        {implementationPhases.map(phase => (
          <button 
            key={phase.id}
            className={`phase-tab ${activePhase === phase.id ? 'active' : ''}`}
            onClick={() => setActivePhase(phase.id)}
          >
            {phase.name}
          </button>
        ))}
      </div>
      
      <div className="phase-content">
        {implementationPhases.map(phase => (
          phase.id === activePhase && (
            <div key={phase.id} className="active-phase">
              <div className="phase-header">
                <h3>{phase.name}</h3>
                <p>{phase.description}</p>
              </div>
              
              <div className="steps-list">
                {phase.steps.map(step => (
                  <div 
                    key={step.id} 
                    className={`step-card ${completedSteps.includes(step.id) ? 'completed' : ''}`}
                  >
                    <div className="step-header">
                      <h4>{step.name}</h4>
                      <label className="checkbox-container">
                        <input 
                          type="checkbox"
                          checked={completedSteps.includes(step.id)}
                          onChange={() => toggleStepCompletion(step.id)}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    
                    <p className="step-description">{step.description}</p>
                    
                    <div className="step-details">
                      <div className="materials">
                        <h5>Materials Needed:</h5>
                        <ul>
                          {step.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="time-estimate">
                        <h5>Estimated Time:</h5>
                        <p>{step.estimatedTime}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
      
      <div className="seasonal-tips">
        <h3>Seasonal Maintenance Tips</h3>
        <div className="tips-grid">
          <div className="tip-card">
            <h4>Spring</h4>
            <ul>
              <li>Plant annual vegetables</li>
              <li>Prune fruit trees before bud break</li>
              <li>Divide perennials as needed</li>
              <li>Check and repair irrigation systems</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>Summer</h4>
            <ul>
              <li>Harvest vegetables and fruits regularly</li>
              <li>Maintain mulch layers during hot weather</li>
              <li>Monitor water needs during dry periods</li>
              <li>Prune for air circulation if needed</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>Fall</h4>
            <ul>
              <li>Plant trees and shrubs for establishment</li>
              <li>Collect seeds for next season</li>
              <li>Apply compost to beds</li>
              <li>Plant cover crops in annual beds</li>
            </ul>
          </div>
          <div className="tip-card">
            <h4>Winter</h4>
            <ul>
              <li>Prune dormant trees and shrubs</li>
              <li>Plan next year's additions</li>
              <li>Maintain tools and equipment</li>
              <li>Order seeds for spring planting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImplementationGuide;
