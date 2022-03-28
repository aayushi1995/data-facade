import { Route, useRouteMatch, RouteComponentProps, Switch } from "react-router-dom"
import React from "react"
import { useGetInstanceDetails } from "../../../common/components/application/hooks/useGetInstanceDetails"
import { ActionInstanceDetails } from "../../../generated/interfaces/Interfaces"
import { ExecuteActionContext, ExecuteActionContextProvider, SetExecuteActionContext } from "../../execute_action/context/ExecuteActionContext"
import { ActionInstance, ActionParameterDefinition, ActionParameterInstance } from "../../../generated/entities/Entities"
import NoData from "../../../common/components/NoData"
import { Box, Button, Dialog, DialogContent } from "@mui/material"
import ActionHero from "../../build_action/components/form-components/ActionHero"
import ParameterDefinitionsConfigPlane from "../../../common/components/action/ParameterDefinitionsConfigPlane"
import ViewConfiguredParameters from "../../execute_action/components/ViewConfiguredParameters"
import useCreateActionInstance from "../../execute_action/hooks/useCreateActionInstance"
import { v4 as uuidv4 } from "uuid"
import ViewActionExecution from "../../view_action_execution/VIewActionExecution"


export const ExecuteInstance = ({match}: RouteComponentProps<{actionInstanceId: string}>) => {
    const instanceId = match.params.actionInstanceId
    const [instancesWithParameters, setInstancesWithParameters] = React.useState<{actionInstance?: ActionInstance, parameterInstances?: ActionParameterInstance[], parameterDefinitions?: ActionParameterDefinition[]}>()
    const [dialogState, setDialogState] = React.useState(false)
    const [resultExecutionId, setResultExecutionId] = React.useState<string | undefined>()

    const {
        createActionInstanceAsyncMutation, 
        createActionInstanceSyncMutation,
        fetchActionExeuctionParsedOutputMutation
    } = useCreateActionInstance({
        syncOptions: {
            onMutate: () => setDialogState(true)
        }
    })

    const handleSuccess = (actionInstanceDetails: ActionInstanceDetails[]) => {
        const actionInstance = actionInstanceDetails?.[0]?.ActionInstance
        const actionParameterInstance = actionInstanceDetails?.[0]?.ActionParameterInstance
        const actionParameterDefinitions = actionInstanceDetails?.[0]?.ActionParameterDefinition
        setInstancesWithParameters({
            actionInstance: actionInstance || {},
            parameterInstances: actionParameterInstance || [],
            parameterDefinitions: actionParameterDefinitions || []
        })

    }

    const handleChange = (newParameterInstances: ActionParameterInstance[]) => {
        setInstancesWithParameters(oldState => {
            return {
                ...oldState,
                parameterInstances: newParameterInstances
            }
        })
    }

    const handleExecuteSync = () => {
        // creating new instance
        const actionInstance = {
            ...instancesWithParameters?.actionInstance,
            Id: uuidv4()
        }
        const parameterInstances = instancesWithParameters?.parameterInstances?.map(pi => {
            return {
                ...pi,
                Id: uuidv4(),
                ActionInstanceId: actionInstance.Id
            } as ActionParameterInstance
        })

        createActionInstanceSyncMutation.mutate({actionInstance: actionInstance, actionParameterInstances: parameterInstances || []}, {
                onSuccess: (data) => {
                    const actionExecution = data?.[0]
                    setResultExecutionId(actionExecution.Id)
                }
            }  
        )
    }

    const handleDialogClose = () => {
        setDialogState(false)
    }

    const [actionInstanceDetails, isLoading, error] = useGetInstanceDetails({instanceId: instanceId, enabled: instancesWithParameters === undefined, handleSuccess: handleSuccess})
    if(instancesWithParameters) {
        return (
            <Box sx={{display: "flex", flexDirection: "column", gap: 4, mb: 2}}>
                <Box>
                    <ActionHero 
                        Name={instancesWithParameters.actionInstance?.Name}
                        readOnly={true}
                    />
                </Box>
                <Box>
                    <ParameterDefinitionsConfigPlane
                        parameterDefinitions={instancesWithParameters.parameterDefinitions || []}
                        parameterInstances={instancesWithParameters.parameterInstances || []}
                        handleChange={handleChange}
                    />
                </Box>
                <Box>
                    <ViewConfiguredParameters
                        parameterDefinitions={instancesWithParameters.parameterDefinitions || []}
                        parameterInstances={instancesWithParameters.parameterInstances || []}
                    />
                </Box>
                <Box sx={{width: "100%"}}>
                    <Button onClick={handleExecuteSync} variant="contained" sx={{width: "100%"}}>
                        RUN INSTANCE
                    </Button>
                </Box>
                <Dialog open={dialogState} onClose={handleDialogClose} fullWidth maxWidth="xl">
                    <DialogContent>
                        <ViewActionExecution actionExecutionId={resultExecutionId}/>
                    </DialogContent>
                </Dialog>
            </Box>
        )
    } else if(error) {
        return <NoData/>
    } else {
        return <>Loading...</>
    }

    
}

const ExecuteInstanceHomePage = () => {
    const match = useRouteMatch()

    return (
        <Switch>
            <Route path={`${match.path}/:actionInstanceId`} component={ExecuteInstance}/>
        </Switch>
    )
}

export default ExecuteInstanceHomePage