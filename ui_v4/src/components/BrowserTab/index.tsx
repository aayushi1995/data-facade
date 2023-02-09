/* eslint-disable react-hooks/exhaustive-deps */

import { Content } from 'antd/es/layout/layout';
import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { NavigationTabs } from './navigationtab.style';

interface ChildrenProps {
    children: React.ReactElement<any, any>
}

interface TabProps {
    id?: string | number | undefined,
    key?: string | undefined,
    label?: string | undefined,
    params?: string | undefined,
    isPermanent?: boolean | undefined

}

export const RouteContext = React.createContext([]);

const BrowserTab = ({ children }: ChildrenProps) => {
    const [routes, setRoutes]: any[] = React.useState<TabProps[]>([]);
    const [activeTab, setActiveTab] = React.useState<string | undefined>('')
    const location = useLocation();
    const navigate = useNavigate();
    const search = location.search;
    const name = new URLSearchParams(search).get('tab')
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