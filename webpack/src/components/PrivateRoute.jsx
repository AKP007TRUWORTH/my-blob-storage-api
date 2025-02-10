import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const accessKey = queryParams.get("accessKey");
    const storedAccessKey = localStorage.getItem("accessKey");

    useEffect(() => {
        if (accessKey) {
            console.log(accessKey)
            localStorage.setItem("accessKey", accessKey);
        }
    }, []);

    return accessKey || storedAccessKey
        ? <Outlet />
        : <Navigate to="/" replace />;
};

export default PrivateRoute;
