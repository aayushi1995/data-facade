import { Box, Card, Link, Typography } from "@mui/material"
import { ReactQueryWrapper } from "../../common/components/ReactQueryWrapper"
import { lightShadows } from "../../css/theme/shadows"
import { Dashboard } from "../../generated/entities/Entities"
import { ChartWithData } from "../../generated/interfaces/Interfaces"
import useGetActionExecution from "./hooks/useGetActionExecution"

export interface ShowDashboardMetadataProps {
    dashboardData: Dashboard,
    chartData: ChartWithData[]
}

const ShowDashboardMetadata = (props: ShowDashboardMetadataProps) => {
    const [flowData, isLoading, error] = useGetActionExecution({
        filter: {
            Id: props.dashboardData.FlowId || "NA"
        }
    })

    const handleFlowLinkClick = () => {
        window.open(`/application/workflow-execution/${props.dashboardData.FlowId}`)
    }

    return (
        <ReactQueryWrapper isLoading={isLoading} error={error} data={flowData}>
            {() => 
                <Box mt={2} sx={{display: 'flex', p: 2, gap: 4}}>
                    <Card sx={{display: 'flex', flexDirection: 'column', gap: 2, boxShadow: lightShadows[27], maxHeight: '150px', minWidth: '300px', justifyContent: 'center'}}>
                        <Box sx={{display: 'flex', gap: 10, p: 3, justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Typography variant="heroHeader" sx={{fontSize: '20px'}}>
                                Dashboard Flow
                            </Typography>
                            <Link sx={{fontFamily: 'SFProText', fontSize: '20px', cursor: 'pointer'}} onClick={handleFlowLinkClick}>{flowData?.[0]?.ActionInstanceName}</Link>
                        </Box>
                    </Card>
                </Box>
            }
        </ReactQueryWrapper>
    )
}

export default ShowDashboardMetadata