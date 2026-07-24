import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import HeroSlider from "../HeroSlider/HeroSlider";
import FallbackImage from "../common/FallbackImage";

/* ──────────────────────────────────────────────
   SUPABASE CONFIG
   ────────────────────────────────────────────── */
const SUPABASE_URL =
  "https://wqjaxtdxzjmlsaeoxyhq.supabase.co/rest/v1/products";
const SUPABASE_HEADERS = {
  apikey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
  Authorization:
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
};

/* ──────────────────────────────────────────────
   STATIC DATA
   ────────────────────────────────────────────── */
const features = [
  { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999" },
  { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: "🔒", title: "Secure Payment", desc: "100% protected checkout" },
  { icon: "✨", title: "Authentic Craft", desc: "Handpicked quality fabrics" },
];

const categories = [
  {
    name: "Sarees",
    image:
      "https://images.unsplash.com/photo-1614886137926-0e6a4f2dfc22?w=600&q=80",
    link: "/products?category=sarees",
    desc: "Timeless drapes",
  },
  {
    name: "Kurtis",
    image:
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&q=80",
    link: "/products?category=kurtis",
    desc: "Daily elegance",
  },
  {
    name: "Lehengas",
    image:
      "https://images.unsplash.com/photo-1604502071830-b5e8dce44f83?w=600&q=80",
    link: "/products?category=lehengas",
    desc: "Grand occasions",
  },
  {
    name: "Indo-Western",
    image:
      "https://images.unsplash.com/photo-1605902711622-cfb43c4437b1?w=600&q=80",
    link: "/products?category=indo-western",
    desc: "Fusion fashion",
  },
];

const testimonials = [
  {
    name: "Priya S.",
    text: "The Banarasi saree I ordered was absolutely stunning — the zari work was even more beautiful in person!",
    rating: 5,
  },
  {
    name: "Anjali M.",
    text: "Fast delivery and the kurti fit was perfect. The fabric quality is incredible for the price.",
    rating: 5,
  },
  {
    name: "Meera K.",
    text: "Wore their lehenga to my cousin's wedding and got so many compliments. Felt like a boutique purchase!",
    rating: 4,
  },
];

/* ──────────────────────────────────────────────
   SUB-COMPONENTS
   ────────────────────────────────────────────── */

/* Product Card */
const ProductCard = ({ product, index }) => {
  const [hovered, setHovered] = useState(false);
  const name = product.title || product.name || "Product";
  const price = product.price || 0;
  const oldPrice = product.old_price || product.original_price || null;
  const image = product.image || product.image_url || product.thumbnail || "";

  return (
    <Link
      to={`/products/${product.id}`}
      className="product-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="product-img-wrap">
        <FallbackImage src={image} alt={name} index={index} loading="lazy" />
        <div className={`product-actions ${hovered ? "visible" : ""}`}>
          <button className="action-btn" title="Add to wishlist">♡</button>
          <button className="action-btn" title="Quick view">⤢</button>
        </div>
      </div>
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <div className="product-price">
          <span className="current-price">₹{price.toLocaleString("en-IN")}</span>
          {oldPrice && (
            <span className="old-price">₹{oldPrice.toLocaleString("en-IN")}</span>
          )}
          {oldPrice && (
            <span className="discount">
              {Math.round((1 - price / oldPrice) * 100)}% off
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* Skeleton Loader */
const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton-img shimmer" />
    <div className="skeleton-info">
      <div className="skeleton-line shimmer" style={{ width: "75%" }} />
      <div className="skeleton-line shimmer" style={{ width: "45%" }} />
    </div>
  </div>
);

/* Countdown Timer */
const CountdownTimer = () => {
  const [time, setTime] = useState({ h: 11, m: 45, s: 30 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else if (m > 0) { m--; s = 59; }
        else if (h > 0) { h--; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <div className="countdown">
      <div className="time-box">
        <span className="time-num">{pad(time.h)}</span>
        <span className="time-label">Hours</span>
      </div>
      <span className="time-sep">:</span>
      <div className="time-box">
        <span className="time-num">{pad(time.m)}</span>
        <span className="time-label">Min</span>
      </div>
      <span className="time-sep">:</span>
      <div className="time-box">
        <span className="time-num">{pad(time.s)}</span>
        <span className="time-label">Sec</span>
      </div>
    </div>
  );
};

/* Stars */
const Stars = ({ count }) => (
  <div className="stars">
    {"★".repeat(count)}{"☆".repeat(5 - count)}
  </div>
);


const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(SUPABASE_URL, { headers: SUPABASE_HEADERS });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

 
  const trending = products.slice(0, 8);
  const newArrivals = products.slice(8, 12);

  return (
    <main className="home">

      
      <HeroSlider />

      
      <div className="miniBanner1-img">
        <FallbackImage src="/miniBanner1.jpg" alt="Festive collection banner" />
      </div>

      
      <section className="features-bar">
        {features.map((f, i) => (
          <div className="feature-item" key={i}>
            <span className="feature-icon">{f.icon}</span>
            <div>
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      
      <section className="section categories-section">
        <div className="section-header">
          <h2>Shop by Category</h2>
          <p className="section-sub">From timeless classics to contemporary fusion</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <Link to={cat.link} className="category-card" key={cat.name}>
              <FallbackImage src={cat.image} alt={cat.name} index={i} loading="lazy" />
              <div className="category-overlay">
                <span className="category-name">{cat.name}</span>
                <span className="category-desc">{cat.desc}</span>
                <span className="category-cta">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      
      <section className="section">
        <div className="section-header">
          <h2>Trending Now</h2>
          <Link to="/products" className="view-all">View All →</Link>
        </div>

        {error && <p className="error-msg">Could not load products — {error}</p>}

        <div className="products-grid">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : trending.map((p, i) => <ProductCard product={p} index={i} key={p.id} />)}
        </div>
      </section>

      
      <section className="deal-banner">
        <div className="deal-content">
          <span className="deal-tag">Limited Time Offer</span>
          <h2 className="deal-title">Flat 30% Off on Festive Collection</h2>
          <p className="deal-desc">
            Use code <strong>ETHNIC30</strong> at checkout. Hurry, offer ends soon!
          </p>
          <CountdownTimer />
          <Link to="/products" className="deal-cta">Shop the Sale →</Link>
        </div>
      </section>

      
      {newArrivals.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Just Landed</h2>
            <Link to="/products" className="view-all">View All →</Link>
          </div>
          <div className="products-grid four-col">
            {newArrivals.map((p, i) => (
              <ProductCard product={p} index={i} key={p.id} />
            ))}
          </div>
        </section>
      )}

      
      <section className="promo-split">
        <div className="promo-card">
          <FallbackImage
            src="https://images.unsplash.com/photo-1604502071830-b5e8dce44f83?w=800&q=80"
            alt="Wedding season bridal collection"
            className="promo-card-img"
          />
          <div className="promo-overlay" />
          <div className="promo-text">
            <h3>Wedding Season</h3>
            <p>Bridal lehengas and trousseau sarees you'll treasure forever</p>
            <Link to="/products?category=lehengas" className="promo-link">
              Shop Bridal →
            </Link>
          </div>
        </div>
        <div className="promo-card">
          <FallbackImage
            src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80"
            alt="Office-ready kurtis"
            className="promo-card-img"
          />
          <div className="promo-overlay" />
          <div className="promo-text">
            <h3>Office-Ready Kurtis</h3>
            <p>Comfortable, stylish, and under ₹1,499</p>
            <Link to="/products?category=kurtis" className="promo-link">
              Shop Kurtis →
            </Link>
          </div>
        </div>
      </section>

      
      <section className="section testimonials-section">
        <div className="section-header">
          <h2>What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <Stars count={t.rating} />
              <p className="testimonial-text">"{t.text}"</p>
              <span className="testimonial-name">— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      
      <section className="newsletter">
        <div className="newsletter-inner">
          <h2>Stay in the Loop</h2>
          <p>
            Get early access to new collections, festive drops, and exclusive
            offers — straight to your inbox.
          </p>
          {subscribed ? (
            <p className="subscribed-msg">✓ You're in! Watch your inbox.</p>
          ) : (
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit">Subscribe</button>
            </form>
          )}
        </div>
      </section>

     
      <section className="section insta-section">
        <div className="section-header">
          <h2>#StyledByYou</h2>
          <p className="section-sub">Tag us and get featured</p>
        </div>
        <div className="insta-grid">
          {[
            "photo-1614886137926-0e6a4f2dfc22",
            "photo-1604502071830-b5e8dce44f83",
            "photo-1583391733956-3750e0ff4e8b",
            "photo-1605902711622-cfb43c4437b1",
            "photo-1570382667048-23b368c4c24a",
            "photo-1519389950473-47ba0277781c",
          ].map((id, i) => (
            <div className="insta-item" key={i}>
              <FallbackImage
                src={`https://images.unsplash.com/${id}?w=400&q=80`}
                alt="Community style"
                index={i}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;