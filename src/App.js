import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import PropertyFormPage from './pages/PropertyFormPage';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
 
function App() {
  return (
    <Router>
      <Header />
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/beheer/nieuwe-woning"
            element={
              <ProtectedRoute>
                <PropertyFormPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
      <Footer />
    </Router>
  );
}
 
export default App;