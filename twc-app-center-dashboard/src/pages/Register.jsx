import React, { useEffect, useState } from "react";
import { Button, Typography } from "antd";
import { GithubOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

import "../styles/auth.scss";
import TWCLogo from "../assets/logo.svg";
import useRequest from "../hooks/useRequest";
import { showToast, toastSeverity } from "../utils/toastify";

const { Title, Text } = Typography;

const Register = () => {
    const [isGitHubAuthenticationEnabled, setGitHubAuthenticationEnabled] = useState(false);
    const [isMicrosoftAuthenticationEnabled, setMicrosoftAuthenticationEnabled] = useState(false);
    const [action, setAction] = useState("");

    const { makeRequest } = useRequest();
    const navigate = useNavigate();

    useEffect(() => {
        const accessKey = localStorage.getItem("accessKey");
        if (accessKey) {
            navigate(`/apps?accessKey=${accessKey}`, { replace: true });
        }
    }, [navigate]);

    useEffect(() => {
        getAuthLink()
    }, []);

    const getAuthLink = async () => {
        makeRequest({
            method: "GET",
            url: "/api/auth/register?source=web",
            onSuccess: (response) => {
                const { action, isGitHubAuthenticationEnabled, isMicrosoftAuthenticationEnabled } = response;
                setGitHubAuthenticationEnabled(isGitHubAuthenticationEnabled);
                setMicrosoftAuthenticationEnabled(isMicrosoftAuthenticationEnabled);
                setAction(action);
            },
            onError: (error) => {
                showToast(error.response.data, toastSeverity.ERROR);
            }
        })
    };

    return (
        <div className="auth-container">
            <div className="auth-right">
                <div className="auth-logo">
                    <img src={TWCLogo} width="200px" className="" alt="" />
                    <Title level={4} >
                        TWC App Center Dashboard
                    </Title>
                </div>

                <Title level={5} className="auth-signin"
                    style={{ marginTop: 12 }}
                >
                    Create your account
                </Title>

                <Text style={{ marginBottom: 8 }}>
                    Log in with one of these services to get started.
                </Text>

                {isGitHubAuthenticationEnabled &&
                    <a href={`http://localhost:3000/auth/${action}/github`}
                        style={{ textDecoration: "none" }}
                    >
                        <Button
                            icon={<GithubOutlined />}
                            block className="auth-btn"
                        >
                            GitHub
                        </Button>
                    </a>
                }

                {isMicrosoftAuthenticationEnabled &&
                    <a href={`http://localhost:3000/auth/${action}/azure-ad`} style={{ textDecoration: "none" }}>
                        <Button block className="auth-btn">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                                alt="Microsoft"
                                className="auth-icon"
                            />
                            Microsoft (Work)
                        </Button>
                    </a>
                }

                {/* <a href={`http://localhost:3000/auth/${action}/microsoft`} style={{ textDecoration: "none" }}>
                    <Button block className="auth-btn">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
                            alt="Microsoft"
                            className="auth-icon"
                        />
                        Microsoft (Personal)
                    </Button>
                </a> */}

                <Text className="auth-new">
                    Already have an account ? <a href="/">Sign in</a>
                </Text>
            </div>
        </div >
    );
};

export default Register;