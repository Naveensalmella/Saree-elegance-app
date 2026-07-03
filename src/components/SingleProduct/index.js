import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SingleProduct.css";
import { FaRegHeart, FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { BsCartPlus, BsCheckCircleFill, BsTruck, BsArrowReturnLeft, BsShieldCheck } from "react-icons/bs";
import { HiOutlineChevronLeft } from "react-icons/hi";


const SUPABASE_URL =
  "https://wqjaxtdxzjmlsaeoxyhq.supabase.co/rest/v1/products";
const SUPABASE_HEADERS = {
  apikey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
};


const getWishlist = () => JSON.parse(localStorage.getItem("wishlist") || "[]");
const saveWishlist = (list) =>
  localStorage.setItem("wishlist", JSON.stringify(list));
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (list) => localStorage.setItem("cart", JSON.stringify(list));


const StarRating = ({ rating = 4.2 }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) stars.push(<FaStar key={i} />);
    else if (i - 0.5 <= rating) stars.push(<FaStarHalfAlt key={i} />);
    else stars.push(<FaRegStar key={i} />);
  }
  return (
    <div className="sp-stars">
      {stars}
      <span className="sp-rating-num">{rating}</span>
      <span className="sp-rating-count">(128 reviews)</span>
    </div>
  );
};


const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [imgZoomed, setImgZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${SUPABASE_URL}?id=eq.${id}`, {
          headers: SUPABASE_HEADERS,
        });
        if (res.data.length > 0) {
          setProduct(res.data[0]);
          /* Check wishlist */
          const wl = getWishlist();
          setWishlisted(wl.some((w) => w.id === res.data[0].id));
        }

        
        const allRes = await axios.get(SUPABASE_URL, {
          headers: SUPABASE_HEADERS,
        });
        const others = allRes.data
          .filter((p) => p.id !== parseInt(id))
          .slice(0, 4);
        setRelatedProducts(others);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

 
  const toggleWishlist = () => {
    const wl = getWishlist();
    let updated;
    if (wishlisted) {
      updated = wl.filter((w) => w.id !== product.id);
    } else {
      updated = [...wl, product];
    }
    saveWishlist(updated);
    window.dispatchEvent(new Event("wishlistUpdated"));
    setWishlisted(!wishlisted);
  };

 
  const handleAddToCart = () => {
    const cart = getCart();
    const existing = cart.find((c) => c.id === product.id);
    let updated;
    if (existing) {
      updated = cart.map((c) =>
        c.id === product.id
          ? { ...c, quantity: c.quantity + quantity }
          : c
      );
    } else {
      updated = [...cart, { ...product, quantity }];
    }
    saveCart(updated);
    window.dispatchEvent(new Event("cartUpdated"));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="sp-loading">
        <div className="sp-loading-spinner" />
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="sp-not-found">
        <h2>Product not found</h2>
        <Link to="/products" className="sp-back-link">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="sp-page">
      {/* Breadcrumb */}
      <div className="sp-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span className="sp-crumb-current">{product.title}</span>
      </div>

      
      <div className="sp-main">
       
        <div className="sp-image-section">
          <button className="sp-back-btn" onClick={() => navigate(-1)}>
            <HiOutlineChevronLeft /> Back
          </button>
          <div
            className={`sp-image-wrapper ${imgZoomed ? "zoomed" : ""}`}
            onClick={() => setImgZoomed((z) => !z)}
            title="Click to zoom"
          >
            <img src={product.image} alt={product.title} />
          </div>
        </div>

        
        <div className="sp-details">
          <h1 className="sp-title">{product.title}</h1>

          <StarRating />

          <div className="sp-price-section">
            <span className="sp-price">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            <span className="sp-tax-note">Inclusive of all taxes</span>
          </div>

          <p className="sp-description">{product.description}</p>

          
          <div className="sp-stock-info">
            {product.stock > 0 ? (
              <span className="sp-instock">
                ✓ In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="sp-outofstock">✕ Out of Stock</span>
            )}
          </div>

         
          {product.stock > 0 && (
            <div className="sp-quantity-row">
              <label>Quantity:</label>
              <div className="sp-quantity-picker">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="sp-qty-value">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stock, q + 1))
                  }
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
            </div>
          )}

          
          <div className="sp-actions">
            <button
              className={`sp-add-cart ${addedToCart ? "added" : ""}`}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {addedToCart ? (
                <>
                  <BsCheckCircleFill /> Added to Cart
                </>
              ) : (
                <>
                  <BsCartPlus /> Add to Cart
                </>
              )}
            </button>
            <button
              className="sp-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
            <button
              className={`sp-wish-btn ${wishlisted ? "active" : ""}`}
              onClick={toggleWishlist}
            >
              {wishlisted ? <FaHeart /> : <FaRegHeart />}
            </button>
          </div>

          
          <div className="sp-trust-badges">
            <div className="sp-trust-item">
              <BsTruck className="sp-trust-icon" />
              <div>
                <strong>Free Shipping</strong>
                <span>On orders above ₹999</span>
              </div>
            </div>
            <div className="sp-trust-item">
              <BsArrowReturnLeft className="sp-trust-icon" />
              <div>
                <strong>Easy Returns</strong>
                <span>7-day return policy</span>
              </div>
            </div>
            <div className="sp-trust-item">
              <BsShieldCheck className="sp-trust-icon" />
              <div>
                <strong>Secure Payment</strong>
                <span>100% protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      {relatedProducts.length > 0 && (
        <div className="sp-related">
          <h2>You May Also Like</h2>
          <div className="sp-related-grid">
            {relatedProducts.map((item) => (
              <Link
                to={`/products/${item.id}`}
                className="sp-related-card"
                key={item.id}
              >
                <div className="sp-related-img-wrap">
                  <img src={item.image} alt={item.title} loading="lazy" />
                </div>
                <div className="sp-related-info">
                  <h4>{item.title}</h4>
                  <span>₹{item.price?.toLocaleString("en-IN")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;