"use client";
import { createContext, useContext, useEffect, useState } from "react";
import AuthPopup from "../components/auth/AuthForm";
import { HTTP } from "../utils/http.js";

const AuthContext = createContext(null);
const URL = process.env.NEXT_PUBLIC_USER_SERVICE_ROOT || "http://localhost:4000/";

export const AuthProvider = ({ children }) => {
  
    const [user, setUser] = useState(null);
    const [isAuthPopupOpen, setAuthPopupOpen] = useState(false);
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const checkLoginStatus = async () => {
        try {
            const response = await HTTP("GET", `${URL}me`, {}, "");
            if (response) {
                // console.log(response)
                setUser(response);
                setAuthPopupOpen(false);
                
                // router.refresh();
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        }
    };

    const logout = async () => {
        try {
            await HTTP("POST", `${URL}logout`, {}, "");
            setUser(null);
            setAuthPopupOpen(true);
           
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user,setUser, logout, isAuthPopupOpen, setAuthPopupOpen }}>
            {children}
            {isAuthPopupOpen && <AuthPopup isOpen={isAuthPopupOpen} setIsOpen={setAuthPopupOpen} />}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
