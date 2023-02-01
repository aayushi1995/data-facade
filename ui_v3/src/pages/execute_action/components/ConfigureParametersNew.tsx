import { Box, Grid } from "@mui/material"
import React from "react"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { ActionParameterAdditionalConfig } from "../../../common/components/workflow/create/ParameterInput"
import { ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities"
import ParameterDescriptionCard from "./ParameterDescriptionCard"


interface ConfigureParametersPropsNew {
    mode: "GENERAL" | "ADVANCED",
    ActionParameterDefinitions: ActionParameterDefinition[],
    ActionParameterInstances: ActionParameterInstance[],
    ParameterAdditionalConfig: ActionParameterAdditionalConfig[],
    showOnlyParameters?: boolean
    handleParametersChange: (newActionParameterInstances: ActionParameterInstance[]) => void,
    parentExecutionId?: string,
    fromTestRun?: boolean
}

export const isDefaultValueDefined = (parameterDefaultValue?: string) => {
    const defaultParameterInstance = JSON.parse(parameterDefaultValue || "{}") as ActionParameterInstance

    return !!defaultParameterInstance.ParameterValue || !!defaultParameterInstance.TableId || !!defaultParameterInstance.ColumnId
}

const ConfigureParametersNew = (props: ConfigureParametersPropsNew) => {

    const filteredParameters = (props.mode === "GENERAL" ? 
            props.ActionParameterDefinitions?.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue) ) 
            : props.ActionParameterDefinitions?.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue))).sort((p1, p2) => ((p1?.Index||0) > (p2?.Index||1)) ? 1 : -1)
        
    const [parameterSelected, setParameterSelected] = React.useState<ActionParameterDefinition | undefined>()

    const onParameterClick = (parameterId: string) => {
        const parameter = filteredParameters.find(apd => apd.Id === parameterId)
        setParameterSelected(parameter)
    }

    const numberOfParameters = filteredParameters.length
    
    if(numberOfParameters <= 4) {
        return (
            <Grid container spacing={3} justifyContent="center" direction={props.fromTestRun ? "column" : "row"}>
                {filteredParameters.map(parameterDef => {
                    return (
                        <Grid item sm={12} md={12/numberOfParameters} >
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, width: '100%'}}>
                                <ParameterDefinitionsConfigPlane 
                                    parameterDefinitions={[parameterDef]}
                                    parameterInstances={props.ActionParameterInstances}
                                    parameterAdditionalConfigs={props.ParameterAdditionalConfig || []}
                                    handleChange={props.handleParametersChange}
                                    onParameterClick={onParameterClick}
                                    parentExecutionId={props.parentExecutionId}
                                />
                                <ParameterDescriptionCard parameter={parameterDef} />
                            </Box>
                        </Grid>
                    )
                })}
            </Grid>
        )
    }

    const getParamsToShowInGroups = () => {
        const paramArrayByGroup: ActionParameterDefinition[][] = []
        for(let i = 0 ; i < filteredParameters.length/5 ; i ++) {
            const paramsToShow = filteredParameters.slice(i*5, Math.min(filteredParameters.length, (i+1)*5))
            paramArrayByGroup.push(
                paramsToShow
            )
        }
        return paramArrayByGroup
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'row', gap: 3, overflow: 'scroll', width: '100%', height: '100%'}}>
            {getParamsToShowInGroups().map((groupParams) => (
                <Box sx={{minHeight: '350px', overflow: 'scroll', minWidth: '250px'}}>
                    <ParameterDefinitionsConfigPlane parameterDefinitions={groupParams}
                        parameterInstances={props.ActionParameterInstances}
                        parameterAdditionalConfigs={props.ParameterAdditionalConfig || []}
                        handleChange={props.handleParametersChange}
                        onParameterClick={onParameterClick}
                        parentExecutionId={props.parentExecutionId}
                    />
                </Box>
            ))}
            <Box sx={{width: '300px'}}>
                <ParameterDescriptionCard parameter={parameterSelected || {DisplayName: "No parameter Selected"}} />
            </Box>
        </Box>
    )
}

export default ConfigureParametersNew
