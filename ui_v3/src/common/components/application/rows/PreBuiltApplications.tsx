import { useGetPrebuiltApplications } from "./../hooks/useGetPrebuildApplications"
import { Box, Card } from "@mui/material"
import ApplicationCard from "./../ApplicationCard"
import { ApplicationCardViewResponse } from "./../../../../generated/interfaces/Interfaces"
import LoadingWrapper from "../../LoadingWrapper"
import { AllApplicationRowProps } from "../../../../pages/apps/components/AllApplicationView"


const PreBuiltApplications = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery||""
    const prebuiltAppsQuery = useGetPrebuiltApplications()

    const renderCards = (prebuiltApplications: ApplicationCardViewResponse[] | undefined) => (prebuiltApplications||[])
        .filter(prebuiltApplication => prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase())||prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase()))
        .map(prebuiltApplication => 
            <Box sx={{ height: '100%', p: 2}}  key={prebuiltApplication.ApplicationId}>
                <ApplicationCard application={prebuiltApplication}/>
            </Box>
        )

    return(
        <LoadingWrapper isLoading={prebuiltAppsQuery.isLoading} error={prebuiltAppsQuery.error} data={prebuiltAppsQuery.data}>
            {renderCards(prebuiltAppsQuery.data)}
        </LoadingWrapper>
    )
}

export default PreBuiltApplications