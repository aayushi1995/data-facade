import { Box, Card, Grid, Typography } from "@mui/material"
import React from "react"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import { ActionParameterAdditionalConfig } from "../../../common/components/workflow/create/ParameterInput"
import { ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities"


interface ConfigureParametersProps {
    mode: "GENERAL" | "ADVANCED",
    ActionParameterDefinitions: ActionParameterDefinition[],
    ActionParameterInstances: ActionParameterInstance[],
    ParameterAdditionalConfig: ActionParameterAdditionalConfig[],
    handleParametersChange: (newActionParameterInstances: ActionParameterInstance[]) => void
}

export const isDefaultValueDefined = (parameterDefaultValue?: string) => {
    const defaultParameterInstance = JSON.parse(parameterDefaultValue || "{}") as ActionParameterInstance

    return !!defaultParameterInstance.ParameterValue || !!defaultParameterInstance.TableId || !!defaultParameterInstance.ColumnId
}

const ConfigureParameters = (props: ConfigureParametersProps) => {

    const filteredParameters = props.mode === "GENERAL" ? props.ActionParameterDefinitions?.filter(apd => !isDefaultValueDefined(apd.DefaultParameterValue) ) : props.ActionParameterDefinitions?.filter(apd => isDefaultValueDefined(apd.DefaultParameterValue))
    props?.ActionParameterDefinitions?.forEach(element => {
        console.log(element, isDefaultValueDefined(element?.DefaultParameterValue))
    })
        
    const [parameterSelected, setParameterSelected] = React.useState<ActionParameterDefinition | undefined>()

    const onParameterClick = (parameterId: string) => {
        const parameter = filteredParameters.find(apd => apd.Id === parameterId)
        setParameterSelected(parameter)
    }
    
    return (
        <Grid container spacing={2}>
            <Grid item xs={6}>
                <Card sx={{
                    background: "#FFFFFF",
                    boxShadow:
                        "-2.49615px -2.49615px 7.48846px rgba(255, 255, 255, 0.5), 2.49615px 2.49615px 7.48846px rgba(163, 177, 198, 0.5)",
                    borderRadius: "16px",
                    minWidth: '100%'
                }}>
                    <Box sx={{maxHeight: '550px', overflowY: 'auto', height: '550px'}}>
                        <Grid container spacing={2} direction="column" justifyContent="center">
                            <Grid item xs={3}>
                                <Box sx={{
                                    background: "#A4CAF0", display: 'flex', alignItems: 'center', minHeight: '100%'
                                }}>
                                    <Typography sx={{
                                        fontFamily: "'SF Pro Display'",
                                        fontStyle: "normal",
                                        fontWeight: 700,
                                        fontSize: "18px",
                                        lineHeight: "24px",
                                        mt: 1,
                                        p: 2
                                    }}>
                                        User Inputs
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={9} mx={3}>
                                <ParameterDefinitionsConfigPlane 
                                    parameterDefinitions={filteredParameters}
                                    parameterInstances={props.ActionParameterInstances}
                                    parameterAdditionalConfigs={props.ParameterAdditionalConfig || []}
                                    handleChange={props.handleParametersChange}
                                    onParameterClick={onParameterClick}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Grid>
            <Grid item xs={6}>
                <Card sx={{
                    background: "#FFFFFF",
                    boxShadow:
                        "-2.49615px -2.49615px 7.48846px rgba(255, 255, 255, 0.5), 2.49615px 2.49615px 7.48846px rgba(163, 177, 198, 0.5)",
                    borderRadius: "16px",
                    minWidth: '100%'
                }}>
                    <Box sx={{maxHeight: '550px', overflowY: 'auto', height: '550px'}}>
                        <Grid container spacing={2} direction="column" justifyContent="center">
                            <Grid item xs={3}>
                                <Box sx={{
                                    background: "#A4CAF0", display: 'flex', alignItems: 'center', minHeight: '100%'
                                }}>
                                    <Typography sx={{
                                        fontFamily: "'SF Pro Display'",
                                        fontStyle: "normal",
                                        fontWeight: 700,
                                        fontSize: "18px",
                                        lineHeight: "24px",
                                        mt: 1,
                                        p: 2
                                    }}>
                                        What's this ?
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={9} mx={3}>
                                <Typography sx={{
                                    fontFamily: "'SF Pro Text'",
                                    fontStyle: "normal",
                                    fontWeight: 400,
                                    fontSize: "18px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.15px",
                                    color: "#353535"
                                }}>
                                    {parameterSelected?.Description || "NA"}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Grid>
        </Grid>
    )
}

export default ConfigureParameters