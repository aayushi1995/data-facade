import { Box } from "@mui/material"
import React from "react"
import { RouteComponentProps } from "react-router"
import CollapsibleDrawer from "../../pages/build_action/components/form-components/CollapsibleDrawer"
import { WebAppHomePageProps } from "../types/EditWebAppTypes"
import ComponentsTray from "./business/ComponentsTray"
import HeaderAndBody from "./presentation/custom/HeaderAndBody"
import EditWebAppContextProvider, { EditWebAppContext, SetEditWebAppContext } from "./context/EditWebAppContextProvider"
import useWebAppEditHomePage from "./hooks/useGetWebAppEditHomePage"
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper"




export const WebAppEditHomePage = ({match}: RouteComponentProps<WebAppHomePageProps>) => {
    const actionDefinitionId = match.params.WebAppId

    return (
        <EditWebAppContextProvider>
            <WebAppEdit WebAppId={actionDefinitionId}/>
        </EditWebAppContextProvider>
    )
}

const WebAppEdit = (props: WebAppHomePageProps) => {
    const [componentDrawerState, setComponentDrawerState] = React.useState(true)
    
    const {loadContextWithWebApp, 
        webAppDetailsQuery} = useWebAppEditHomePage({webAppId: props.WebAppId})

    React.useEffect(() => {
        webAppDetailsQuery.refetch()
    }, [props.WebAppId])

    return (
        <ReactQueryWrapper {...webAppDetailsQuery}>
            {() => (
                <Box sx={{display: 'flex', gap: 1, justifyContent: 'flex-end'}}>
                    <HeaderAndBody />
                    <CollapsibleDrawer
                        open={true}
                        openWidth="20%"
                        closedWidth="10px"
                        openDrawer={() => {}}
                        children={<ComponentsTray webAppId={props.WebAppId}/>}
                    />    
                </Box>
            )}
            
        </ReactQueryWrapper>
    )

}


export default WebAppEditHomePage