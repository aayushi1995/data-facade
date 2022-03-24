import NoData from "../NoData"
import { useGetPrebuiltApplications } from "./hooks/useGetPrebuildApplications"
import { Box, Card } from "@mui/material"
import ApplicationCard from "./ApplicationCard"
import { ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces"

interface PreBuiltApplicationsProps {
    searchQuery: string
}

const PreBuiltApplications = (props: PreBuiltApplicationsProps) => {
    const { searchQuery } = props
    const [applications, error, loading] = useGetPrebuiltApplications()

    const filterBySearchQuery = (apps: ApplicationCardViewResponse[]) => {
        return apps.filter(app => app.ApplicationName?.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    if(loading) {
        return <>Loading...</>
    } else if(!!applications) {
        const applicationCardsToRender = filterBySearchQuery(applications).map(application => {
            return (
                <Box sx={{ height: '100%', p: 2, ml: 2}}>
                    <ApplicationCard application={application}/>
                </Box>
            )
        })

        return (
            <Box sx={{display: 'flex', overflowX: 'auto', flexDirection: 'row', maxWidth: '100%', minHeight: '100%', gap: 1, justifyContent: 'flex-start', pb: 2}}>
                {applicationCardsToRender}
            </Box>
        )
    } else {
        return <NoData/>
    }
}

export default PreBuiltApplications