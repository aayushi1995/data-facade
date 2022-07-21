import { Box, Card } from "@mui/material"
import React from "react"
import { ActionParameterDefinition } from "../../../../../generated/entities/Entities"
import { ConfigureParametersContext, SetParametersConfigContext } from "../../context/ConfigureParametersContext"
import ActionParameterDefinitionList from "../ViewSelectedAction/ActionParameterDefinitionList/ActionParameterDefinitionList"
import EditActionParameterDefinition from "../ViewSelectedAction/EditActionParameterDefinition/EditActionParameterDefinition"


const ConfigureAllParameters = () => {
    const configureParametersContext = React.useContext(ConfigureParametersContext)
    const setParametersConfigContext = React.useContext(SetParametersConfigContext)
    const [selectedParameterForEdit, setSelectedParameterForEdit] = React.useState<ActionParameterDefinition|undefined>()
    console.log(configureParametersContext)
    const action = configureParametersContext.actionData
    const defaultActionTemplate = action.ActionTemplatesWithParameters.find(template => template.model.Id === action.ActionDefinition.model.DefaultActionTemplateId)
    const firstActionTemplate = action.ActionTemplatesWithParameters[0]
    const selectedActionTemplate = defaultActionTemplate || firstActionTemplate
    const selectedActionTemplateModel = selectedActionTemplate?.model
    const selectedActionParams = selectedActionTemplate?.actionParameterDefinitions

    if(!selectedParameterForEdit && !!selectedActionParams) {
        setSelectedParameterForEdit(selectedActionParams?.[0]?.model)
    }

    const deleteParametersWithIds = (actionParameterIds: string[]) => console.log("Deleting", actionParameterIds)
    const onParameterSelectForEdit = (actionParameter: ActionParameterDefinition) => setSelectedParameterForEdit(actionParameter) 

    return (
        <Card
            sx={{
                borderRadius: 1,
                p: 2,
                height: "100%"
            }}
            variant={'outlined'}    
        >
            <Box sx={{display: "flex", flexDirection: "column", gap: 5}}>
                <Box>
                    <EditActionParameterDefinition 
                        parameter={selectedParameterForEdit}
                        template={selectedActionTemplateModel}
                        stageId={configureParametersContext?.workflowDetails?.stageId || ""}
                        actionIndex={configureParametersContext?.workflowDetails?.actionIndex || 0}
                    />
                </Box>
                <Box>
                    <ActionParameterDefinitionList templateWithParams={selectedActionTemplate} onParameterSelectForEdit={onParameterSelectForEdit} deleteParametersWithIds={deleteParametersWithIds}/>
                </Box>
            </Box>
        </Card> 
    )
} 

export default ConfigureAllParameters