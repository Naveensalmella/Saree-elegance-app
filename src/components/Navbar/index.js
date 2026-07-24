import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { FaRegHeart } from "react-icons/fa";
import { BsCartCheck } from "react-icons/bs";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GiLotus } from "react-icons/gi";
import { IoIosSearch } from "react-icons/io";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useTheme } from "../ThemeContext";

const Navbar = () => {
  const { mode, toogleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishCount, setWishCount] = useState(0);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);


  useEffect(() => {
    setMenuOpen(false);
  }, [location]);


  useEffect(() => {
    const syncCounts = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const wish = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      setCartCount(cart.reduce((sum, item) => sum + (item.quantity || 1), 0));
      setWishCount(wish.length);
      setUser(userData);
    };

    syncCounts();


    window.addEventListener("storage", syncCounts);


    window.addEventListener("cartUpdated", syncCounts);
    window.addEventListener("wishlistUpdated", syncCounts);

    /* Poll every 2 seconds as fallback */
    const interval = setInterval(syncCounts, 2000);

    return () => {
      window.removeEventListener("storage", syncCounts);
      window.removeEventListener("cartUpdated", syncCounts);
      window.removeEventListener("wishlistUpdated", syncCounts);
      clearInterval(interval);
    };
  }, [location]);


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };


  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = user
    ? [
      { to: "/", label: "Home" },
      { to: "/products", label: "Products" },
      { to: "/cart", label: "Cart" },
      { to: "/orders", label: "Orders" },
      { to: "/wishlist", label: "Wishlist" },
    ]
    : [{ to: "/", label: "Home" }];

  return (
    <>

      <div className="navbar-top">
        {/* Announcement bar */}
        <div className="announcement-bar">
          <p>
            ✨ Free Shipping on orders above ₹999 | Use code{" "}
            <strong>ETHNIC30</strong> for 30% off
          </p>
        </div>


        <nav className="up-nav-container">
          <Link to="/" className="brand">
            <GiLotus className="title-icon" />
            <div className="brand-text">
              <h1 className="main-title">Saree Elegance</h1>
              <span className="brand-tagline">Tradition Meets Trend</span>
            </div>
          </Link>

          <form
            className={`search-wrapper ${searchFocused ? "focused" : ""}`}
            onSubmit={handleSearch}
          >
            <IoIosSearch className="search-icon-left" />
            <input
              type="search"
              placeholder="Search sarees, kurtis, lehengas..."
              className="nav-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button type="submit" className="nav-searchbtn">Search</button>
          </form>

          <div className="nav-right">
            {user && (
              <>
                <Link to="/wishlist" className="icon-link" title="Wishlist">
                  <FaRegHeart />
                  {wishCount > 0 && <span className="icon-badge">{wishCount}</span>}
                  <span className="icon-label">Wishlist</span>
                </Link>
                <Link to="/cart" className="icon-link" title="Cart">
                  <BsCartCheck />
                  {cartCount > 0 && <span className="icon-badge">{cartCount}</span>}
                  <span className="icon-label">Cart</span>
                </Link>
              </>
            )}

            {user ? (
              <Link to="/profile" className="icon-link user-btn" title="My Profile">
                <IoPersonCircleOutline />
                <span className="icon-label">{user.username || "Account"}</span>
              </Link>
            ) : (
              <Link to="/login" className="icon-link" title="Account">
                <IoPersonCircleOutline />
                <span className="icon-label">Account</span>
              </Link>
            )}

            <button
              className="theme-toggle"
              onClick={toogleTheme}
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              {mode === "light" ? <BsMoonStarsFill /> : <BsSunFill />}
            </button>

            <button
              className="hamburger"
              onClick={() => setMenuOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <HiX /> : <HiOutlineMenuAlt3 />}
            </button>
          </div>
        </nav>
      </div>


      <nav className={`nav-container ${menuOpen ? "open" : ""} ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-links">
          {navLinks.map((link) => (
            <Link
              to={link.to}
              className={`nav-element ${location.pathname === link.to ? "active" : ""
                }`}
              key={link.to}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="nav-auth">
          {user ? (
            <button className="nav-logout-btn" onClick={handleLogout}>
              <FiLogOut /> Logout
            </button>
          ) : (
            <>
              <Link to="/register" className="nav-element">Sign Up</Link>
              <Link to="/login" className="nav-auth-btn">Login</Link>
            </>
          )}
        </div>
      </nav>


      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;