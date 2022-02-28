import {useState} from "react";
import {useLocation} from "react-router-dom";
import {getTabByHref} from "./DataRoutesConfig";



export const useTabState = () => {
    const {pathname} = useLocation();
    const currentTab = getTabByHref(pathname);
    /**
     * keeping subTitle of a tab as unique state
     */
    const [tabContent, setTabContent] = useState({});

    return {
        currentTab,
        tabContent,
        setTabContent
    }
};