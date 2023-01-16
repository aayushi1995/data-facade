import { Typography } from "@mui/material"
import { ActionParameterDefinition } from "../../../generated/entities/Entities"
import StyledParameterDescriptionCard from "../styled_components/StyledParameterDescriptionCard"


interface ParameterDescriptionCardProps {
    parameter: ActionParameterDefinition
}

const ParameterDescriptionCard = (props: ParameterDescriptionCardProps) => {
    return (
        <StyledParameterDescriptionCard sx={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', width: '100%', height: '100%', gap: 1, maxHeight: '200px', overflowY: 'auto'}}>
            <Typography variant="executeActionName" sx={{fontSize: '13px'}}>
                Input Description
            </Typography>
            <Typography variant="executeActionDescription" sx={{width: '100%', overflowWrap: 'break-word'}}>
                {props.parameter.Description || props.parameter.DisplayName}
            </Typography>
        </StyledParameterDescriptionCard>
    )
}

export default ParameterDescriptionCard