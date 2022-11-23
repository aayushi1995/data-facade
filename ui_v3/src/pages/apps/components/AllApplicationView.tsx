import { Box, Typography } from '@mui/material'
import React from "react"
import ApplicationHeader from "../../../common/components/application/ApplicationHeader"
import AllActionDefinitionsView from '../../../common/components/application/rows/AllActionDefinitionsView'
import PreBuiltApplications from "../../../common/components/application/rows/PreBuiltApplications"

interface AllApplicationViewRow {
    component: (props: AllApplicationRowProps) => React.ReactNode,
    label: string
}

export interface AllApplicationRowProps {
    searchQuery?: string
}

const AllApplicationView = () => {
    const [searchQuery, setSearchQuery] = React.useState("")

    const handleApplicationSearchQuery = (search: string) => {
        setSearchQuery(search)
    }

    const rows: AllApplicationViewRow[] = [
        {
            component: (props) => <PreBuiltApplications {...props}/>,
            label: ""
        },
        {
            component: (props) => <AllActionDefinitionsView {...props}/>,
            label: ""
        }
    ]

    const rowProp: AllApplicationRowProps = {
        searchQuery: searchQuery
    }

    return (
        <Box sx={{p: 0, overflowY: 'auto', minHeight: '100%', display: 'flex', gap: 2, flexDirection: 'column'}}>
            <Box sx={{flex: 1 , mx:5}}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={searchQuery} setSearchQuery={handleApplicationSearchQuery}></ApplicationHeader>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                {rows.map(row => 
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Box sx={{mx:6}}>
                            <Typography variant="allApplicationViewSectionHeader">
                                {row.label}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", overflowX: 'auto'}}>
                            {row.component(rowProp)}
                        </Box>
                    </Box>    
                )}
            </Box>
        </Box>
    )
}

export default AllApplicationView