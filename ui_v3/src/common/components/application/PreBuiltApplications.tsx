import NoData from "../NoData"
import { useGetPrebuiltApplications } from "./hooks/useGetPrebuildApplications"
import { Box, Card } from "@material-ui/core"
import ApplicationCard from "./ApplicationCard"

interface PreBuiltApplicationsProps {
    searchQuery: string
}

const PreBuiltApplications = (props: PreBuiltApplicationsProps) => {
    const [applications, error, loading] = useGetPrebuiltApplications()
    if(loading) {
        return <>loading...</>
    } else if(applications) {
        return (
            <Box sx={{display: 'flex', overflowX: 'auto', flexDirection: 'row', maxWidth: '100%', minHeight: '100%', gap: 1, justifyContent: 'flex-start'}}>
                {applications.filter(application => application.Name?.toLocaleLowerCase()?.includes(props.searchQuery.toLocaleLowerCase())).map(application => {
                    return (
                        <Box sx={{ height: '100%', p: 2}}>
                            <ApplicationCard application={application}/>
                        </Box>
                    )
                })}
            </Box>
        )
    } else {
        return <NoData/>
    }
}

export default PreBuiltApplications