import BrowserTab from "@/components/BrowserTab";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import React from "react";
import AppHeader from "./header";
import LAYOUT_STYLE from "./layout.style";
import AppSidebar from "./sidebar";

interface ChildrenProps {
    children: React.ReactElement<any, any>
}

const AppLayout = ({ children }: ChildrenProps) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AppSidebar />
            <Layout style={{ marginLeft: 80 }}>
                <AppHeader />
                <BrowserTab>
                    <Content style={LAYOUT_STYLE.content}>
                        {children}
                    </Content>
                </BrowserTab>

            </Layout>
        </Layout>
    )
}

export default AppLayout

