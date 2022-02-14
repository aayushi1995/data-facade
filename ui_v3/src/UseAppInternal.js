import useSettings from "./data_manager/useSettings";
import {useEffect, useState} from "react";
import {useHeader} from "./common/components/sideBar/useHeader";
import {createCustomTheme} from "./css/theme";
import {useUserSettingsSingleton} from "./data_manager/userSettingsSingleton";
import {useAuth0} from "@auth0/auth0-react";
import {FDSEndpoint} from "./common/config/config";
import {makeStyles} from "@material-ui/styles";
import dataManager from "./data_manager/data_manager";

const useStyles = makeStyles(() => ({

    header: {
        display: 'flex',
        opacity: 1,
        zIndex: 5,
        flexDirection: 'column'
    },
    sticky: {
        position: 'fixed',
        top: 0,
        width: '100%'
    },
    leftSideBar: {
        transition: 'flex-basis 0.1s ease-in-out',
        justifyContent: "space-between",
        display: "flex",
        overflowX: 'auto'
    },
    mainContainer: {
        overflowX: 'auto',
        justifyContent: "flex-start",
        display: "flex",
        top: 64,
        position: "relative",
        padding: "0 24px",
        width: "calc(100% - 224px)",
        left: 224
    }
}));
const fetchDummyData = (token, endPoint, email) => {
    return dataManager.getInstance.dummyData(email, token).then(res => {
        if (res.ok) {
            return res.json()
        } else {
            return {status: res.status}
        }
    });
}

export function useAppInternal() {
    const classes = useStyles();
    const {settings} = useSettings();
    const [userEmail, setUserEmail] = useState()
    const [userName, setUserName] = useState("")
    const [token, setToken] = useState()
    const [workspaceName, setWorkspaceName] = useState()
    const [dummyData, setDummyData] = useState()
    const [dummyDataPending = 1, setDummyDataPending] = useState(0)
    const {activeLink, setActiveLink} = useHeader();
    const theme = createCustomTheme({
        direction: settings.direction,
        responsiveFontSizes: settings.responsiveFontSizes,
        roundedCorners: settings.roundedCorners,
        theme: settings.theme
    });
    useUserSettingsSingleton(userEmail, userName, token, workspaceName);

    const userSettings = {
        userEmail,
        userName,
        token,
        workspaceName,
        setUserEmail,
        setUserName,
        setToken
    }


    const {isLoading, isAuthenticated, user, getAccessTokenSilently} = useAuth0()


    useEffect(() => {
        if (isAuthenticated) {
            getAccessTokenSilently().then(receivedToken => {
                setToken(receivedToken)
                setUserEmail(user.email)
                setUserName(user.name)
                fetchDummyData(receivedToken, FDSEndpoint, user.email).catch(console.error).then(res => {
                    setDummyData(res);
                    setWorkspaceName(res?.organizationDbSchemaName);
                    setDummyDataPending(2);
                });
            }).catch(console.error);
        }
    }, [getAccessTokenSilently, isAuthenticated, user]);
    return {
        classes,
        userEmail,
        dummyData,
        dummyDataPending,
        activeLink,
        setActiveLink,
        theme,
        userSettings,
        isLoading,
        user
    };
}