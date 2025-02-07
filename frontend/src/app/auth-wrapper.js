"use client";
import Loader from "@/lib/Loader";
import { checkUserAuth, logout } from "@/service/auth.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./components/Header";

export default function AuthWrapper({ children }) {
    const { setUser, clearUser } = userStore();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isLoginPage = pathname === "/user-login";

    useEffect(() => {
        const extractTokenFromURL = () => {
            const token = searchParams.get("token");
            if (token) {
                localStorage.setItem("jwt", token);
                return token;
            }
            return localStorage.getItem("jwt"); // If no token in URL, check localStorage
        };

        const checkAuth = async () => {
            try {
                // ✅ 1. Extract token first
                const token = extractTokenFromURL();

                if (!token) {
                    await handleLogout();
                    return;
                }

                // ✅ 2. Now, check authentication
                const result = await checkUserAuth();
                if (result.isAuthenticated) {
                    setUser(result.user);
                    setIsAuthenticated(true);
                } else {
                    await handleLogout();
                }
            } catch (error) {
                await handleLogout();
            } finally {
                setLoading(false);
            }
        };

        const handleLogout = async () => {
            clearUser();
            setIsAuthenticated(false);
            localStorage.removeItem("jwt");

            try {
                await logout();
            } catch (error) {
                console.error("⚠️ Logout failed:", error);
            }

            if (!isLoginPage) {
                router.push("/user-login");
            }
        };

        if (!isLoginPage) {
            checkAuth();
        } else {
            setLoading(false);
        }
    }, [isLoginPage, router, setUser, clearUser, searchParams]);

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {!isLoginPage && isAuthenticated && <Header />}
            {children}
        </>
    );
}
