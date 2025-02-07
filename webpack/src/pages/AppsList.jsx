import React, { useState } from "react";
import { Table, Input, Button, Avatar, Alert, Select, Layout } from "antd";
import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined, PlusOutlined } from "@ant-design/icons";
import AppLayout from "../components/AppLayout";
import "../styles/apps.scss";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const { Content } = Layout;

const AppsList = () => {
    const [searchText, setSearchText] = useState("");
    const [viewMode, setViewMode] = useState("list");

    // React Router navigation hook
    const navigate = useNavigate();

    // Dummy Data
    const data = [
        {
            key: "1",
            name: "TWC-Android",
            os: "Android",
            releaseType: "Production",
            role: "Collaborator",
            owner: "AKP007TRUWORTH",
            avatar: "T",
        },
        {
            key: "2",
            name: "TWC-iOS",
            os: "iOS",
            releaseType: "Staging",
            role: "Collaborator",
            owner: "AKP007TRUWORTH",
            avatar: "T",
        },
    ];

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

    return (
        <AppLayout>

            <div style={{
                display: "flex",
                justifyContent: "space-between", alignItems: "center",
                margin: 18
            }}>
                <h1>Hello, AKP007TRUWORTH</h1>
                <Button type="primary" icon={<PlusOutlined />}>
                    Add new
                </Button>
            </div>

            <Content style={{
                margin: "24px 16px", padding: 24,
                background: "#FFFFFF",
            }}>

                <div className="apps-container">
                    <h2>My Apps</h2>
                    <div className="toolbar">
                        <Input
                            prefix={<SearchOutlined />}
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="search-input"
                        />

                        <div className="filters">
                            <Select defaultValue="All">
                                <Option value="All">OS: All</Option>
                            </Select>
                            <Select defaultValue="All">
                                <Option value="All">Release Type: All</Option>
                            </Select>
                            <Select defaultValue="All">
                                <Option value="All">Role: All</Option>
                            </Select>
                        </div>
                    </div>

                    <Table
                        bordered
                        columns={columns}
                        dataSource={data.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()))}
                        onRow={(record) => ({
                            onClick: () => navigate(`/apps/${record.name.toLowerCase()}`),
                        })}
                        pagination={false}
                        className="apps-table"
                        rowKey={"key"}
                        rowClassName="apps-table-row"
                    />
                </div>
            </Content>
        </AppLayout>
    );
};

export default AppsList;