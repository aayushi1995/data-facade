import { Box, IconButton, Typography } from "@mui/material"
import { generatePath, useHistory } from "react-router"
import EditActionIcon from "../../../../../src/assets/images/EditActionIcon.svg"
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE, WORKFLOW_EDIT_ROUTE } from "../../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { ActionDefinition } from "../../../../generated/entities/Entities"
import CircularDot from "./CircularDot"


interface ActionLevelInfoProps {
    actionDefinition: ActionDefinition,
    subTexts: string[],
    isFlow?: boolean
}

const ActionLevelInfo = (props: ActionLevelInfoProps) => {

    const history = useHistory()

    const { actionDefinition, subTexts } = props

    const finalSubtext = subTexts.join(" . ")
    const handleEditAction = () => {
        if (props.isFlow) {
            history.push(generatePath(WORKFLOW_EDIT_ROUTE, { WorkflowId: actionDefinition.Id }))
        } else {
            history.push(generatePath(APPLICATION_EDIT_ACTION_ROUTE_ROUTE, { ActionDefinitionId: actionDefinition.Id }))
        }
    }

    const containers= {
        display: 'flex', width: '100%', flexDirection: 'row', gap: 2,px:3
    }
    const NameDescContainer = {
        display: 'flex', gap: 1, flexDirection: 'column', justifyContent: 'flex-start',
    }
    const InfoContainer = {
        display: 'flex', alignItems: 'center', gap: 1 ,ml:'auto'
    }

    return (
        <Box sx={{ ...containers}}>
            <Box sx={{...NameDescContainer}}>
                <Typography variant="executeActionName">
                    {actionDefinition.DisplayName || actionDefinition.UniqueName}
                </Typography>
                    <Typography variant="executeActionDescription" sx={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
                        {actionDefinition.Description || actionDefinition.DisplayName}
                    </Typography>
            </Box>
            <Box sx={{...InfoContainer}}>
                {subTexts.map(text => (
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
    )

}

export default ActionLevelInfo