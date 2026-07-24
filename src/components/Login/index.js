import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { GiLotus } from "react-icons/gi";
import { HiOutlineLockClosed, HiOutlineMail } from "react-icons/hi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";
import "../Register/Register.css";

const SUPABASE_URL = "https://wqjaxtdxzjmlsaeoxyhq.supabase.co/rest/v1/register";
const SUPABASE_HEADERS = {
    apikey:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
    Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxamF4dGR4emptbHNhZW94eWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDE4MTcsImV4cCI6MjA5NjkxNzgxN30.Np2wvORlImgoan2P7DPeJK8SN8P305vl9ISsUTSMWYA",
};

const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Already logged in? Skip the form entirely.
    useEffect(() => {
        if (getUser()) navigate("/products", { replace: true });
        // eslint-disable-next-line
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.get(
                `${SUPABASE_URL}?email=eq.${email}&password=eq.${password}`,
                { headers: SUPABASE_HEADERS }
            );

            if (res.data.length > 0) {
                const user = res.data[0];
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        phone: user.phone,
                    })
                );
                alert("Login successful!");
                navigate("/products");
            } else {
                setError("Invalid email or password. Please try again.");
            }
        } catch (err) {
            console.log("Something went wrong", err);
            setError("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-left">
                <div className="auth-form-wrapper">
                    {/* Brand */}
                    <Link to="/" className="auth-brand">
                        <GiLotus className="auth-brand-icon" />
                        <span className="auth-brand-name">Saree Elegance</span>
                    </Link>

                    {/* Heading */}
                    <div className="auth-heading">
                        <h1>Welcome Back!</h1>
                        <p>Login to your account to continue shopping your favourite ethnic wear.</p>
                    </div>

                    {/* Error */}
                    {error && <p className="auth-error">{error}</p>}

                    {/* Form */}
                    <form onSubmit={handleLogin} className="auth-form">
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

                        <div className="auth-extras">
                            <label className="remember-me">
                                <input type="checkbox" />
                                <span>Remember me</span>
                            </label>
                            <a href="/register" className="forgot-link">Forgot password?</a>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="auth-divider">
                        <span>or</span>
                    </div>

                    {/* Switch */}
                    <p className="auth-switch">
                        Don't have an account?{" "}
                        <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>


            <div
                className="auth-right"
                style={{
                    backgroundImage:
                        "url(https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80)",
                }}
            >
                <div className="auth-right-overlay" />
                <div className="auth-right-content">
                    <GiLotus className="auth-right-icon" />
                    <h2>Your Style Awaits</h2>
                    <p>
                        From timeless Banarasi weaves to contemporary Indo-Western designs
                        — pick up right where you left off.
                    </p>
                    <div className="auth-right-features">
                        <div className="auth-feature">
                            <span className="auth-feature-num">30-Day</span>
                            <span className="auth-feature-label">Easy Returns</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-num">Free</span>
                            <span className="auth-feature-label">Shipping 999+</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-num">24/7</span>
                            <span className="auth-feature-label">Support</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;