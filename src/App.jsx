import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import BusinessSetup from './pages/BusinessSetup';
import BusinessSolutions from './pages/BusinessSolutions';
import Marketing from './pages/Marketing';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/business-setup" element={<BusinessSetup />} />
          <Route path="/business-solutions" element={<BusinessSolutions />} />
          <Route path="/marketing" element={<Marketing />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
