import React from "react"
import { Grid, Box, Typography } from '@material-ui/core'
import ApplicationHeader from '../../../common/components/application/ApplicationHeader'
import PreBuiltApplications from '../../../common/components/application/PreBuiltApplications'

const AllApplicationView = () => {
    const [applicationSearchQuery, setApplicationSearchQuery] = React.useState("")

    const handleApplicationSearchQuery = (search: string) => {
        setApplicationSearchQuery(search)
    }

    return (
        <Box sx={{p: 1, overflowY: 'auto', minHeight: '100%', display: 'flex', gap: 2, flexDirection: 'column'}}>
            <Box sx={{flex: 1}}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={applicationSearchQuery} setSearchQuery={handleApplicationSearchQuery}></ApplicationHeader>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                    <Box sx={{flex: 1}}>
                        <Typography sx={{color: '#304FFE'}}>
                            Prebuilt Apps
                        </Typography>
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <PreBuiltApplications searchQuery={applicationSearchQuery}/>
                    </Box>
                </Box>
                {/* <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{flex: 1}}>
                        Prebuilt Apps
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <PreBuiltApplications/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{flex: 1}}>
                        Prebuilt Apps
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <PreBuiltApplications/>
                    </Box>
                </Box>
                <Box sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <Box sx={{flex: 1}}>
                        Prebuilt Apps
                    </Box>
                    <Box sx={{flex: 1, overflowX: 'auto'}}>
                        <PreBuiltApplications/>
                    </Box>
                </Box> */}
            </Box>
        </Box>
    )
}

export default AllApplicationView