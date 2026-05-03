import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Scoreboard from './components/Scoreboard';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Scoreboard />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;
