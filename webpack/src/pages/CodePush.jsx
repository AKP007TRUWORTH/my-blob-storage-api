import React, { useState, useEffect } from "react";
import { Table, Tag, Avatar, Typography, Layout, Button, Dropdown, Spin, message, Menu } from "antd";
import { CheckCircleOutlined, DownOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import AppLayout from "../components/AppLayout";

const { Title } = Typography;
const { Content } = Layout;

const CodePush = () => {
    const { appName, deployment } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState(true);
    const [historyData, setHistoryData] = useState([]);
    const [selectedDeployment, setSelectedDeployment] = useState(deployment || "Production");

    const deploymentTypes = location.state?.releaseType || deployment;

    useEffect(() => {
        fetchHistory();
    }, [appName, selectedDeployment]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const storedAccessKey = localStorage.getItem("accessKey"); // Retrieve from LocalStorage

            if (!storedAccessKey) {
                console.error("⚠️ No Access Key Found in LocalStorage");
                return;
            }

            const response = await axios.get(`/api/apps/${appName}/deployments/${selectedDeployment}/history`, {
                headers: {
                    "Authorization": `bearer ${storedAccessKey} `
                }
            });
            
            setHistoryData(response.data.history.reverse());
        } catch (error) {
            message.error("Failed to fetch deployment history.");
        }
        setLoading(false);
    };

    const handleDeploymentChange = (selected) => {
        setSelectedDeployment(selected);
        navigate(`/apps/${appName}/deployments/${selected}/history`, {
            state: {
                releaseType: deploymentTypes
            },
            replace: true
        });
    };

    const deploymentMenu = (
        <Menu onClick={(e) => handleDeploymentChange(e.key)}>
            {deploymentTypes?.map((deployment) => (
                <Menu.Item key={deployment}>{deployment}</Menu.Item>
            ))}
        </Menu>
    );

    return (
        <AppLayout>
            <div className="flex justify-between">
                <Dropdown overlay={deploymentMenu} trigger={["click"]}>
                    <Button style={{ float: "right", marginRight: 18, marginTop: 24 }}>
                        {selectedDeployment} <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            <Content style={{ margin: "24px 16px", padding: 24, background: "#fff" }}>
                <Title level={2}>
                    CodePush Deployment History
                </Title>
                <Title level={5}
                    style={{ marginBottom: 24, marginLeft: 4 }}
                >
                    App: {appName} | Deployment: {selectedDeployment}
                </Title>

                <Table
                    bordered
                    columns={columns}
                    dataSource={historyData.map((item, index) => ({ key: index, ...item }))}
                    pagination={{ pageSize: 5 }}
                    rowClassName="hover:bg-gray-100"
                    loading={loading}
                />

            </Content>
        </AppLayout>
    );
};

export default CodePush;

const columns = [
    {
        title: "Release Label",
        dataIndex: "label",
        key: "label",
        render: (text) => (
            <div className="flex items-center gap-2">
                <Avatar size="small">
                    {text.charAt(1)}
                </Avatar>
                <span style={{ marginLeft: 8 }}>
                    {text}
                </span>
            </div>
        ),
    },
    {
        title: "App Version",
        dataIndex: "appVersion",
        key: "appVersion",
    },
    {
        title: "Status",
        dataIndex: "isMandatory",
        key: "isMandatory",
        render: (isMandatory) => (
            <Tag icon={<CheckCircleOutlined />} color={isMandatory ? "success" : "default"}>
                {isMandatory ? "Mandatory" : "Optional"}
            </Tag>
        ),
    },
    {
        title: "Rollout",
        dataIndex: "rollout",
        key: "rollout",
        render: (rollout) => (rollout ? `${rollout}%` : "N/A"),
    },
    {
        title: "Release Method",
        dataIndex: "releaseMethod",
        key: "releaseMethod",
    },
    {
        title: "Size (Bytes)",
        dataIndex: "size",
        key: "size",
    },
    {
        title: "Released By",
        dataIndex: "releasedBy",
        key: "releasedBy",
    }
];