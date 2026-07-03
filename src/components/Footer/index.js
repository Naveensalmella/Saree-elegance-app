import { useState } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import { GiLotus } from "react-icons/gi";
import {
    FaInstagram,
    FaFacebookF,
    FaPinterestP,
    FaYoutube,
} from "react-icons/fa";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <footer className="footer">
            {/* ── MAIN FOOTER ── */}
            <div className="footer-main">
                {/* Brand column */}
                <div className="footer-col footer-brand">
                    <Link to="/" className="footer-logo">
                        <GiLotus className="footer-logo-icon" />
                        <h2 className="footer-title">Saree Elegance</h2>
                    </Link>
                    <p className="footer-desc">
                        Celebrating the art of Indian ethnic fashion. From hand-woven
                        Banarasi sarees to contemporary indo-western designs — we bring
                        tradition to your doorstep with love and authenticity.
                    </p>
                    <div className="footer-socials">
                        <a href="#" className="social-link" aria-label="Instagram" title="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="#" className="social-link" aria-label="Facebook" title="Facebook">
                            <FaFacebookF />
                        </a>
                        <a href="#" className="social-link" aria-label="Pinterest" title="Pinterest">
                            <FaPinterestP />
                        </a>
                        <a href="#" className="social-link" aria-label="YouTube" title="YouTube">
                            <FaYoutube />
                        </a>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="footer-col">
                    <h3 className="footer-heading">Quick Links</h3>
                    <ul className="footer-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">All Products</Link></li>
                        <li><Link to="/products?category=sarees">Sarees</Link></li>
                        <li><Link to="/products?category=kurtis">Kurtis</Link></li>
                        <li><Link to="/products?category=lehengas">Lehengas</Link></li>
                        <li><Link to="/products?category=indo-western">Indo-Western</Link></li>
                    </ul>
                </div>

                {/* Customer Service */}
                <div className="footer-col">
                    <h3 className="footer-heading">Customer Service</h3>
                    <ul className="footer-links">
                        <li><Link to="/orders">My Orders</Link></li>
                        <li><Link to="/wishlist">My Wishlist</Link></li>
                        <li><Link to="/cart">Shopping Cart</Link></li>
                        <li><a href="#">Returns & Refunds</a></li>
                        <li><a href="#">Shipping Policy</a></li>
                        <li><a href="#">Terms & Conditions</a></li>
                        <li><a href="#">Privacy Policy</a></li>
                    </ul>
                </div>

                {/* Contact + Newsletter */}
                <div className="footer-col footer-contact-col">
                    <h3 className="footer-heading">Get in Touch</h3>
                    <div className="footer-contact-list">
                        <div className="contact-item">
                            <HiOutlineLocationMarker className="contact-icon" />
                            <span>Hyderabad, Telangana, India</span>
                        </div>
                        <div className="contact-item">
                            <HiOutlinePhone className="contact-icon" />
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="contact-item">
                            <HiOutlineMail className="contact-icon" />
                            <span>support@sareeelegance.com</span>
                        </div>
                    </div>

                    <h3 className="footer-heading newsletter-heading">Newsletter</h3>
                    {subscribed ? (
                        <p className="footer-subscribed">✓ Thank you for subscribing!</p>
                    ) : (
                        <form className="footer-newsletter" onSubmit={handleSubscribe}>
                            <input
                                type="email"
                                placeholder="Your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit">→</button>
                        </form>
                    )}
                    <p className="footer-newsletter-note">
                        Get updates on new collections & exclusive offers.
                    </p>
                </div>
            </div>

            {/* ── BOTTOM BAR ── */}
            <div className="footer-bottom">
                <div className="footer-bottom-inner">
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} Saree Elegance. All rights reserved.
                    </p>
                    <div className="footer-payments">
                        <span className="payment-label">We accept:</span>
                        <div className="payment-icons">
                            <span className="payment-chip">Visa</span>
                            <span className="payment-chip">Mastercard</span>
                            <span className="payment-chip">UPI</span>
                            <span className="payment-chip">COD</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;