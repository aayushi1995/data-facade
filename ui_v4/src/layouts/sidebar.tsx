/* eslint-disable react-hooks/exhaustive-deps */
import { ChatIcon, DatabaseIcon, HomeIcon, PlaygroundIcon } from "@/assets/icon.theme"
import images from "@/assets/images"
import { Menu, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { NavLink } from "react-router-dom"
import styled from "styled-components"
import LAYOUT_STYLE from "./layout.style"
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react"
import Icon from "@ant-design/icons"

const MenuText = styled(Typography)`
    font-size:11px;
    font-weight:600
`

const AntMenu = styled(Menu)`
&& .ant-menu-item-selected {
    background-color: #E0F2FE;
    & .ant-typography{
        color: #0770E3;
        font-weight:600
    }
    
}    
`

const items: any = [
    { key: '1', text: 'Home', location: '/', icon: HomeIcon },
    { key: '2', text: 'Chats', location: '/chats', icon: ChatIcon },
    { key: '3', text: 'Data', location: '/data', icon: DatabaseIcon },
    { key: '4', text: 'Playground', location: '/playground', icon: PlaygroundIcon },

]

const AppSidebar = () => {
    const location = useLocation();
    const itemIndex = items.findIndex((item: any) => item.location === location.pathname);
    const [selectedKey, setSelectedKey] = useState(itemIndex > -1 ? items.find((_item: any) => location.pathname === _item.location)['key']: null);
    const renderMenu = (item: any) => <Menu.Item key={item.key} style={{ ...LAYOUT_STYLE.menuItem, ...{ textAlign: 'center' } }} title={null}>
        <Icon style={{ color: item.key === selectedKey ? '#0770E3' : '#9CA3AF' }} component={item.icon as React.ForwardRefExoticComponent<any>} />
        <MenuText>{item.text}</MenuText>
        <NavLink to={{
            pathname: item.location,
            search: `?tab=${item.text.toLowerCase()}`
        }} />
    </Menu.Item>

    useEffect(() => {
        itemIndex > -1 && setSelectedKey(items.find((_item: any) => location.pathname === _item.location)['key'])
    }, [location])
    return (
        <Sider trigger={null} collapsible theme="light" collapsedWidth={81} collapsed={true} style={LAYOUT_STYLE.sidebar}>
            <div style={LAYOUT_STYLE.image}>
                <img src={images.DataFacadeLogo} alt="Data-facade" />
            </div>
            <AntMenu theme="light" selectedKeys={[selectedKey]} mode="inline" style={{ background: '#F9FAFB', border: 'none', }} >
                {
                    items.map((item: any, index: number) => renderMenu(item))
                }
            </AntMenu>
        </Sider>
    )
}

export default AppSidebar