import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Products from "./components/Products";
import Cart from "./components/Cart";
import Wishlist from "./components/Wishlist";
import Orders from "./components/Orders";
import Footer from "./components/Footer";
import SingleProduct from "./components/SingleProduct";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import ProtectedRouter from "./components/ProtectedRouter";

const App = () => {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<ProtectedRouter><Home /></ProtectedRouter>} />
        <Route path="/products" element={<ProtectedRouter><Products /></ProtectedRouter>} />
        <Route path="/products/:id" element={<ProtectedRouter><SingleProduct /></ProtectedRouter>} />
        <Route path="/cart" element={<ProtectedRouter><Cart /></ProtectedRouter>} />
        <Route path="/wishlist" element={<ProtectedRouter><Wishlist /></ProtectedRouter>} />
        <Route path="/orders" element={<ProtectedRouter><Orders /></ProtectedRouter>} />
        <Route path="/checkout" element={<ProtectedRouter><Checkout /></ProtectedRouter>} />
        <Route path="/profile" element={<ProtectedRouter><Profile /></ProtectedRouter>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>

      <Footer />
    </Router>
  );
};

export default App;