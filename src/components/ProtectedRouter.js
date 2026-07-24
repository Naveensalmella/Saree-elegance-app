import { Navigate } from "react-router-dom";

const getUser = () => JSON.parse(localStorage.getItem("user") || "null");

// Wrap any route that should require a logged-in user, e.g.:
// <Route path="/products" element={<ProtectedRouter><Products /></ProtectedRouter>} />
const ProtectedRouter = ({ children }) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRouter;