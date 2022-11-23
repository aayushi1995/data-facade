import {totalItems} from "./sideMenuConfig";
import React, {useState} from "react";

export const location = window.location.href;
export const menuState = {
    open: false,
    activeLink: totalItems.find((item) => location?.includes(item.linkTo))?.name
}
export const observers = {
    items: []
};

export function useHeader() {

    const [, setMenuState] = useState(menuState);
    observers.items.push(setMenuState);
    const renderObservers = (menuState) => observers?.items?.forEach(setState => setState(menuState));
    React.useEffect(() => {
        return () => {
            observers.items = observers?.items?.filter(_ => _ === setMenuState);
        }
    }, []);
    const setActiveLink = (nextActiveLink) => {
        menuState.activeLink = !!nextActiveLink ? nextActiveLink : menuState.activeLink;
        renderObservers({...menuState});
    }
    return {
        activeLink: menuState.activeLink,
        setActiveLink
    };
}