import { useGetPrebuiltApplications } from "./../hooks/useGetPrebuildApplications"
import { Box, Card, Grid } from "@mui/material"
import ApplicationCard from "./../ApplicationCard"
import { ApplicationCardViewResponse } from "./../../../../generated/interfaces/Interfaces"
import LoadingWrapper from "../../LoadingWrapper"
import { AllApplicationRowProps } from "../../../../pages/apps/components/AllApplicationView"


const PreBuiltApplications = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery||""
    const prebuiltAppsQuery = useGetPrebuiltApplications()

    const renderCards = (prebuiltApplications: ApplicationCardViewResponse[] | undefined) => {
        const filteredApplications = (prebuiltApplications||[]).filter(prebuiltApplication => prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase())||prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase()))

        return filteredApplications.map(prebuiltApplication => 
            <Grid item xs={12} lg={3} sm={6} md={4}>
                <Box sx={{ height: '100%', p: 2}}  key={prebuiltApplication.ApplicationId}>
                    <ApplicationCard application={prebuiltApplication}/>
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