import { Box } from "@mui/material"
import React from "react"
import { RouteComponentProps } from "react-router"
import { ReactQueryWrapper } from "../../../../common/components/error-boundary/ReactQueryWrapper"
import { WebAppHomePageProps } from "../types/EditWebAppTypes"
import ComponentsTray from "./business/ComponentsTray"
import EditWebAppContextProvider from "./context/EditWebAppContextProvider"
import useWebAppEditHomePage from "./hooks/useGetWebAppEditHomePage"
import HeaderAndBody from "./presentation/custom/HeaderAndBody"




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
                    <HeaderAndBody webAppId={props.WebAppId}/>
                    <ComponentsTray webAppId={props.WebAppId}/>
                    {/* <CollapsibleDrawer
                        open={true}
                        openWidth="20%"
                        closedWidth="10px"
                        openDrawer={() => {}}
                        children={}
                    />     */}
                </Box>
            )}
            
        </ReactQueryWrapper>
    )

}


export default WebAppEditHomePage