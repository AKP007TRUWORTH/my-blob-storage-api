import React from "react";
import { Layout, Breadcrumb, Avatar, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

const { Header } = Layout;

const HeaderComponent = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    // Generate Breadcrumb Items
    const breadcrumbItems = [
        <Breadcrumb.Item key="home">
            <Link to="/">App Center</Link>
        </Breadcrumb.Item>,
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
            return (
                <Breadcrumb.Item key={url}>
                    <Link to={url}>{pathSnippets[index]}</Link>
                </Breadcrumb.Item>
            );
        }),
    ];

    return (
        <Header style={{ background: "white", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="logo" style={{ padding: "16px", color: "#ff3366", fontWeight: "bold" }}>
                App Center
            </div>

            {/* <div>
                <Breadcrumb separator=" / " style={{ color: "white" }}>
                    {breadcrumbItems}
                </Breadcrumb>
            </div> */}

            <Space>
                <Avatar size="medium" style={{ backgroundColor: "#ffccc7", color: "#000" }}>
                    <UserOutlined />
                </Avatar>
            </Space>
        </Header>
    );
};

export default HeaderComponent;