import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";
import { Avatar, Input, Layout, Select, Table } from "antd";
import axios from "axios";

import AppLayout from "../components/AppLayout";

const { Option } = Select;
const { Content } = Layout;

const AppsList = () => {
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [appsData, setAppsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedOS, setSelectedOS] = useState("All");
    const [selectedReleaseType, setSelectedReleaseType] = useState("All");
    const [selectedRole, setSelectedRole] = useState("All");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Disable back navigation
        const disableBackNavigation = () => {
            window.history.pushState(null, "", window.location.href);
        };

        // Push a new state to prevent back navigation
        window.history.pushState(null, "", window.location.href);
        window.addEventListener("popstate", disableBackNavigation);

        return () => {
            window.removeEventListener("popstate", disableBackNavigation);
        };
    }, []);

    useEffect(() => {
        fetchApps();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchText, selectedOS, selectedReleaseType, selectedRole, appsData]);


    const fetchApps = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(location.search);
            const accessKey = queryParams.get("accessKey");

            const response = await axios.get("http://localhost:3000/apps", {
                headers: {
                    "Authorization": `bearer ${accessKey} `
                }
            });

            const formattedData = response.data.apps.map((app, index) => ({
                key: index + 1,
                name: app.name,
                os: app.name.includes("iOS") ? "iOS" : "Android",
                releaseType: app.deployments?.join(", ") || "Unknown",
                role: app.collaborators["anil.prajapat@truworthwellness.com"]?.permission || "Collaborator",
                owner: "Anil Prajapat",
                avatar: app.name.charAt(0),
                deployment: app.deployments,
            }));

            setAppsData(formattedData);
            setFilteredData(formattedData);
        } catch (error) {
            console.error("Error fetching apps:", error);
        }
        setLoading(false);
    };

    const applyFilters = () => {
        let filtered = appsData;

        if (selectedOS !== "All") {
            filtered = filtered.filter((app) => app.os === selectedOS);
        }

        if (selectedReleaseType !== "All") {
            filtered = filtered.filter((app) => app.releaseType.includes(selectedReleaseType));
        }

        if (selectedRole !== "All") {
            filtered = filtered.filter((app) => app.role === selectedRole);
        }

        if (searchText) {
            filtered = filtered.filter((app) => app.name.toLowerCase().includes(searchText.toLowerCase()));
        }

        setFilteredData(filtered);
    };

    return (
        <AppLayout>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: 18 }}>
                <h1>Hello, AKP007TRUWORTH</h1>
            </div>

            <Content style={{ margin: "24px 16px", padding: 24, background: "#FFFFFF" }}>
                <div className="apps-container">
                    <h2>My Apps</h2>

                    {/* Filters Section */}
                    <div className="toolbar" style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                        {/* Search Bar */}
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input"
                        />

                        {/* OS Filter */}
                        <Select value={selectedOS} onChange={(value) => setSelectedOS(value)} className="filter-select">
                            <Option value="All">OS: All</Option>
                            <Option value="Android">Android</Option>
                            <Option value="iOS">iOS</Option>
                        </Select>

                        {/* Release Type Filter */}
                        <Select value={selectedReleaseType} onChange={(value) => setSelectedReleaseType(value)} className="filter-select">
                            <Option value="All">Release Type: All</Option>
                            {Array.from(new Set(appsData.flatMap((app) => app.deployment || []))).map((release) => (
                                <Option key={release} value={release}>{release}</Option>
                            ))}
                        </Select>

                        {/* Role Filter */}
                        <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} className="filter-select">
                            <Option value="All">Role: All</Option>
                            <Option value="Owner">Owner</Option>
                            <Option value="Collaborator">Collaborator</Option>
                        </Select>
                    </div>

                    {/* Apps Table */}
                    <Table
                        bordered
                        loading={loading}
                        columns={columns}
                        dataSource={filteredData}
                        onRow={(record) => ({
                            onClick: () => navigate(`/apps/${record.name}/deployments/Production/history`,
                                {
                                    state: { releaseType: record.deployment },
                                }),
                        })}
                        pagination={{ pageSize: 5 }}
                        rowKey={"key"}
                        rowClassName="apps-table-row"
                    />
                </div>
            </Content>
        </AppLayout>
    );
};

export default AppsList;

// Table Columns
const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <div>
                <Avatar style={{ marginRight: 8 }}>{record.avatar}</Avatar>
                <span>{text}</span>
            </div>
        ),
    },
    {
        title: "OS",
        dataIndex: "os",
        key: "os",
    },
    {
        title: "Release Type",
        dataIndex: "releaseType",
        key: "releaseType",
    },
    {
        title: "Role",
        dataIndex: "role",
        key: "role",
    },
    {
        title: "Owner",
        dataIndex: "owner",
        key: "owner",
        render: (text) => (
            <div className="flex items-center gap-2">
                <Avatar style={{ marginRight: 8 }}>A</Avatar>
                <span>{text}</span>
            </div>
        ),
    },
];