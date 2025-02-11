import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MailOutlined, PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, Layout, message, Select, Table, Tag, Typography, Modal, Card, Space } from "antd";
import axios from "axios";
import { showToast, toastSeverity } from "../utils/toastify";

import AppLayout from "../components/AppLayout";

const { Option } = Select;
const { Content } = Layout;
const { Title, Text } = Typography;

const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const AppsList = () => {
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);

    const [appsData, setAppsData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [selectedOS, setSelectedOS] = useState("All");
    const [selectedReleaseType, setSelectedReleaseType] = useState("All");
    const [selectedRole, setSelectedRole] = useState("All");

    const [account, setAccount] = useState({});
    const [isOwner, setIsOwner] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [form] = Form.useForm();

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
        getAccount();
        fetchApps();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [searchText, selectedOS, selectedReleaseType, selectedRole, appsData]);

    const getAccount = async () => {
        try {
            const queryParams = new URLSearchParams(location.search);
            const accessKey = queryParams.get("accessKey");

            const response = await axios.get("http://localhost:3000/account", {
                headers: {
                    "Authorization": `bearer ${accessKey} `
                }
            });

            setAccount(response.data.account);
        } catch (error) {
            console.error("Error fetching account:", error);
        }
    };

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
                releaseType: app.deployments,
                role: app.collaborators["anil.prajapat@truworthwellness.com"]?.permission || "Collaborator",
                collaborators: app.collaborators,
                avatar: app.name.charAt(0),
                deployment: app.deployments,
            }));

            // let foundOwner = false;

            // for (let app of response) {
            //     const collaborators = Object.values(app.collaborators);
            //     if (collaborators.some(collaborator => collaborator.permission === "Owner")) {
            //         foundOwner = true;
            //         break;
            //     }
            // }

            // setIsOwner(foundOwner);
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
            <Card
                bordered={false}
                style={{
                    background: "#F9FAFB",
                    margin: "16px",
                    borderRadius: "8px",
                    shadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.1)",
                }}
            >
                <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            {account.name && (
                                <Title level={5} style={{ margin: 0 }}>
                                    <UserOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                                    Account Holder Name : <Text type="secondary" strong>{account.name}</Text>
                                </Title>
                            )}

                            {account.email && (
                                <Title level={5} style={{ margin: 0 }}>
                                    <MailOutlined style={{ marginRight: 8, color: "#1890ff" }} />
                                    Account Email : <Text type="secondary" strong>{account.email}</Text>
                                </Title>
                            )}
                        </div>
                    </div>
                </Space>
            </Card>
            {/* <div style={{ display: "flex", alignItems: "center", margin: 18 }}>
                <div>
                    {account.name &&
                        <Title level={4}>
                            Account Name : {account.name}
                        </Title>
                    }

                    {account.email &&
                        <Title level={4}>
                            Account Email : {account.email}
                        </Title>
                    }
                </div>

                {isOwner &&
                    <Button type="primary" style={{ marginLeft: "auto" }} onClick={() => setIsModalVisible(true)}>
                        Add Collaborator
                    </Button>
                }
            </div> */}

            <Content style={{
                background: "#FFFFFF",
                margin: "8px 16px 16px 16px",
                borderRadius: "8px",
                padding: "16px 24px 24px 24px",
                shadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.1)",
            }}>
                <div className="apps-container">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h2>My App List</h2>

                        {isOwner && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => setIsModalVisible(true)}
                                size="medium"
                            >
                                Add Collaborator
                            </Button>
                        )}
                    </div>

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

                        <Select value={selectedOS} onChange={(value) => setSelectedOS(value)} className="filter-select">
                            <Option value="All">OS: All</Option>
                            <Option value="Android">Android</Option>
                            <Option value="iOS">iOS</Option>
                        </Select>

                        <Select value={selectedReleaseType} onChange={(value) => setSelectedReleaseType(value)} className="filter-select">
                            <Option value="All">Release Type: All</Option>
                            {Array.from(new Set(appsData.flatMap((app) => app.deployment || []))).map((release) => (
                                <Option key={release} value={release}>{release}</Option>
                            ))}
                        </Select>

                        <Select value={selectedRole} onChange={(value) => setSelectedRole(value)} className="filter-select">
                            <Option value="All">Role: All</Option>
                            <Option value="Owner">Owner</Option>
                            <Option value="Collaborator">Collaborator</Option>
                        </Select>
                    </div>

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

            <CollaboratorModal
                isModalVisible={isModalVisible}
                setIsModalVisible={setIsModalVisible}
                form={form}
                appsData={appsData}
            />
        </AppLayout>
    );
};

export default AppsList;

const CollaboratorModal = ({ isModalVisible, setIsModalVisible, form, appsData }) => {
    const [email, setEmail] = useState("");
    const [selectedApp, setSelectedApp] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddCollaborator = async () => {
        if (!selectedApp || !email) {
            showToast("Please select an app and enter an email address.", toastSeverity.ERROR);
            return;
        }

        setLoading(true);

        try {
            const queryParams = new URLSearchParams(location.search);
            const accessKey = queryParams.get("accessKey");

            await axios.post(`http://localhost:3000/apps/${selectedApp}/collaborators/${email}`, {}, {
                headers: {
                    "Authorization": `bearer ${accessKey}`
                }
            });

            showToast(`Successfully added ${email} to ${selectedApp}`, toastSeverity.SUCCESS);
            setIsModalVisible(false);
            setEmail("");
            form.resetFields();
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setLoading(false);
            showToast(error.response.data, toastSeverity.ERROR);
        }
    };

    return (
        <Modal
            title="Add collaborator to an app"
            open={isModalVisible}
            onCancel={() => {
                setIsModalVisible(false);
                form.resetFields();
            }}
            onOk={handleAddCollaborator}
            okText="Submit"
            maskClosable={false}
            cancelButtonProps={{ style: { display: "none" } }}
            okButtonProps={
                {
                    disabled: !selectedApp
                        || !EmailRegex.test(email)
                        || !form.isFieldsTouched(true)
                        || form.getFieldsError().some(({ errors }) => errors.length),
                    loading
                }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Select App"
                    name="app"
                    rules={[{ required: true, message: "Please select an app" }]}
                >
                    <Select
                        placeholder="Choose an app"
                        onChange={(value) => setSelectedApp(value)}
                    >
                        {appsData.map((app) => (
                            <Option key={app.name} value={app.name}>
                                {app.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Collaborator Email"
                    name="email"
                    rules={[
                        { required: true, message: "Email is required" },
                        {
                            type: "email",
                            message: "Please enter a valid email address"
                        },
                        {
                            pattern: EmailRegex,
                            message: "Invalid email format"
                        }
                    ]}
                >
                    <Input
                        placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </Form.Item>
            </Form>
        </Modal >
    )
}

// Table Columns
const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
        render: (text, record) => (
            <div>
                <Avatar style={{ marginRight: 8 }}>
                    {record.avatar}
                </Avatar>
                <span>
                    {text}
                </span>
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
        render: (releaseType) => (
            <div>
                {
                    releaseType.map((release, index) => (
                        <Tag
                            key={index}
                            color={
                                release === "Production"
                                    ? "green"
                                    : "blue"
                            }
                        >
                            {release}
                        </Tag>
                    ))
                }
            </div>
        )
    },
    // {
    //     title: "Role",
    //     dataIndex: "role",
    //     key: "role",
    // },
    {
        title: "Collaborator",
        dataIndex: "collaborators",
        width: "30%",
        key: "collaborators",
        render: (collaborators) => (
            <div>
                {Object.entries(collaborators).map(([email, details]) => (
                    <Tag
                        style={{ marginTop: 8 }}
                        color={details.permission === "Owner"
                            ? "green"
                            : "blue"
                        }
                        key={email}
                    >
                        {email} ({details.permission})
                    </Tag>
                ))}
            </div>
        ),
    },
];