import { Box, Card, Typography, Button, Stepper, Step, StepButton } from "@mui/material"
import React from "react"
import { ActionParameterDefinition } from "../../../../../generated/entities/Entities"
import { SetWorkflowContext, WorkflowContext } from "../../../../../pages/applications/workflow/WorkflowContext"
import { actionInstanceFormDataNeeds } from "../../../CreateActionInstanceFormNew"
import { ReactQueryWrapper } from "../../../ReactQueryWrapper"
import { ConfigureParametersContext, SetParametersConfigContext } from "../../context/ConfigureParametersContext"
import useViewAction, { ActionDetail } from "../ViewSelectedAction/hooks/UseViewAction"
import ActionAndParameterConfig from "./ActionAndParameterConfig"
import ConfigureAllParameters from "./ConfigureAllParameters"
import ConfigureSingleParameter from "./ConfigureSingleParameter"


interface ConfigureActionParameterProps {
    handleDialogClose: () => void
}

const DialogState = [
    {
        label: "Configure All Action Parameters",
        component: <ConfigureAllParameters />
    },
    {
        label: "Configure Parameter",
        component: <ConfigureSingleParameter />
    }
]

const ConfigureActionParameters = (props: ConfigureActionParameterProps) => {
    const workflowContext = React.useContext(WorkflowContext)
    const configureParametersContext = React.useContext(ConfigureParametersContext)
    const setParametersConfigContext = React.useContext(SetParametersConfigContext)
    const {actionId, stageId, actionIndex} = workflowContext.LatestActionAdded || {actionId: "ID NA", stageId: "stageId", actionIndex: 0}

    const {isLoading, error, data} = useViewAction({actionDefinitionId: actionId || "ID NA", expectUniqueResult: true})

    React.useEffect(() => {
        if(!!data) {
            const actionDetail = data as ActionDetail
            setParametersConfigContext({type: 'ADD_ACTION_DATA', payload: actionDetail})
        }
    }, [data])

    React.useEffect(() => {
        setParametersConfigContext({
            type: 'SET_WORKFLOW_DETAILS',
            payload: workflowContext.LatestActionAdded!
        })
    }, [])

    const handleConfigureParameters = () => {
        setParametersConfigContext({
            type: 'SET_INTERRACTIVE_CONFIGURE',
            payload: true
        })
        setParametersConfigContext({
            type: 'NEXT_INDEX',
            payload: {}
        })
    }

    const handleNextParameter = () => {
        setParametersConfigContext({
            type: 'NEXT_PARAMETER',
            payload: {}
        })
    }

    const handleGoBack = () => {
        setParametersConfigContext({
            type: 'GO_BACK',
            payload: {}
        })
    }

    const handleSelectParameter = (index: number) => {
        setParametersConfigContext({
            type: 'SET_PARAMETER_INDEX',
            payload: index
        })
    }

    return (
        <ReactQueryWrapper isLoading={isLoading} error={error} data={data}>
            {() => {
                return (
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                        {configureParametersContext.interractiveConfigure ? (
                            <Stepper nonLinear activeStep={configureParametersContext.currentParameterIndex || 0} sx={{p: 3}}>
                                {configureParametersContext.parameters.map((parameter, index) => (
                                    <Step key={parameter.model.DisplayName}>
                                        <StepButton onClick={() => handleSelectParameter(index)}>
                                            {parameter.model.DisplayName || parameter.model.ParameterName || "Name NA"}
                                        </StepButton>
                                    </Step>
                                ))}
                                
                            </Stepper>
                        ) : (
                            <></>
                        )}
                        <Box p={1}>
                            {DialogState[configureParametersContext.wizardIndex].component}
                        </Box>
                        <Box sx={{display: 'flex', flexDirection: 'row', gap: 1, justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                            {configureParametersContext.wizardIndex > 0 ? (
                                <Button variant="contained" onClick={handleGoBack}>Back</Button>
                            ): (
                                <></>
                            )}
                            {configureParametersContext.interractiveConfigure ? (
                                <></>
                            ) : (<Button color="primary" onClick={props.handleDialogClose}>Skip</Button>)}
                            
                            {configureParametersContext.interractiveConfigure ? (
                                <>
                                {(configureParametersContext.parameters?.length || 0) - 1 > (configureParametersContext?.currentParameterIndex || 0) ? (
                                    <Button variant="contained" onClick={handleNextParameter}>Next</Button>
                                ) : (
                                    <Button variant="contained" onClick={props.handleDialogClose}>Save</Button>
                                )}
                                
                                </>
                            ) : (
                                <Button variant="contained" onClick={handleConfigureParameters}>Configure Parameters</Button>
                            )}
                        </Box>
                        {configureParametersContext.interractiveConfigure ? (
                            <Box>
                                <Card sx={{background: "#F4F5F7",
                                            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.12), 0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
                                            borderRadius: "15px"}}>
                                    
                                    <ActionAndParameterConfig />
                                </Card>
                            </Box>
                        ) : (
                            <></>
                        )}
                        
                    </Box>
                )
            }}
        </ReactQueryWrapper>
    )
}

export default ConfigureActionParameters