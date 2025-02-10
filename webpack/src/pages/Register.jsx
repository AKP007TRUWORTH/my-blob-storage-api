import React, { useEffect } from "react";
import { Button, Checkbox, Alert, Typography } from "antd";
import { GithubOutlined, GoogleOutlined } from "@ant-design/icons";
import "../styles/auth.scss"; // Import SCSS for styling
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TWCLogo from "../assets/logo.svg";

const { Title, Text } = Typography;

const Register = () => {
    const [isGitHubAuthenticationEnabled, setGitHubAuthenticationEnabled] = React.useState(false);
    const [isMicrosoftAuthenticationEnabled, setMicrosoftAuthenticationEnabled] = React.useState(false);
    const [action, setAction] = React.useState("");

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
        try {
            const response = await axios.get("/api/auth/login?source=web");
            setGitHubAuthenticationEnabled(response.data.isGitHubAuthenticationEnabled);
            setMicrosoftAuthenticationEnabled(response.isMicrosoftAuthenticationEnabled);
            setAction(response.data.action);
        } catch (error) {
            console.error("Error fetching apps:", error);
        }
    };

    return (
        <div className="auth-container">
            {/* Left Side Illustration */}
            {/* <div className="auth-left"> */}
            {/* <div className="auth-text">
                        <Title level={2} className="auth-title">
                            App Center is mission control for apps
                        </Title>
                        <Text className="auth-subtitle">
                            Continuously build, test, release, and monitor apps for every platform.
                        </Text>
                    </div> */}
            {/* </div> */}

            {/* Right Side Login Form */}
            <div className="auth-right">
                {/* <Alert
                    message="Visual Studio App Center is scheduled for retirement on March 31, 2025."
                    type="warning"
                    showIcon
                    className="auth-alert"
                /> */}
                {/* 
                <Title level={3} className="auth-signin">Sign in</Title>
                <Text>Log in to your account with one of these services.</Text> */}

                <div className="auth-logo">
                    <img src={TWCLogo} width="200px" className="" alt="" />
                    <h4 style={{ color: '#241f31' }} className="text-center py-4">
                        Truworth CodePush Server Dashboard
                    </h4>
                </div>

                {/* Social Login Buttons */}
                {isGitHubAuthenticationEnabled &&
                    <a href={`http://localhost:3000/auth/${action}/github`} style={{ textDecoration: "none" }}>
                        <Button
                            icon={<GithubOutlined />}
                            block className="auth-btn"
                        >
                            GitHub
                        </Button>
                    </a>
                }


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

                <div className="auth-btn-group">
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

                </div>



                {/* {isMicrosoftAuthenticationEnabled && */}


                {/* <a href={`http://localhost:3000/auth/${action}/microsoft`} >
                    <img class="microsoft" src="images/windows10.png" />
                    Microsoft (Personal)
                </a>
                <span class="spacer" />
                <a href={`http://localhost:3000/auth/${action}/azure-ad`}>
                    <img class="microsoft" src="images/windows10.png" />
                    Microsoft (Work)
                </a><br /> */}


                {/* } */}
                {/* <div className="auth-btn-group">
                    <Button block className="auth-btn">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="auth-icon" />
                        Facebook
                    </Button>
                    <Button icon={<GoogleOutlined />} block className="auth-btn">
                        Google
                    </Button>
                </div> */}

                {/* Keep Me Signed In
                <div className="auth-remember">
                    <Checkbox>Keep me signed in</Checkbox>
                </div> */}

                {/* Alternative Login */}
                {/* <Text className="auth-alt">
                    Did you create an account directly in App Center?{" "}
                    <a href="#">Sign in with email</a>
                </Text> */}

                <Text className="auth-new">
                    Already have an account ? <a href="/">Sign in</a>
                </Text>

                {/* Footer Links */}
                {/* <div className="auth-footer">
                    <a href="#">Terms of use</a> · <a href="#">Privacy</a> · <a href="#">Status</a>
                </div>

                <Text className="auth-copyright">© 2025 Microsoft</Text> */}
            </div>
        </div >
    );
};

export default Register;