/* eslint-disable react-hooks/exhaustive-deps */

import { getRandomId } from '@/layouts/sidebar';
import { ConnectionButton } from '@/pages/chat/ChatFooter/ChatFooter.styles';
import { removeLocalStorage, setLocalStorage } from '@/utils';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationTabs } from './navigationtab.style';

interface ChildrenProps {
    children: React.ReactElement<any, any>
    tabKey?: string
    tabName?: string
}

interface TabProps {
    id?: string | number | undefined,
    key?: string | undefined,
    label?: string | undefined,
    params?: string | undefined,
    isPermanent?: boolean | undefined
}   

export const RouteContext = React.createContext([]);


const dropdownStyle = {
    background: "#F3F4F6",
    border: "0.5px solid #D1D5DB",
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)",
    borderRadius: 8,
    height: 'auto',
    padding: 10,
    width: 200
}

const AddMenu = () => {
    const navigate = useNavigate()
    const initiateChat = () => {
        const chatId = getRandomId();
        setLocalStorage(`chat_${chatId}`, chatId);
        navigate(`/chats/${chatId}?tab=chats`)
    }
    const dropdownContent = () => <div style={dropdownStyle}>
        <ConnectionButton onClick={() => initiateChat()} block type="text">Initiate new chat</ConnectionButton>
    </div>
    return (
        <Dropdown dropdownRender={() => dropdownContent()} arrow={true} trigger={['click']}><Button size="small" type='text' icon={<PlusOutlined />} /></Dropdown>
    )
}


const BrowserTab = ({ children }: ChildrenProps) => {
    const [routes, setRoutes]: any[] = React.useState<TabProps[]>([]);
    const [activeTab, setActiveTab] = React.useState<string | undefined>('')

    const location = useLocation();
    const navigate = useNavigate();
    const search = location.search;
    const name = new URLSearchParams(search).get('tabKey')

    React.useEffect(() => {
        const route = routes.find((route: any) => route.key === location.pathname);
        setActiveTab(location.pathname)
        if (!route && name) {
            const permanentRoutes = routes.filter((route: any) => route.isPermanent === true);
            setRoutes([...permanentRoutes, { id: Date.now(), key: location.pathname, label: name, params: location.search, isPermanent: true }]);
        }
    }, [location.pathname, name]);

    React.useEffect(() => {
        const index = routes.findIndex((route: any) => route.key === location.pathname);
        if (index > -1) {
            setRoutes((oldRoutes: any) => oldRoutes.map((route: any) => route.key === location.pathname ? { ...route, params: location.search } : route))
        }

    }, [location.search])

    const handleChange = (value: string) => {
        const tab = routes.find((route: any) => route.key === value);
        setActiveTab(value)
        tab ? navigate(`${value}${tab['params']}`) : navigate(value)

    };

    const removeTab = (path: string) => {
        const index = routes.findIndex((route: any) => route.key === path);

        if (index > -1) {
            const updatedRoutes = [...routes.slice(0, index), ...routes.slice(index + 1)];
            const permanentRoutes: TabProps[] = updatedRoutes.filter((route: any) => route.isPermanent === true);
            if (routes[index]['label'] === 'chats') {
                const chatId = routes[index]['key'].split('/').filter((x:string) => x)[1];
                removeLocalStorage(`chat_${chatId}`);
            }
            setRoutes(updatedRoutes)
            if (permanentRoutes.length > 0) {
                const lastIndex = permanentRoutes.length - 1
                setActiveTab(permanentRoutes[lastIndex].key)
                navigate(`${permanentRoutes[lastIndex].key}${permanentRoutes[lastIndex].params}`)
            }
            else {
                navigate('/')
            }

        }
    }

    const onEdit = (
        targetKey: any,
        action: 'add' | 'remove',
    ) => {
        if (action === 'add') {
            console.log('add action here')
        } else {
            removeTab(targetKey);
        }
    };

    return (
        <React.Fragment>
            {
                routes.length > 0 &&
                <NavigationTabs
                    type="editable-card"
                    onChange={handleChange}
                    activeKey={activeTab}
                    onEdit={onEdit}
                    items={routes}
                    addIcon={<AddMenu />}
                />
            }
            <RouteContext.Provider value={routes}>
                <Content style={{ minHeight: '80vh', background: '#fff', padding: 30 }}>
                    {children}
                </Content>
            </RouteContext.Provider>
        </React.Fragment>
    )

}
export default BrowserTab