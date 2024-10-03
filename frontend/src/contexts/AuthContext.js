import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const tokens = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (tokens) {
            setAuthTokens(tokens);
            setUserRole(role);
        }
    }, []);

    const login = (tokens) => {
        setAuthTokens(tokens.token);
        localStorage.setItem('token', tokens.token);
        localStorage.setItem('role', tokens.role);
        setUserRole(tokens.role);
    };

    const logout = () => {
        setAuthTokens(null);
        setUserRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    };

    return (
        <AuthContext.Provider value={{ authTokens, userRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
