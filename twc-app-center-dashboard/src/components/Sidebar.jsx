import React from "react";
import { Button, Layout, Menu } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AppstoreOutlined, LogoutOutlined } from "@ant-design/icons";
import { showToast, toastSeverity } from "../utils/toastify";
import axios from "axios";

const { Sider } = Layout;

const Sidebar = () => {

  const Navigate = useNavigate();

  const menuItems = [
    {
      title: "CodePush",
      icon: <AppstoreOutlined />,
      path: '/apps',
      replace: true
    }
  ];

  const deleteAccessKeyFromStorage = async () => {
    localStorage.clear();
    Navigate("/");
    // try {
    //   const storedAccessKey = localStorage.getItem("accessKey"); // Retrieve from LocalStorage

    //   if (!storedAccessKey) {
    //     console.error("⚠️ No Access Key Found in LocalStorage");
    //     return;
    //   }

    //   await axios.delete(`http://localhost:3000/accessKeys/${storedAccessKey}`, {
    //     headers: {
    //       "Authorization": `bearer ${storedAccessKey} `
    //     }
    //   });

    //   localStorage.clear();
    //   Navigate("/");
    // } catch (error) {
    //   showToast(error.response.data, toastSeverity.ERROR);
    // }
  }

  return (
    <Sider
      collapsedWidth="0"
      breakpoint="xl"
      width={230}
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh"
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        defaultOpenKeys={["sub1"]}
        style={{ flex: 1, marginTop: "8px", padding: "0 8px" }}
      >
        {menuItems.map((item) =>
          item.subMenu ? (
            <Menu.SubMenu key={item.title} title={item.title} icon={item.icon}>
              {item.subMenu.map((el) => (
                <Menu.Item key={el.path}>
                  <Link to={el.path}>{el.title}</Link>
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ) : (
            <Menu.Item key={item.path} title={item.title} icon={item.icon}>
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          )
        )}
      </Menu>

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "0",
          width: "100%",
          padding: "16px 16px 0px 16px",
          borderTop: "1px solid rgba(255, 255, 255, 0.2)"
        }}
      >
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          block
          onClick={deleteAccessKeyFromStorage}
        >
          Logout
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;