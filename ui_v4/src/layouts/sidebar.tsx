/* eslint-disable react-hooks/exhaustive-deps */
import { Menu, Typography } from "antd"
import Sider from "antd/es/layout/Sider"
import { NavLink, useNavigate } from "react-router-dom"
import styled from "styled-components"
import LAYOUT_STYLE from "./layout.style"
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from "react"
import Icon from "@ant-design/icons"
import { SidebarItems } from './utils'
import { setLocalStorage } from "@/utils"
import { LogoIcon } from "@/assets/icon.theme"
import { getUniqueId } from "../utils/getUniqueId"
// import { GENERATE_URL_PARAMS, SLACK_URL } from "@/settings/config"

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

const renderMenu = (item: any, selectedKey: string) => {
    return (
        <Menu.Item key={item.key} style={{ ...LAYOUT_STYLE.menuItem, ...{ textAlign: 'center' } }} title={null}>

            <Icon style={{ color: item.key === selectedKey ? '#0770E3' : '#9CA3AF' }} component={item.icon as React.ForwardRefExoticComponent<any>} />
            <MenuText>{item.text}</MenuText>
            <NavLink to={{
                pathname: item.location,
                search: `?tabKey=${item.text.toLowerCase()}`
            }} />
        </Menu.Item>
    )
}

const AppSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate()
    const items: any = SidebarItems()
    const itemIndex = location.pathname === "/" ? 0 : items.findIndex((item: any) => location.pathname.includes(item.key));
    const [selectedKey, setSelectedKey] = useState(itemIndex === 0 ? 'home' : itemIndex > -1 ? items?.find((_item: any) => location.pathname.includes(_item.key))['key'] : null);


    const onMenuItemClick = (item: any) => {
     console.log("");
     
    }
    
    useEffect(() => {
        itemIndex > -1 && setSelectedKey(itemIndex === 0 ? 'home' : items?.find((_item: any) => location.pathname.includes(_item.key))['key'])
    }, [location])

    return (
        <Sider trigger={null} collapsible theme="light" collapsedWidth={81} collapsed={true} style={{
            ...LAYOUT_STYLE.sidebar, overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
        }}>

            <div style={LAYOUT_STYLE.image}>
               <LogoIcon />
            </div>

            <AntMenu theme="light" selectedKeys={[selectedKey]} mode="inline" style={{ background: '#F9FAFB', border: 'none', }} onClick={onMenuItemClick}>
                {
                    items.map((item: any, index: number) => renderMenu(item, selectedKey))
                }
            </AntMenu>
            {/* <div>
                <a href={`${SLACK_URL}?` + GENERATE_URL_PARAMS().toString()}>Connect to Slack</a>
            </div> */}
        </Sider>
    )
}

export default AppSidebar