import { Box, Grid } from "@mui/material";
import React from "react";
import ApplicationCard from "../../../common/components/application/ApplicationCard";
import { useApplicationWithInstallationStatusQuery } from "../../../common/components/application/hooks/useGetPrebuildApplications";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import { SetModuleContextState } from "../../../common/components/main_module/context/ModuleContext";
import { ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces";

const ApplicationMarketplace = () => {
    const marketplaceQuery = useApplicationWithInstallationStatusQuery()
    const setModuleContext = React.useContext(SetModuleContextState)

    React.useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "Application Marketplace",
                    SubTitle: "Install Applications on Demand"
                }
            }
        })
    }, [])
    
    const renderCards = (apps: ApplicationCardViewResponse[] | undefined) => {
        return apps?.map(app => 
            <Grid item xs={12} lg={12} md={12} xl={12} sx={{py:1,px:8,ml:4}}>
                <Box sx={{ height: '100%',mx:3 }}  key={app.ApplicationName}>
                    <ApplicationCard application={app} isInstalled={app.InstallationStatus || false} isInstalledFromMarketplace={app.InstallationStatus || false}/>
                </Box>
            </Grid>
        )
    }

    return(
        <Box sx={{mx:-6}}>
            <LoadingWrapper isLoading={marketplaceQuery.isLoading} error={marketplaceQuery.error} data={marketplaceQuery.data}>
                <Grid container spacing={1} sx={{overflowX: 'auto', minWidth: '100%'}}>
                    {renderCards(marketplaceQuery.data)}
                </Grid>
            </LoadingWrapper>
        </Box>
    )
}

export default ApplicationMarketplace;