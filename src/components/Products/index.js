import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Product.css";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { BsCartPlus, BsCheckCircleFill } from "react-icons/bs";
import { IoFilterSharp } from "react-icons/io5";
import { HiOutlineSearch } from "react-icons/hi";


const SUPABASE_URL =
  "https://wqjaxtdxzjmlsaeoxyhq.supabase.co/rest/v1/products";
const SUPABASE_HEADERS = {
  apikey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
};


const getBadge = (product, index) => {
  if (index < 3) return "Bestseller";
  if (product.stock <= 5 && product.stock > 0) return "Few Left";
  if (index >= (product._total || 10) - 4) return "New";
  if (index % 5 === 0) return "Top Rated";
  return null;
};


const getWishlist = () => JSON.parse(localStorage.getItem("wishlist") || "[]");
const saveWishlist = (list) =>
  localStorage.setItem("wishlist", JSON.stringify(list));

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (list) => localStorage.setItem("cart", JSON.stringify(list));


const SkeletonCard = () => (
  <div className="p-skeleton-card">
    <div className="p-skeleton-img shimmer" />
    <div className="p-skeleton-body">
      <div className="p-skeleton-line shimmer" style={{ width: "80%" }} />
      <div className="p-skeleton-line shimmer" style={{ width: "50%" }} />
      <div className="p-skeleton-line shimmer" style={{ width: "35%" }} />
    </div>
  </div>
);


const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState(getWishlist());
  const [cartItems, setCartItems] = useState(getCart());
  const [addedToCart, setAddedToCart] = useState({});


  const [searchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";


  const [search, setSearch] = useState(urlSearch);
  const [sortBy, setSortBy] = useState("default");
  const [priceRange, setPriceRange] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);


  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(SUPABASE_URL, {
          headers: SUPABASE_HEADERS,
        });
        setProducts(res.data);
      } catch (err) {
        console.log("Something went wrong", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);


  const toggleWishlist = (product) => {
    const exists = wishlist.find((w) => w.id === product.id);
    let updated;
    if (exists) {
      updated = wishlist.filter((w) => w.id !== product.id);
    } else {
      updated = [...wishlist, product];
    }
    setWishlist(updated);
    saveWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
  };

  const isWishlisted = (id) => wishlist.some((w) => w.id === id);


  const addToCart = (product) => {
    const existing = cartItems.find((c) => c.id === product.id);
    let updated;
    if (existing) {
      updated = cartItems.map((c) =>
        c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
      );
    } else {
      updated = [...cartItems, { ...product, quantity: 1 }];
    }
    setCartItems(updated);
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));


    setAddedToCart((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedToCart((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };


  let filtered = [...products];


  if (urlCategory) {
    const cat = urlCategory.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(cat) ||
        (p.category || "").toLowerCase().includes(cat) ||
        (p.description || "").toLowerCase().includes(cat)
    );
  }


  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
    );
  }


  if (priceRange === "under500") filtered = filtered.filter((p) => p.price < 500);
  else if (priceRange === "500to1000")
    filtered = filtered.filter((p) => p.price >= 500 && p.price <= 1000);
  else if (priceRange === "1000to2000")
    filtered = filtered.filter((p) => p.price >= 1000 && p.price <= 2000);
  else if (priceRange === "above2000")
    filtered = filtered.filter((p) => p.price > 2000);


  if (stockFilter === "instock") filtered = filtered.filter((p) => p.stock > 0);
  else if (stockFilter === "outofstock")
    filtered = filtered.filter((p) => p.stock === 0);

 
  if (sortBy === "low") filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === "high") filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === "name")
    filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

  return (
    <div className="products-page">
      
      <div className="products-hero">
        <h1>Our Collection</h1>
        <p>Handpicked ethnic wear for every occasion</p>
      </div>

      
      <div className="products-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-search">
            <HiOutlineSearch className="toolbar-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            className={`filter-toggle ${showFilters ? "active" : ""}`}
            onClick={() => setShowFilters((p) => !p)}
          >
            <IoFilterSharp /> Filters
          </button>
        </div>
        <div className="toolbar-right">
          <span className="result-count">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""}
          </span>
          <select
            className="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="default">Sort by: Default</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
            <option value="name">Name: A-Z</option>
          </select>
        </div>
      </div>

     
      {showFilters && (
        <div className="filters-bar">
          <div className="filter-group">
            <label>Price Range</label>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
            >
              <option value="all">All Prices</option>
              <option value="under500">Under ₹500</option>
              <option value="500to1000">₹500 – ₹1,000</option>
              <option value="1000to2000">₹1,000 – ₹2,000</option>
              <option value="above2000">Above ₹2,000</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Availability</label>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="instock">In Stock</option>
              <option value="outofstock">Out of Stock</option>
            </select>
          </div>
          <button
            className="clear-filters"
            onClick={() => {
              setPriceRange("all");
              setStockFilter("all");
              setSearch("");
              setSortBy("default");
            }}
          >
            Clear All
          </button>
        </div>
      )}

     
      {error && <p className="products-error">{error}</p>}

      
      <div className="products-grid-page">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : filtered.length === 0
            ? (
              <div className="no-results">
                <h3>No products found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )
            : filtered.map((item, index) => {
              const badge = getBadge(
                { ...item, _total: products.length },
                index
              );
              const wishlisted = isWishlisted(item.id);
              const justAdded = addedToCart[item.id];

              return (
                <div className="p-card" key={item.id}>
                 
                  <div className="p-card-img-wrap">
                    <Link to={`/products/${item.id}`}>
                      <img
                        src={item.image}
                        alt={item.title}
                        className="p-card-img"
                        loading="lazy"
                      />
                    </Link>

                    
                    {badge && (
                      <span
                        className={`p-badge p-badge-${badge
                          .toLowerCase()
                          .replace(" ", "")}`}
                      >
                        {badge}
                      </span>
                    )}

                   
                    <button
                      className={`p-wishlist-btn ${wishlisted ? "active" : ""}`}
                      onClick={() => toggleWishlist(item)}
                      title={
                        wishlisted
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      {wishlisted ? <FaHeart /> : <FaRegHeart />}
                    </button>

                   
                    {item.stock === 0 && (
                      <div className="p-outofstock-overlay">
                        <span>Out of Stock</span>
                      </div>
                    )}
                  </div>

                 
                  <div className="p-card-body">
                    <Link
                      to={`/products/${item.id}`}
                      className="p-card-title-link"
                    >
                      <h3 className="p-card-title">{item.title}</h3>
                    </Link>
                    <p className="p-card-desc">{item.description}</p>
                    <div className="p-card-footer">
                      <div className="p-card-price-stock">
                        <span className="p-card-price">
                          ₹{item.price?.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`p-card-stock ${item.stock > 0 ? "instock" : "out"
                            }`}
                        >
                          {item.stock > 0
                            ? `${item.stock} in stock`
                            : "Out of stock"}
                        </span>
                      </div>
                      <button
                        className={`p-add-cart-btn ${justAdded ? "added" : ""}`}
                        onClick={() => addToCart(item)}
                        disabled={item.stock === 0}
                      >
                        {justAdded ? (
                          <>
                            <BsCheckCircleFill /> Added
                          </>
                        ) : (
                          <>
                            <BsCartPlus /> Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Products;