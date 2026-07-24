import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser } from "react-icons/hi";
import { BsBoxSeam, BsHeart, BsCartCheck } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";

const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [counts, setCounts] = useState({ orders: 0, wishlist: 0, cart: 0 });

    useEffect(() => {
        const u = getUser();
        if (!u) {
            navigate("/login");
            return;
        }
        setUser(u);

        const orders = JSON.parse(localStorage.getItem("orders") || "[]");
        const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCounts({
            orders: orders.length,
            wishlist: wishlist.length,
            cart: cart.reduce((sum, item) => sum + (item.quantity || 1), 0),
        });
        // eslint-disable-next-line
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    if (!user) return null;

    const initial = (user.username || user.email || "?").trim().charAt(0).toUpperCase();

    return (
        <main className="profile-page">
            <div className="profile-header-banner">
                <div className="profile-avatar">{initial}</div>
                <h1>{user.username || "My Account"}</h1>
                <p className="profile-tagline">Welcome back to Saree Elegance</p>
            </div>

            <div className="profile-content">
                <section className="profile-card">
                    <h2 className="profile-card-title">
                        <HiOutlineUser /> Account Details
                    </h2>
                    <div className="profile-detail-row">
                        <span className="profile-detail-label">
                            <HiOutlineUser /> Full Name
                        </span>
                        <span className="profile-detail-value">{user.username || "—"}</span>
                    </div>
                    <div className="profile-detail-row">
                        <span className="profile-detail-label">
                            <HiOutlineMail /> Email
                        </span>
                        <span className="profile-detail-value">{user.email || "—"}</span>
                    </div>
                    <div className="profile-detail-row">
                        <span className="profile-detail-label">
                            <HiOutlinePhone /> Phone
                        </span>
                        <span className="profile-detail-value">{user.phone || "Not provided"}</span>
                    </div>
                </section>

                <section className="profile-stats">
                    <Link to="/orders" className="profile-stat-card">
                        <BsBoxSeam className="profile-stat-icon" />
                        <span className="profile-stat-num">{counts.orders}</span>
                        <span className="profile-stat-label">Orders</span>
                    </Link>
                    <Link to="/wishlist" className="profile-stat-card">
                        <BsHeart className="profile-stat-icon" />
                        <span className="profile-stat-num">{counts.wishlist}</span>
                        <span className="profile-stat-label">Wishlist</span>
                    </Link>
                    <Link to="/cart" className="profile-stat-card">
                        <BsCartCheck className="profile-stat-icon" />
                        <span className="profile-stat-num">{counts.cart}</span>
                        <span className="profile-stat-label">In Cart</span>
                    </Link>
                </section>

                <button className="profile-logout-btn" onClick={handleLogout}>
                    <FiLogOut /> Logout
                </button>
            </div>
        </main>
    );
};

export default Profile;