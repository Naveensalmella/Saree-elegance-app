import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Checkout.css";
import { BsShieldCheck } from "react-icons/bs";

const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
const getOrders = () => JSON.parse(localStorage.getItem("orders") || "[]");

const Checkout = () => {
  const navigate = useNavigate();
  const [cart] = useState(getCart());
  const [placing, setPlacing] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setPlacing(true);

    setTimeout(() => {
      const order = {
        id: "ORD-" + Date.now(),
        date: new Date().toISOString(),
        items: cart,
        shipping: form,
        subtotal,
        shippingCost: shipping,
        total,
        status: "Confirmed",
      };

      const orders = getOrders();
      orders.unshift(order);
      localStorage.setItem("orders", JSON.stringify(orders));
      localStorage.setItem("cart", "[]");

      navigate("/orders", { state: { justPlaced: order.id } });
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="co-page">
        <div className="co-empty">
          <h2>Nothing to checkout</h2>
          <p>Your cart is empty. Add some items first.</p>
          <Link to="/products" className="co-shop-btn">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="co-page">
      <h1 className="co-title">Checkout</h1>

      <form className="co-layout" onSubmit={handlePlaceOrder}>
        {/* ── SHIPPING FORM ── */}
        <div className="co-form-section">
          <h2>Shipping Details</h2>
          <div className="co-form-grid">
            <div className="co-field full">
              <label>Full Name</label>
              <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your full name" required />
            </div>
            <div className="co-field">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
            </div>
            <div className="co-field">
              <label>Phone</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="10-digit number" required />
            </div>
            <div className="co-field full">
              <label>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} placeholder="House no., Street, Area" required rows={3} />
            </div>
            <div className="co-field">
              <label>City</label>
              <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" required />
            </div>
            <div className="co-field">
              <label>State</label>
              <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" required />
            </div>
            <div className="co-field">
              <label>Pincode</label>
              <input type="text" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" required />
            </div>
          </div>

          <h2 className="co-pay-heading">Payment Method</h2>
          <div className="co-payment-options">
            {[
              { value: "cod", label: "Cash on Delivery" },
              { value: "upi", label: "UPI" },
              { value: "card", label: "Credit / Debit Card" },
            ].map((opt) => (
              <label className={`co-pay-option ${form.paymentMethod === opt.value ? "selected" : ""}`} key={opt.value}>
                <input type="radio" name="paymentMethod" value={opt.value} checked={form.paymentMethod === opt.value} onChange={handleChange} />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>


        <div className="co-summary">
          <h2>Order Summary</h2>
          <div className="co-summary-items">
            {cart.map((item) => (
              <div className="co-summary-item" key={item.id}>
                <img src={item.image} alt={item.title} />
                <div className="co-summary-item-info">
                  <span className="co-si-title">{item.title}</span>
                  <span className="co-si-qty">Qty: {item.quantity}</span>
                </div>
                <span className="co-si-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="co-summary-divider" />
          <div className="co-summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN")}</span></div>
          <div className="co-summary-row"><span>Shipping</span><span>{shipping === 0 ? <span className="co-free">FREE</span> : `₹${shipping}`}</span></div>
          <div className="co-summary-divider" />
          <div className="co-summary-row co-summary-total"><span>Total</span><span>₹{total.toLocaleString("en-IN")}</span></div>

          <button type="submit" className="co-place-btn" disabled={placing}>
            {placing ? "Placing Order..." : "Place Order"}
          </button>

          <div className="co-secure">
            <BsShieldCheck /> <span>Your payment information is secure</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;