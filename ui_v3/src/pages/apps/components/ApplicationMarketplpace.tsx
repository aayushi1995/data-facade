import { Box, Grid } from "@mui/material";
import React from "react";
import ApplicationCard from "../../../common/components/application/ApplicationCard";
import { useApplicationWithInstallationStatusQuery } from "../../../common/components/application/hooks/useGetPrebuildApplications";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import { SetModuleContextState } from "../../../common/components/ModuleContext";
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
            <Grid item xs={12} lg={4} md={6} xl={3}>
                <Box sx={{ height: '100%', p: 2}}  key={app.ApplicationName}>
                    <ApplicationCard application={app} isInstalled={false}/>
                </Box>
            </Grid>
        )
    }

    return(
        <LoadingWrapper isLoading={marketplaceQuery.isLoading} error={marketplaceQuery.error} data={marketplaceQuery.data}>
            <Grid container spacing={1} sx={{overflowX: 'auto', minWidth: '100%'}}>
                {renderCards(marketplaceQuery.data)}
            </Grid>
        </LoadingWrapper>
    )
}

export default ApplicationMarketplace;