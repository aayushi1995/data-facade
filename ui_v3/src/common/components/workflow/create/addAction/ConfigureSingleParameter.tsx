import { Box } from "@mui/material"
import React from "react"
import { ConfigureParametersContext } from "../../context/ConfigureParametersContext"
import EditActionParameterDefinition from "../ViewSelectedAction/EditActionParameterDefinition/EditActionParameterDefinition"

interface ConfigureSingleParameterProps {

}

const ConfigureSingleParameter = (props: ConfigureSingleParameterProps) => {

    const configureParametersContext = React.useContext(ConfigureParametersContext)
    const selectedParameter = configureParametersContext?.parameters?.[configureParametersContext.currentParameterIndex || 0]

    return (
        <Box>
            <EditActionParameterDefinition 
                parameter={selectedParameter?.model}
                template={configureParametersContext.selectedActionTemplate || {}}
                stageId={configureParametersContext.workflowDetails?.stageId || ""}
                actionIndex={configureParametersContext.workflowDetails?.actionIndex || 0}
            />
        </Box>
    )
}

export default ConfigureSingleParameter