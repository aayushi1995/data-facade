import { Grid } from "@mui/material"
import { useContext } from "react"
import ConfigureActionVisibility from "../../build_action_old/components/common-components/ConfigureActionVisibility"
import WrapInHeader from "../../build_action_old/components/common-components/WrapInHeader"
import { BuildActionContext, SetBuildActionContext } from "../../build_action_old/context/BuildActionContext"

const WorkflowSummary = () => {
    const buildActionContext = useContext(BuildActionContext)
    const setBuildActionContext = useContext(SetBuildActionContext)

    return (
        <Grid container spacing={2} sx={{p: 5}}>
            <Grid container spacing={2} item xs={12} lg={7}>
                <Grid container spacing={2} item xs={12} lg={6}>
                    <Grid item xs={12}>
                        <WrapInHeader header="Action Definition Behaviour">
                            <ConfigureActionVisibility/>
                        </WrapInHeader>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default WorkflowSummary