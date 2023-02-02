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
        <Box sx={{p: 0, overflowY: 'auto', minHeight: '100%',width:'100%',maxWidth:'1000px', display: 'flex', gap: 2, flexDirection: 'column',mx:'auto'}}>
            <Box sx={{ml:2 }}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={searchQuery} setSearchQuery={handleApplicationSearchQuery}></ApplicationHeader>
            </Box>
            <Box sx={{ gap: 4}}>
                {rows.map(row => 
                    <Box sx={{ gap: 1}}>
                        <Box>
                            <Typography variant="allApplicationViewSectionHeader">
                                {row.label}
                            </Typography>
                        </Box>
                        <Box sx={{ overflowX: 'auto'}}>
                            {row.component(rowProp)}
                        </Box>
                    </Box>    
                )}
            </Box>
        </Box>
    )
}

export default AllApplicationView