import React from "react";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  AppstoreOutlined,
  BuildOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      title: "Distribute",
      icon: <AppstoreOutlined />,
      subMenu: [
        {
          key: "1",
          title: "CodePush",
          path: '/apps/code-push'
        },
      ]
    }
  ];

  return (

    <Sider
      collapsedWidth="0"
      breakpoint="xl"
      width={230}
    >
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[window.location.pathname]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%" }}
      >
        {menuItems.map((item, index) =>
          <>
            {item.subMenu
              ?
              <Menu.SubMenu title={item.title} icon={item.icon} style={{ marginLeft: "0px" }}>
                {item.subMenu.map(el =>
                  <Menu.Item key={el.path}>
                    <Link to={el.path}>{el.title}</Link>
                  </Menu.Item>
                )}
              </Menu.SubMenu>
              :
              <Menu.Item key={item.path} title={item.title} icon={item.icon} style={{ paddingLeft: "10px" }}>
                <Link to={item.path}>{item.title}</Link>
              </Menu.Item>}
          </>
        )}
      </Menu>
    </Sider>
  );
};

export default Sidebar;