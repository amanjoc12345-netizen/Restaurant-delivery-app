import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { ToastProvider } from './context/AdminToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CategoryManagement from './pages/CategoryManagement';
import RecipeManagement from './pages/RecipeManagement';
import OrderManagement from './pages/OrderManagement';
import ProfileManagement from './pages/ProfileManagement';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
            <main className="flex-1 flex flex-col">
              <Routes>
                {/* Security authentication login */}
                <Route path="/login" element={<AdminLogin />} />

                {/* Secured Dashboard routes */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="recipes" element={<RecipeManagement />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="profile" element={<ProfileManagement />} />
                </Route>

                {/* Fallback routing */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </ToastProvider>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
