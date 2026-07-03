import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(
        localStorage.getItem("theme") || "light"
    );

    const toogleTheme = () => {
        setMode((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("theme", next);
            return next;
        });
    };

    useEffect(() => {
        document.body.className = mode;
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toogleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;