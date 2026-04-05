import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');
            if (savedToken && savedUser) {
                try {
                    setToken(savedToken);
                    setUser(JSON.parse(savedUser));
                } catch {
                    logout();
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const data = res.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
    };

    const register = async (userData) => {
        const res = await api.post('/auth/register', userData);
        const data = res.data;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
