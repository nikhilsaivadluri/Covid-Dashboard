import React from 'react';
//import logo from './logo.svg';
import './App.css';
import './Fontawesome';
//import './components/dashboard.css';
import NationalDashboard from './components/national-dashboard';

function App() {
  return (
    <div className="dashboard-content">
    <div className="header">
    <h1>Covid-19 Dashboard</h1>
    </div>  
    <NationalDashboard></NationalDashboard>
    </div> 
  );
}

export default App;
