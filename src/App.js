import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import ScanLand from './components/ScanLand';
import DesignViewer from './components/DesignViewer';
import ImplementationGuide from './components/ImplementationGuide';
import Footer from './components/Footer';

function App() {
  // State to store user's land data
  const [landData, setLandData] = useState(null);
  // State to store generated design
  const [designData, setDesignData] = useState(null);

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route 
              path="/scan" 
              element={<ScanLand setLandData={setLandData} />} 
            />
            <Route 
              path="/design" 
              element={
                <DesignViewer 
                  landData={landData} 
                  designData={designData}
                  setDesignData={setDesignData} 
                />
              } 
            />
            <Route 
              path="/implement" 
              element={<ImplementationGuide designData={designData} />} 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
