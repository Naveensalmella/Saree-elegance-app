import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GiLotus } from "react-icons/gi";
import { HiOutlineUser, HiOutlineLockClosed, HiOutlineMail, HiOutlinePhone } from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.css";

const SUPABASE_URL = "https://wqjaxtdxzjmlsaeoxyhq.supabase.co/rest/v1/register";
const SUPABASE_HEADERS = {
    apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
    "Content-Type": "application/json",
    Prefer: "return=representation",
};

const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const Register = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Already logged in? Skip the form entirely.
    useEffect(() => {
        if (getUser()) navigate("/products", { replace: true });
        // eslint-disable-next-line
    }, []);

    const handleRegister = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const data = { username, password, email, phone };
            const res = await axios.post(SUPABASE_URL, data, {
                headers: SUPABASE_HEADERS,
            });
            alert("Registered successfully!");
            console.log(res.data);
            navigate("/login");
        } catch (err) {
            console.log("Something went wrong", err);
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* ── LEFT: FORM ── */}
            <div className="auth-left">
                <div className="auth-form-wrapper">
                    {/* Brand */}
                    <Link to="/" className="auth-brand">
                        <GiLotus className="auth-brand-icon" />
                        <span className="auth-brand-name">Saree Elegance</span>
                    </Link>

                    {/* Heading */}
                    <div className="auth-heading">
                        <h1>Create Your Account</h1>
                        <p>
                            Join Saree Elegance and discover the finest ethnic fashion
                            delivered to your doorstep.
                        </p>
                    </div>

                    {/* Error */}
                    {error && <p className="auth-error">{error}</p>}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="input-group">
                            <HiOutlineUser className="input-icon" />
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <HiOutlineMail className="input-icon" />
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <HiOutlinePhone className="input-icon" />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <HiOutlineLockClosed className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword((p) => !p)}
                                aria-label="Toggle password"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    {/* Switch */}
                    <p className="auth-switch">
                        Already have an account?{" "}
                        <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>

            {/* ── RIGHT: BRAND SHOWCASE ── */}
            <div
                className="auth-right"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1200&q=80)",
                }}
            >
                <div className="auth-right-overlay" />
                <div className="auth-right-content">
                    <GiLotus className="auth-right-icon" />
                    <h2>Tradition Meets Trend</h2>
                    <p>
                        Explore our curated collection of handcrafted sarees, designer
                        kurtis, bridal lehengas, and contemporary indo-western outfits.
                    </p>
                    <div className="auth-right-features">
                        <div className="auth-feature">
                            <span className="auth-feature-num">5000+</span>
                            <span className="auth-feature-label">Curated Designs</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-num">50K+</span>
                            <span className="auth-feature-label">Happy Customers</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-num">100%</span>
                            <span className="auth-feature-label">Authentic Fabrics</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;