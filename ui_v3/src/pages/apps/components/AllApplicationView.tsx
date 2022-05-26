import { Box, Typography } from '@mui/material'
import React from "react"
import ApplicationHeader from "../../../common/components/application/ApplicationHeader"
import AllActionDefinitionsView from '../../../common/components/application/rows/AllActionDefinitionsView'
import OrgActionDefinitions from "../../../common/components/application/rows/OrgActionDefinitions"
import OrgActionInstances from "../../../common/components/application/rows/OrgActionInstances"
import PinnedActionDefinitions from "../../../common/components/application/rows/PinnedActionDefinitions"
import PinnedActionInstances from "../../../common/components/application/rows/PinnedActionInstances"
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
            label: "Applications"
        },
        // {
        //     component: (props) => <PinnedActionDefinitions {...props}/>,
        //     label: "Pinned Actions"
        // },
        // {
        //     component: (props) => <PinnedActionInstances {...props}/>,
        //     label: "My Action Instances"
        // },
        // {
        //     component: (props) => <OrgActionDefinitions {...props}/>,
        //     label: "Public Actions"
        // },
        // {
        //     component: (props) => <OrgActionInstances {...props}/>,
        //     label: "Org Action Instances"
        // },
        {
            component: (props) => <AllActionDefinitionsView {...props}/>,
            label: ""
        }
    ]

    const rowProp: AllApplicationRowProps = {
        searchQuery: searchQuery
    }

    return (
        <Box sx={{p: 1, overflowY: 'auto', minHeight: '100%', display: 'flex', gap: 2, flexDirection: 'column'}}>
            <Box sx={{flex: 1}}>
                <ApplicationHeader pageHeader="Application" subHeading="Create, Manage Applications from here" searchQuery={searchQuery} setSearchQuery={handleApplicationSearchQuery}></ApplicationHeader>
            </Box>
            <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
                {rows.map(row => 
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', gap: 1}}>
                        <Box>
                            <Typography variant="allApplicationViewSectionHeader">
                                {row.label}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", overflowX: 'auto', p: 2, pt: 0 }}>
                            {row.component(rowProp)}
                        </Box>
                    </Box>    
                )}
            </Box>
        </Box>
    )
}

export default AllApplicationView