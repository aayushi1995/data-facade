import { Box, IconButton, Typography } from "@mui/material"
import { ActionDefinition } from "../../../generated/entities/Entities"
import EditActionIcon from "../../../../src/images/EditActionIcon.svg"
import { generatePath, useHistory } from "react-router"
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE, WORKFLOW_EDIT_ROUTE } from "../../../common/components/header/data/ApplicationRoutesConfig"
import CircularDot from "./CircularDot"


interface ActionLevelInfoProps {
    actionDefinition: ActionDefinition,
    subTexts: string[],
    isFlow?: boolean
}

const ActionLevelInfo = (props: ActionLevelInfoProps) => {

    const history = useHistory()

    const {actionDefinition, subTexts} = props

    const finalSubtext = subTexts.join(" . ")
    const handleEditAction = () => {
        if(props.isFlow) {
            history.push(generatePath(WORKFLOW_EDIT_ROUTE, {WorkflowId: actionDefinition.Id}))
        } else {
            history.push(generatePath(APPLICATION_EDIT_ACTION_ROUTE_ROUTE, {ActionDefinitionId: actionDefinition.Id}))
        }
    }

    return (
        <Box sx={{display: 'flex', width: '100%', flexDirection: 'column', gap: 2}}>
            <Box sx={{display: 'flex', gap: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
                <Typography variant="executeActionName">
                    {actionDefinition.DisplayName || actionDefinition.UniqueName}
                </Typography>
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    {subTexts.map(text => (
                        <Box sx={{display: 'flex', gap: 1, alignItems: 'center'}}>
                            <Typography variant="executeActionSubtext">
                                {text}
                            </Typography>
                            <CircularDot />
                        </Box>
                    ))}
                    
                    <IconButton onClick={handleEditAction}>
                        <img src={EditActionIcon} />
                    </IconButton>
                </Box>
            </Box>
            <Typography variant="executeActionDescription" sx={{maxWidth: '100%', overflowWrap: 'break-word'}}>
                {actionDefinition.Description || actionDefinition.DisplayName}
            </Typography>
        </Box>
    )

}

export default ActionLevelInfo