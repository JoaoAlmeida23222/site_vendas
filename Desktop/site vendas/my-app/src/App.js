import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Home />} />
        <Route path="/sobre" element={<Home />} />
        <Route path="/contato" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;