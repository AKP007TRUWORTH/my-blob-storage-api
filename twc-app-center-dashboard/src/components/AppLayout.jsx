import { Affix, Layout } from "antd";
import Sidebar from "./Sidebar";
import HeaderComponent from "./Header";

const AppLayout = ({ children }) => {

    return (
        <div className="dashboardSection">
            <Layout>
                <Affix offsetTop={0}>
                    <Sidebar />
                </Affix>
                <Layout style={{ background: '#00000' }}>
                    <HeaderComponent />
                    {children}
                </Layout>
            </Layout>
        </div>
    );
}

export default AppLayout;