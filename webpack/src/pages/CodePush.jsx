import React, { useEffect } from "react";
import { Table, Tag, Avatar, Alert, Typography, Layout, Button, Select, Dropdown, Tooltip, Space, Menu } from "antd";
import { CheckCircleOutlined, DownOutlined, UserOutlined } from "@ant-design/icons";
import AppLayout from "../components/AppLayout";

const { Title } = Typography;

const columns = [
    {
        title: "Release",
        dataIndex: "release",
        key: "release",
        render: (text, record) => (
            <div className="flex items-center gap-2">
                <Avatar size="small">{text.charAt(1)}</Avatar>
                <div>
                    <div className="font-semibold">{text}</div>
                    <div className="text-gray-500 text-sm">{record.user}</div>
                </div>
            </div>
        ),
    },
    {
        title: "Target Versions",
        dataIndex: "targetVersion",
        key: "targetVersion",
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
            <Tag icon={<CheckCircleOutlined />} color="success">
                {status}
            </Tag>
        ),
    },
    {
        title: "Mandatory",
        dataIndex: "mandatory",
        key: "mandatory",
    },
    {
        title: "Rollbacks",
        dataIndex: "rollbacks",
        key: "rollbacks",
    },
    {
        title: "Active Devices",
        dataIndex: "activeDevices",
        key: "activeDevices",
    },
    {
        title: "Date",
        dataIndex: "date",
        key: "date",
    },
];

// Dummy Data
const data = [
    {
        key: "1",
        release: "v288",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "Yes",
        rollbacks: 828,
        activeDevices: 32251,
        date: "Jan 26, 12:30 PM",
    },
    {
        key: "2",
        release: "v287",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "No",
        rollbacks: 1468,
        activeDevices: 12257,
        date: "Jan 20, 10:43 PM",
    },
    {
        key: "3",
        release: "v286",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "Yes",
        rollbacks: 807,
        activeDevices: 16271,
        date: "Jan 13, 5:09 PM",
    },
    {
        key: "4",
        release: "v285",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "No",
        rollbacks: 2275,
        activeDevices: 9272,
        date: "Jan 6, 4:15 PM",
    },
    {
        key: "5",
        release: "v284",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "Yes",
        rollbacks: 1378,
        activeDevices: 42259,
        date: "Dec 16, 10:54 AM",
    },
    {
        key: "6",
        release: "v283",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "Yes",
        rollbacks: 463,
        activeDevices: 5224,
        date: "Dec 10, 8:29 PM",
    },
    {
        key: "7",
        release: "v282",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "No",
        rollbacks: 1310,
        activeDevices: 2617,
        date: "Dec 5, 3:17 PM",
    },
    {
        key: "8",
        release: "v281",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "Yes",
        rollbacks: 667,
        activeDevices: 8195,
        date: "Nov 26, 10:04 AM",
    },
    {
        key: "9",
        release: "v280",
        user: "rohit.mundra@truworthwellness.com",
        targetVersion: "6.5",
        status: "Enabled",
        mandatory: "Yes",
        rollbacks: 1073,
        activeDevices: 10390,
        date: "Nov 8, 1:20 PM",
    },
];

const { Content } = Layout;

const items = [
    {
        label: 'Production',
        key: '1',
    },
    {
        label: 'Development',
        key: '2',
    }
];

const CodePush = () => {
    const [environment, setEnvironment] = React.useState('');

    const [selected, setSelected] = React.useState("Production");

    const [pagination, setPagination] = React.useState({
        current: 1,
        pageSize: 5,
    });

    // const menuProps = {
    //     items,
    //     // onClick: handleMenuClick,
    // };

    const handleMenuClick = (e) => {
        setSelected(e.key); // Update the selected value
    };


    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="Production">Production</Menu.Item>
            <Menu.Item key="Development">Development</Menu.Item>
        </Menu>
    );


    return (
        <AppLayout>

            <div className="flex justify-between">

                <Dropdown overlay={menu} trigger={["click"]}>
                    <Button style={{
                        float: "right",
                        marginRight: 18,
                        marginTop: 24
                    }}>
                        {selected} <DownOutlined />
                    </Button>
                </Dropdown>
            </div>

            {/* <Dropdown
                    menu={menuProps}

                >
                    <Button
                        style={{
                            float: "right",
                            marginRight: 18,
                            marginTop: 24
                        }}
                    >
                        <Space>
                            Button
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown> */}
            {/* <Select
                    defaultValue="lucy"
                    style={{
                        width: 120, float: "right",
                        marginRight: 18,
                        marginTop: 24
                    }}
                    // onChange={()}
                    options={[
                        { value: 'jack', label: 'Jack' },
                        { value: 'lucy', label: 'Lucy' },
                        { value: 'Yiminghe', label: 'yiminghe' },
                        { value: 'disabled', label: 'Disabled', disabled: true },
                    ]}
                /> */}


            <Content
                style={{
                    margin: "24px 16px",
                    padding: 24,
                    background: "#fff",
                }}
            >
                <Title level={2}>CodePush</Title>

                <Table
                    bordered
                    columns={columns}
                    dataSource={data}
                    pagination={pagination}
                    rowClassName="hover:bg-gray-100"
                    onChange={(pagination) => setPagination(pagination)}
                />
            </Content>
        </AppLayout>
    );
};

export default CodePush;