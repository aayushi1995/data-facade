import { Grid, Card, Box } from "@mui/material";
import ActionParameterDefinitionDatatype from "../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../enums/ActionParameterDefinitionTag";
import { ActionParameterDefinition, ActionParameterInstance, TableProperties } from "../../../generated/entities/Entities";
import ParameterInput, { ParameterInputProps, StringParameterInput, TableParameterInput } from "../workflow/create/ParameterInput";


interface ParameterDefinitionsConfigPlaneProps {
    parameterDefinitions: ActionParameterDefinition[],
    parameterInstances: ActionParameterInstance[],
    handleChange: (parameterInstances: ActionParameterInstance[]) => void
}


const ParameterDefinitionsConfigPlane = (props: ParameterDefinitionsConfigPlaneProps) => {

    const onParameterValueChange = (event: ActionParameterInstance) => {
        const checkIfExists = props.parameterInstances.find(parameterInstance => parameterInstance.ActionParameterDefinitionId === event.ActionParameterDefinitionId)
        const newParameterInstances = checkIfExists !== undefined ? (props.parameterInstances.map(parameterInstance => {
            return parameterInstance.ActionParameterDefinitionId !== event.ActionParameterDefinitionId ? parameterInstance : {
                ...parameterInstance,
                ...event
            }
        })) : (
            [...props.parameterInstances, event]
        )
        console.log(newParameterInstances)
        props.handleChange(newParameterInstances)
    }

    const getExistingParameterValue = (parameterId: string) => {
        const parameterInstance = props.parameterInstances.find(parameterInstance => parameterInstance.ActionParameterDefinitionId === parameterId)
        return parameterInstance?.ParameterValue
    }

    const parameterDefinitions: ParameterInputProps[] = props.parameterDefinitions.map(parameter => {
        const existingParameterValue = getExistingParameterValue(parameter.Id || "na")
        if(parameter.Tag === ActionParameterDefinitionTag.DATA || parameter.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME) {
            return {
                parameterType: "TABLE",
                inputProps: {
                    parameterName: parameter.ParameterName || "parameterName",
                    onChange: (selectedTable: TableProperties) => {
                        const newParameterInstance: ActionParameterInstance = {
                            TableId: selectedTable.Id,
                            ParameterValue: selectedTable.DisplayName,
                            ActionParameterDefinitionId: parameter.Id,
                            ProviderInstanceId: selectedTable.ProviderInstanceID
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    selectedTableName: existingParameterValue
                }
            } as TableParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.STRING) {
            return {
                parameterType: "STRING",
                inputProps: {
                    parameterName: parameter.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameter.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            } as StringParameterInput
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.INT) {
            return {
                parameterType: "INT",
                inputProps: {
                    parameterName: parameter.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameter.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            }
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.FLOAT) {
            return {
                parameterType: "FLOAT",
                inputProps: {
                    parameterName: parameter.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameter.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            } 
        } else if(parameter.Datatype === ActionParameterDefinitionDatatype.BOOLEAN) {
            return {
                parameterType: "BOOLEAN",
                inputProps: {
                    parameterName: parameter.ParameterName || "parameterName",
                    onChange: (parameterValue: string) => {
                        const newParameterInstance: ActionParameterInstance = {
                            ParameterValue: parameterValue,
                            ActionParameterDefinitionId: parameter.Id
                        }
                        onParameterValueChange(newParameterInstance)
                    },
                    value: existingParameterValue
                }
            }
        } else if(parameter.Tag === ActionParameterDefinitionTag.COLUMN_NAME) {
            // TODO
            return {
                parameterType: undefined
            }
        } else {
            return {
                parameterType: undefined
            }
        }
    })

    return (
        <Box sx={{display: 'flex', minWidth: '100%', minHeight: '200px'}}>
            <Card sx={{background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #F8F8F8', border: '2px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD', borderRadius: '10px', backgroundBlendMode: 'soft-light, normal', minWidth: '100%', minHeight: '100%'
        , justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <Grid container spacing = {5} sx={{p: 2}}>
                    {parameterDefinitions.map((parameter) => {
                        return (
                            <Grid item xs={4}>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <ParameterInput {...parameter}/>
                                </Box>
                            </Grid>
                        )
                    })}
                </Grid>
            </Card>
        </Box>
    )
}

export default ParameterDefinitionsConfigPlane