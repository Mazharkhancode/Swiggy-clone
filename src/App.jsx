import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Restaurants from './pages/Restaurants';
import RestaurantDetails from './pages/RestaurantDetails';
import CategoryProducts from './pages/CategoryProducts';
import DealsProducts from './pages/DealsProducts';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Addresses from './pages/Addresses';
import Settings from './pages/Settings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminOrders from './pages/admin/AdminOrders';
import TrackOrder from './pages/TrackOrder';
import Partner from './pages/Partner';
import PartnerDashboard from './pages/PartnerDashboard';
import ScrollToTop from './utils/ScrollToTop';
import { AuthModalProvider } from './context/AuthModalContext';
import { CartProvider } from './context/CartContext';
import AuthModal from './components/AuthModal';

function App() {
  return (
    <AuthModalProvider>
      <CartProvider>
        <BrowserRouter>
          <ScrollToTop />
          <AuthModal />
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="restaurants" element={<Restaurants />} />
              <Route path="restaurant/:id" element={<RestaurantDetails />} />
              <Route path="category/:categoryName" element={<CategoryProducts />} />
              <Route path="deals/:dealType" element={<DealsProducts />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-success" element={<OrderSuccess />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="orders" element={<Orders />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="addresses" element={<Addresses />} />
              <Route path="settings" element={<Settings />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/restaurants" element={<AdminRestaurants />} />
              <Route path="admin/orders" element={<AdminOrders />} />
              <Route path="track-order/:orderId" element={<TrackOrder />} />
              <Route path="partner" element={<Partner />} />
              <Route path="partner/dashboard" element={<PartnerDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthModalProvider>
  );
}

export default App;