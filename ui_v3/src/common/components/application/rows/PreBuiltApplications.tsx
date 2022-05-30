import {useGetPrebuiltApplications} from "./../hooks/useGetPrebuildApplications"
import {Box, Grid} from "@mui/material"
import ApplicationCard from "./../ApplicationCard"
import {ApplicationCardViewResponse} from "./../../../../generated/interfaces/Interfaces"
import {AllApplicationRowProps} from "../../../../pages/apps/components/AllApplicationView"
import {withReactQueryWrapper} from "../../ReactQueryWrapper";


const PreBuiltApplications = (props: AllApplicationRowProps) => {
    const searchQuery = props.searchQuery || ""
    const prebuiltAppsQuery = useGetPrebuiltApplications()

    const PrebuiltApplicationCards = ({data: prebuiltApplications}: { data: ApplicationCardViewResponse[] | undefined }) => {
        return <Grid container spacing={1} sx={{overflowX: 'auto', minWidth: '100%'}}>{
            (prebuiltApplications || [])
                .filter(prebuiltApplication => prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase()) || prebuiltApplication.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase()))
                .map(prebuiltApplication =>
                    <Grid item xs={12} lg={3} sm={6} md={4}>
                        <Box sx={{height: '100%', p: 2}} key={prebuiltApplication.ApplicationId}>
                            <ApplicationCard application={prebuiltApplication}/>
                        </Box>
                    </Grid>
                )}
        </Grid>;
    }
    const PrebuiltApplicationCardsWithData = withReactQueryWrapper(PrebuiltApplicationCards, prebuiltAppsQuery);
    return (
        <PrebuiltApplicationCardsWithData/>
    )
}

export default PreBuiltApplications