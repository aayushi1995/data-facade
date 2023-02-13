import AppContext from "@/contexts/AppContext"
import { DownOutlined, LogoutOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons"
import { useAuth0 } from "@auth0/auth0-react"
import { Affix, Avatar, Button, Col, Dropdown, Input, MenuProps, Row, Space } from "antd"
import { Header } from "antd/es/layout/layout"
import { useContext } from "react"
import LAYOUT_STYLE from "./layout.style"

const InputBox = () => <Input prefix={<SearchOutlined />} size="large" bordered={false} style={LAYOUT_STYLE.input} />

const DropdownMenu = (menuProps:any, workspaceName:any) => {
    return (
        <Dropdown menu={menuProps} trigger={['click']} arrow={true}>
            <Button size="large" style={{ outline: 'none', borderRadius: 2 }}>
                <Space>
                    {workspaceName}
                    <DownOutlined style={{ fontSize: 10 }} />
                </Space>
            </Button>
        </Dropdown>
    )
}

const items: MenuProps['items'] = [
    {
        label: 'Settings',
        key: 'settings',
        icon: <SettingOutlined />,
    },
    {
        label: 'Logout',
        key: 'logout',
        icon: <LogoutOutlined />,
    },
];


const AppHeader = () => {

    const appContext: any = useContext(AppContext)
    const { logout } = useAuth0()
   
    const handleMenuClick = (event: any) => {
        if (event.key === "logout") {
            appContext.setUserName(null);
            appContext.setUserEmail(null);
            appContext.setToken(null);
            logout()

        }
    }

    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
    return (
        <Affix offsetTop={0}>
            <Header style={LAYOUT_STYLE.header}>
                <Row gutter={36}>
                    <Col span={12} offset={6}>{InputBox()}</Col>
                    <Col span={6}>
                        <Row justify="end" gutter={18}>
                            <Col>
                                {DropdownMenu(menuProps, appContext.workspaceName)}
                            </Col>
                            <Col><Avatar size={36} style={{ background: '#7265e6' }}>{appContext.userName[0]}</Avatar></Col>
                        </Row>

                    </Col>
                </Row>
            </Header>
        </Affix>
    )
}

export default AppHeader