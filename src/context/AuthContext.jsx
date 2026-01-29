import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            // Optionally verify token validity with backend here
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            // Adjust URL if your backend is deployed elsewhere
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
                email,
                password,
            });

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            toast.success("Login successful!");
            return true;
        } catch (error) {
            console.error("Login failed", error);
            toast.error(error.response?.data?.message || "Login failed");
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
