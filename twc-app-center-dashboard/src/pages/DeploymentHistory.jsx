import React, { useState, useEffect } from "react";
import { Table, Avatar, Typography, Layout, Button, Dropdown, Menu } from "antd";
import { CheckCircleOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import { useParams, useNavigate, useLocation } from "react-router-dom";

import AppLayout from "../components/AppLayout";
import { formatFileSize } from "../helpers/formatFileSize";
import { formatUploadTime } from "../helpers/formatUploadTime";
import { showToast, toastSeverity } from "../utils/toastify";
import useRequest from "../hooks/useRequest";

const { Title } = Typography;
const { Content } = Layout;

const DeploymentHistory = () => {
    const { appName, deployment } = useParams();
    const location = useLocation();

    const [loading, setLoading] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [selectedDeployment, setSelectedDeployment] = useState(deployment || "Production");

    const deploymentTypes = location.state?.releaseType || deployment;

    const { makeRequest } = useRequest();
    const navigate = useNavigate();

    useEffect(() => {
        getDeploymentHistory();
    }, [appName, selectedDeployment]);

    const getDeploymentHistory = async () => {
        setLoading(true);
        makeRequest({
            method: "GET",
            url: `/api/apps/${appName}/deployments/${selectedDeployment}/history`,
            onSuccess: (response) => {
                setHistoryData(response.history.reverse());
            },
            onError: (error) => {
                showToast(error.response.data, toastSeverity.ERROR);
            }
        })
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

            <Content
                style={{
                    background: "#FFFFFF",
                    margin: "24px 16px 16px 16px",
                    borderRadius: "8px",
                    padding: "16px 24px 24px 24px",
                    shadow: "4px 4px 4px 4px rgba(0, 0, 0, 0.1)",
                }}
            >
                <div>
                    <Title level={3} style={{ marginLeft: 4 }}>
                        {appName} deployment history
                    </Title>
                    <Title level={5}
                        style={{ marginBottom: 24, marginLeft: 4 }}
                    >
                        Deployment Name : {selectedDeployment}
                    </Title>
                </div>

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

export default DeploymentHistory;

const columns = [
    {
        title: "Release",
        dataIndex: "label",
        key: "label",
        render: (text) => (
            <div className="flex items-center gap-2">
                <Avatar size="medium">
                    <UserOutlined />
                </Avatar>
                <span style={{ marginLeft: 8 }}>
                    {text}
                </span>
            </div>
        ),
    },
    {
        title: "Target Versions",
        dataIndex: "appVersion",
        key: "appVersion",
        render: (appVersion) => (
            <div className="flex items-center gap-2">
                <span style={{ marginLeft: 8 }}>
                    {appVersion}
                </span>
            </div>
        ),
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (isDisabled) => (
            <div className="flex items-center gap-2">
                <CheckCircleOutlined />
                {isDisabled ? "Disabled" : "Enabled"}
            </div>
        ),
    },
    {
        title: "Mandatory",
        dataIndex: "isMandatory",
        key: "isMandatory",
        render: (isMandatory) => (
            <div className="flex items-center gap-2">
                {isMandatory ? "Yes" : "No"}
            </div>
        ),
    },
    {
        title: "Rollback",
        dataIndex: "rollout",
        key: "rollout",
        render: (rollout) => (rollout ? `${rollout}` : "N/A"),
    },
    {
        title: "Size",
        dataIndex: "size",
        key: "size",
        render: (size) => formatFileSize(size),
    },
    {
        title: "Released By",
        dataIndex: "releasedBy",
        key: "releasedBy",
    },
    {
        title: "Date",
        dataIndex: "uploadTime",
        key: "uploadTime",
        render: (uploadTime) => formatUploadTime(uploadTime),
    },
];