import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Orders.css";
import { BsBoxSeam, BsChevronDown, BsChevronUp, BsCheckCircleFill } from "react-icons/bs";

const getOrders = () => JSON.parse(localStorage.getItem("orders") || "[]");

const Orders = () => {
    const [orders] = useState(getOrders());
    const [expandedId, setExpandedId] = useState(null);
    const location = useLocation();
    const justPlaced = location.state?.justPlaced;

    const toggleExpand = (id) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const formatDate = (iso) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        }) + " at " + d.toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit",
        });
    };

    if (orders.length === 0) {
        return (
            <div className="orders-page">
                <div className="orders-empty">
                    <BsBoxSeam className="orders-empty-icon" />
                    <h2>No orders yet</h2>
                    <p>When you place an order, it'll appear here.</p>
                    <Link to="/products" className="orders-shop-btn">Start Shopping</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            {/* Success banner */}
            {justPlaced && (
                <div className="orders-success">
                    <BsCheckCircleFill className="orders-success-icon" />
                    <div>
                        <strong>Order placed successfully!</strong>
                        <p>Order #{justPlaced} has been confirmed.</p>
                    </div>
                </div>
            )}

            <h1 className="orders-title">My Orders</h1>

            <div className="orders-list">
                {orders.map((order) => {
                    const isExpanded = expandedId === order.id;
                    return (
                        <div className={`order-card ${justPlaced === order.id ? "order-highlight" : ""}`} key={order.id}>
                            {/* Header */}
                            <div className="order-header" onClick={() => toggleExpand(order.id)}>
                                <div className="order-header-left">
                                    <span className="order-id">{order.id}</span>
                                    <span className="order-date">{formatDate(order.date)}</span>
                                </div>
                                <div className="order-header-right">
                                    <span className={`order-status status-${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                    <span className="order-total">₹{order.total?.toLocaleString("en-IN")}</span>
                                    {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                                </div>
                            </div>

                            
                            {isExpanded && (
                                <div className="order-details">
                                    <div className="order-items-section">
                                        <h4>Items ({order.items.length})</h4>
                                        {order.items.map((item) => (
                                            <div className="order-item" key={item.id}>
                                                <img src={item.image} alt={item.title} />
                                                <div className="order-item-info">
                                                    <Link to={`/products/${item.id}`} className="order-item-title">{item.title}</Link>
                                                    <span className="order-item-qty">Qty: {item.quantity}</span>
                                                </div>
                                                <span className="order-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-meta-grid">
                                        <div className="order-meta-card">
                                            <h4>Shipping Address</h4>
                                            <p>{order.shipping.fullName}</p>
                                            <p>{order.shipping.address}</p>
                                            <p>{order.shipping.city}, {order.shipping.state} — {order.shipping.pincode}</p>
                                            <p>{order.shipping.phone}</p>
                                        </div>
                                        <div className="order-meta-card">
                                            <h4>Payment</h4>
                                            <p className="order-pay-method">
                                                {order.shipping.paymentMethod === "cod" ? "Cash on Delivery" :
                                                    order.shipping.paymentMethod === "upi" ? "UPI" : "Card"}
                                            </p>
                                            <div className="order-price-breakdown">
                                                <div><span>Subtotal</span><span>₹{order.subtotal?.toLocaleString("en-IN")}</span></div>
                                                <div><span>Shipping</span><span>{order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}</span></div>
                                                <div className="order-total-row"><span>Total</span><span>₹{order.total?.toLocaleString("en-IN")}</span></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Orders;