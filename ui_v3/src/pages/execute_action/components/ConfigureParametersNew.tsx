import { Box, Card, Grid, Typography } from "@mui/material"
import React from "react"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { ActionParameterAdditionalConfig } from "../../../common/components/workflow/create/ParameterInput"
import { ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities"
import ParameterDescriptionCard from "./ParameterDescriptionCard"
import { StyledIPCard } from "./StyledComponents"


interface ConfigureParametersPropsNew {
    mode: "GENERAL" | "ADVANCED",
    ActionParameterDefinitions: ActionParameterDefinition[],
    ActionParameterInstances: ActionParameterInstance[],
    ParameterAdditionalConfig: ActionParameterAdditionalConfig[],
    showOnlyParameters?: boolean
    handleParametersChange: (newActionParameterInstances: ActionParameterInstance[]) => void,
    parentExecutionId?: string,
}

export const isDefaultValueDefined = (parameterDefaultValue?: string) => {
    const defaultParameterInstance = JSON.parse(parameterDefaultValue || "{}") as ActionParameterInstance

    return !!defaultParameterInstance.ParameterValue || !!defaultParameterInstance.TableId || !!defaultParameterInstance.ColumnId
}

const ConfigureParametersNew = (props: ConfigureParametersPropsNew) => {

    const filteredParameters = props.mode === "GENERAL" ? 
            props.ActionParameterDefinitions?.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue) ) 
            : props.ActionParameterDefinitions?.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue))
        
    const [parameterSelected, setParameterSelected] = React.useState<ActionParameterDefinition | undefined>()

    const onParameterClick = (parameterId: string) => {
        const parameter = filteredParameters.find(apd => apd.Id === parameterId)
        setParameterSelected(parameter)
    }

    const numberOfParameters = filteredParameters.length
    
    if(numberOfParameters <= 4) {
        return (
            <Grid container spacing={3} justifyContent="center">
                {filteredParameters.map(parameterDef => {
                    return (
                        <Grid item sm={12} md={12/numberOfParameters} >
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
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
        for(let i = 0 ; i <= filteredParameters.length/5 ; i ++) {
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

function userInputHeader(label: String) {
    return <Typography sx={{
        fontFamily: "'SF Pro Display'",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "18px",
        lineHeight: "24px",
        mt: 1,
        p: 2
    }}>
        {label}
    </Typography>
}

function getTypogrpahySx() {
    return {
        fontFamily: "'SF Pro Display'",
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: "18px",
        lineHeight: "24px",
        mt: 1,
        p: 2
    }
}
