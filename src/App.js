import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './components/Home';
import ManageMovies from './components/ManageMovies';
import ManageUsers from './components/ManageUsers';
import ManageShoppeLinks from './components/ManageShoppeLinks';
import ManagePayments from './components/ManagePayments';
import './style.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="app">
          <Header />
          <div className="main-content">
            <Sidebar />
            <div className="content">
              <Routes>
                <Route exact path="/" element={<Home />} />
                <Route path="/manage-movies" element={<ManageMovies />} />
                <Route path="/manage-users" element={<ManageUsers />} />
                <Route path="/manage-shoppe-links" element={<ManageShoppeLinks />} />
                <Route path="/manage-payments" element={<ManagePayments />} />
              </Routes>
            </div>
          </div>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
