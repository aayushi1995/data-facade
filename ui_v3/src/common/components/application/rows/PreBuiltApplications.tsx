import { Box, Grid } from "@mui/material"
import { AllApplicationRowProps } from "../../../../pages/apps/components/AllApplicationView"
import LoadingWrapper from "../../LoadingWrapper"
import { ApplicationCardViewResponse } from "./../../../../generated/interfaces/Interfaces"
import ApplicationCard from "./../ApplicationCard"
import { useGetPrebuiltApplications } from "./../hooks/useGetPrebuildApplications"


const PreBuiltApplications = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery||""
    const prebuiltAppsQuery = useGetPrebuiltApplications()
    const renderCards = (prebuiltApplications: ApplicationCardViewResponse[] | undefined) => {
        const filteredApplications = (prebuiltApplications||[]).filter(prebuiltApplication => prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase())||prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase()))

        return filteredApplications.map(prebuiltApplication => 
            <Grid item xs={12} lg={12} md={12} xl={12} sx={{px:5}}>
                <Box sx={{ height: '100%', padding:'5px',mx:7}}  key={prebuiltApplication.ApplicationId}>
                    <ApplicationCard application={prebuiltApplication} isInstalled={true}/>
                </Box>
            </Grid>
        )
    }

    return(
        <LoadingWrapper isLoading={prebuiltAppsQuery.isLoading} error={prebuiltAppsQuery.error} data={prebuiltAppsQuery.data}>
            <Grid container spacing={1} sx={{overflowX: 'auto', minWidth: '100%'}}>
                {renderCards(prebuiltAppsQuery.data)}
            </Grid>
        </LoadingWrapper>
    )
}

export default PreBuiltApplications