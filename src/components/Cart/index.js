import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { BsTrash3, BsCartX, BsBag } from "react-icons/bs";
import { HiPlus, HiMinus } from "react-icons/hi";
import FallbackImage from "../common/FallbackImage";

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const saveCart = (list) => localStorage.setItem("cart", JSON.stringify(list));

const Cart = () => {
    const [cartItems, setCartItems] = useState(getCart());
    const navigate = useNavigate();

    useEffect(() => {
        saveCart(cartItems);
        window.dispatchEvent(new Event("cartUpdated"));
    }, [cartItems]);

    const updateQty = (id, delta) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const removeItem = (id) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shipping = subtotal >= 999 ? 0 : 99;
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <BsCartX className="cart-empty-icon" />
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything yet.</p>
                    <Link to="/products" className="cart-shop-btn">Continue Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-header">
                <h1>Shopping Cart</h1>
                <span className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="cart-layout">
                
                <div className="cart-items">
                    {cartItems.map((item, i) => (
                        <div className="cart-item" key={item.id}>
                            <Link to={`/products/${item.id}`} className="cart-item-img-wrap">
                                <FallbackImage src={item.image} alt={item.title} index={i} />
                            </Link>
                            <div className="cart-item-details">
                                <Link to={`/products/${item.id}`} className="cart-item-title">
                                    {item.title}
                                </Link>
                                <p className="cart-item-price">₹{item.price?.toLocaleString("en-IN")}</p>
                                <div className="cart-item-controls">
                                    <div className="cart-qty-picker">
                                        <button onClick={() => updateQty(item.id, -1)} disabled={item.quantity <= 1}><HiMinus /></button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQty(item.id, 1)}><HiPlus /></button>
                                    </div>
                                    <span className="cart-item-subtotal">
                                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                    </span>
                                    <button className="cart-remove-btn" onClick={() => removeItem(item.id)} title="Remove">
                                        <BsTrash3 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="cart-clear-btn" onClick={clearCart}>Clear Cart</button>
                </div>

                
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="cart-summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="cart-summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? <span className="cart-free">FREE</span> : `₹${shipping}`}</span>
                    </div>
                    {shipping > 0 && (
                        <p className="cart-shipping-note">Free shipping on orders above ₹999</p>
                    )}
                    <div className="cart-summary-divider" />
                    <div className="cart-summary-row cart-total-row">
                        <span>Total</span>
                        <span>₹{total.toLocaleString("en-IN")}</span>
                    </div>
                    <button className="cart-checkout-btn" onClick={() => navigate("/checkout")}>
                        <BsBag /> Proceed to Checkout
                    </button>
                    <Link to="/products" className="cart-continue">Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;