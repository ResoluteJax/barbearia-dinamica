import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Scheduler from './components/Scheduler/Scheduler';
import Login from './pages/Login';
import ProductsPage from './pages/ProductsPage';
import PortfolioPage from './pages/PortfolioPage';
import Dashboard from './pages/Dashboard';
import ManageProducts from './pages/admin/ManageProducts';
import ManagePortfolio from './pages/admin/ManagePortfolio';
import ChangePassword from './pages/admin/ChangePassword';
import ManageReviews from './pages/admin/ManageReviews';
import AddProduct from './pages/admin/AddProduct';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.scss';
import Footer from './components/Footer/Footer';



function App() {
  return (
    <div className="App">
      <Navbar />

      <main>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Scheduler />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas */}
          <Route 
            path="/admin/dashboard" 
            element={ <ProtectedRoute><Dashboard /></ProtectedRoute> } 
          />
          <Route 
            path="/admin/products" 
            element={ <ProtectedRoute><ManageProducts /></ProtectedRoute> } 
          />
          <Route 
            path="/admin/products/new" 
            element={ <ProtectedRoute><AddProduct /></ProtectedRoute> } 
          />
          <Route 
            path="/admin/portfolio" 
            element={ <ProtectedRoute><ManagePortfolio /></ProtectedRoute> } 
          />
          <Route 
            path="/admin/reviews" 
            element={ <ProtectedRoute><ManageReviews /></ProtectedRoute> } 
          />
          <Route 
            path="/admin/change-password" 
            element={ <ProtectedRoute><ChangePassword /></ProtectedRoute> } 
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;