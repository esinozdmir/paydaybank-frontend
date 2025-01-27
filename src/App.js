import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Products from './components/Products';
import ProductDetails from "./components/ProductDetails";
import Profile from "./components/Profile";
import AddProduct from "./components/AddProduct";
import Layout from './components/Layout';

import HomePage from './pages/HomePage';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/products" /> : <LoginForm />
        } />

        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/products" /> : <RegisterForm />
        } />


        <Route path="/products/:id" element={
          isAuthenticated ? <ProductDetails /> : <Navigate to="/login" />
        } />


        <Route path="/products" element={isAuthenticated ?
          <Layout>
            <Products />
          </Layout> : <Navigate to="/login" />
        } />

        <Route path="/add-product" element={isAuthenticated ?
          <Layout>
            <AddProduct />
          </Layout> : <Navigate to="/login" />
        } />

        <Route path="/profile" element={isAuthenticated ?
          <Layout>
            <Profile />
          </Layout> : <Navigate to="/login" />
        } />


        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;