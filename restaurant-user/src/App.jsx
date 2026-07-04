import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { SearchProvider } from './context/SearchContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import CategoryRecipes from './pages/CategoryRecipes';
import RecipeDetails from './pages/RecipeDetails';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
                {/* Global Header Navigation */}
                <Navbar />

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col">
                  <Routes>
                    {/* Protected Internal Dashboard */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* New Protected Routes */}
                    <Route
                      path="/category/:id"
                      element={
                        <ProtectedRoute>
                          <CategoryRecipes />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/recipe/:id"
                      element={
                        <ProtectedRoute>
                          <RecipeDetails />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <Orders />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />

                    {/* Authentication Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Redirect any other routes to Dashboard */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>

                {/* Global Footer */}
                <Footer />
              </div>
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
