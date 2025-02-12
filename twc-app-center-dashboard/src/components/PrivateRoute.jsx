import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import useRequest from "../hooks/useRequest";

const PrivateRoute = () => {
    const isAuthenticated = localStorage.getItem("accessKey");

    const { makeRequest } = useRequest();

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        makeRequest({
            method: "GET",
            url: "/api/auth/session",
            onSuccess: (response) => {
                if (response.authenticated) {
                    localStorage.setItem("accessKey", response.user.accessKey);
                    localStorage.setItem("userId", response.user.id);
                } else {
                    return <Navigate to="/" replace />
                }
            }
        })
    };

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;