import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Homeowners from './components/Homeowners';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Hero />
            </>
          } />
          <Route path="/homeowners" element={<Homeowners />} />
          <Route path="/partners" element={
            <>
              <Header />
              <Partners />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
