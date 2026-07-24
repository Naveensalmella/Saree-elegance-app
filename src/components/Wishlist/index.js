import { useState } from "react";
import { Link } from "react-router-dom";
import "./Wishlist.css";
import { FaHeart } from "react-icons/fa";
import { BsCartPlus, BsHeartbreak } from "react-icons/bs";
import FallbackImage from "../common/FallbackImage";

const getWishlist = () => JSON.parse(localStorage.getItem("wishlist") || "[]");
const saveWishlist = (list) => localStorage.setItem("wishlist", JSON.stringify(list));
const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (list) => localStorage.setItem("cart", JSON.stringify(list));

const Wishlist = () => {
    const [wishlist, setWishlist] = useState(getWishlist());
    const [movedIds, setMovedIds] = useState({});

    const removeFromWishlist = (id) => {
        const updated = wishlist.filter((w) => w.id !== id);
        setWishlist(updated);
        saveWishlist(updated);
        window.dispatchEvent(new Event("wishlistUpdated"));
    };

    const moveToCart = (item) => {
        const cart = getCart();
        const exists = cart.find((c) => c.id === item.id);
        let updated;
        if (exists) {
            updated = cart.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
        } else {
            updated = [...cart, { ...item, quantity: 1 }];
        }
        saveCart(updated);
        window.dispatchEvent(new Event("cartUpdated"));
        setMovedIds((prev) => ({ ...prev, [item.id]: true }));
        setTimeout(() => {
            removeFromWishlist(item.id);
        }, 1200);
    };

    if (wishlist.length === 0) {
        return (
            <div className="wish-page">
                <div className="wish-empty">
                    <BsHeartbreak className="wish-empty-icon" />
                    <h2>Your wishlist is empty</h2>
                    <p>Save items you love by tapping the heart icon.</p>
                    <Link to="/products" className="wish-shop-btn">Browse Products</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="wish-page">
            <div className="wish-header">
                <h1>My Wishlist</h1>
                <span className="wish-count">{wishlist.length} item{wishlist.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="wish-grid">
                {wishlist.map((item) => (
                    <div className={`wish-card ${movedIds[item.id] ? "wish-moved" : ""}`} key={item.id}>
                        <div className="wish-card-img-wrap">
                            <Link to={`/products/${item.id}`}>
                                <FallbackImage src={item.image} alt={item.title} />
                            </Link>
                            <button className="wish-remove-btn" onClick={() => removeFromWishlist(item.id)} title="Remove">
                                <FaHeart />
                            </button>
                        </div>
                        <div className="wish-card-body">
                            <Link to={`/products/${item.id}`} className="wish-card-title">{item.title}</Link>
                            <p className="wish-card-price">₹{item.price?.toLocaleString("en-IN")}</p>
                            <span className={`wish-card-stock ${item.stock > 0 ? "in" : "out"}`}>
                                {item.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                            <button
                                className={`wish-move-btn ${movedIds[item.id] ? "moved" : ""}`}
                                onClick={() => moveToCart(item)}
                                disabled={item.stock === 0 || movedIds[item.id]}
                            >
                                {movedIds[item.id] ? "✓ Moved to Cart" : <><BsCartPlus /> Move to Cart</>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;