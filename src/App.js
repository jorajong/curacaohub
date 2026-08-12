import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import WoningenPage from './pages/WoningenPage';
import LoginPage from './pages/LoginPage';
import PropertyFormPage from './pages/PropertyFormPage';
import KantoorOverzichtPage from './pages/KantoorOverzichtPage';
import VerhuurdersPage from './pages/VerhuurdersPage';
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
          <Route path="/woningen" element={<WoningenPage />} />
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
          <Route
            path="/beheer/kantoor-overzicht"
            element={
              <ProtectedRoute>
                <KantoorOverzichtPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beheer/verhuurders"
            element={
              <ProtectedRoute>
                <VerhuurdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/beheer/wijzig-woning/:id"
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
