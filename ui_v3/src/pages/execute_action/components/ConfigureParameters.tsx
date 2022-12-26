import { Box, Card, Grid, Typography } from "@mui/material"
import React from "react"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { ActionParameterAdditionalConfig } from "../../../common/components/workflow/create/ParameterInput"
import { ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities"
import { StyledIPCard } from "./StyledComponents"


interface ConfigureParametersProps {
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

const ConfigureParameters = (props: ConfigureParametersProps) => {

    const filteredParameters = props.mode === "GENERAL" ? 
            props.ActionParameterDefinitions?.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue) ) 
            : props.ActionParameterDefinitions?.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue))
        
    const [parameterSelected, setParameterSelected] = React.useState<ActionParameterDefinition | undefined>()

    const onParameterClick = (parameterId: string) => {
        console.log(parameterId)
        const parameter = filteredParameters.find(apd => apd.Id === parameterId)
        setParameterSelected(parameter)
    }
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={props.showOnlyParameters ? 12 : 6}>
                <StyledIPCard>
                    <Box sx={{ height: '450px'}}>
                        <Grid container spacing={2} direction="column" justifyContent="center">
                            <Grid item xs={3}>
                                <Box sx={{
                                    background: "#A4CAF0", display: 'flex', alignItems: 'center'
                                }}>
                                    {userInputHeader("User Input")}
                                </Box>
                            </Grid>
                            <Grid item xs={9} mx={3}>
                                <Box sx={{height:'350px',overflowY:'scroll',overflowX:'auto'}}>
                                    <ParameterDefinitionsConfigPlane 
                                        parameterDefinitions={filteredParameters}
                                        parameterInstances={props.ActionParameterInstances}
                                        parameterAdditionalConfigs={props.ParameterAdditionalConfig || []}
                                        handleChange={props.handleParametersChange}
                                        onParameterClick={onParameterClick}
                                        parentExecutionId={props.parentExecutionId}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </StyledIPCard>
            </Grid>
            {props.showOnlyParameters ? (
                <></>
            ) : (
                <Grid item xs={6}>
                    <StyledIPCard>
                        <Box sx={{ overflowY: 'auto', height: '450px'}}>
                            <Grid container spacing={2} direction="column" justifyContent="center">
                                <Grid item xs={3}>
                                    <Box sx={{
                                        background: "#A4CAF0", display: 'flex', alignItems: 'center'
                                    }}>
                                        {userInputHeader("What's this ?")}
                                    </Box>
                                </Grid>
                                <Grid item xs={9} mx={3}>
                                    <Typography sx={getTypogrpahySx()}>
                                        {parameterSelected?.Description || parameterSelected?.DisplayName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </StyledIPCard>
                </Grid>
            )}
            
        </Grid>
    )
}

export default ConfigureParameters

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
