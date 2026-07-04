import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
          {/* Header Bar */}
          <Navbar />

          {/* Main Control Console Panel */}
          <main className="flex-1 flex flex-col">
            <Routes>
              {/* Secured Dashboard routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Security authentication login */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Fallback routing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer Bar */}
          <Footer />
        </div>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
