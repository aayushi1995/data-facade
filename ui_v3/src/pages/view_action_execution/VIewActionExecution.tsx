import { Box, Button, Card, Dialog, DialogContent, Typography } from "@mui/material";
import React from "react";
import LoadingWrapper from "../../common/components/LoadingWrapper";
import ProgressBar from "../../common/ProgressBar";
import ActionExecutionStatus from "../../enums/ActionExecutionStatus";
import { ActionExecutionIncludeDefinitionInstanceDetailsResponse } from "../../generated/interfaces/Interfaces";
import ViewConfiguredParameters from "../execute_action/components/ViewConfiguredParameters";
import useActionExecutionParsedOutput from "../execute_action/hooks/useActionExecutionParsedOutput";
import FetchActionExecutionDetails from "./hooks/FetchActionExecutionDetails";
import ViewActionExecutionOutput from "./ViewActionExecutionOutput";

export interface ViewActionExecutionProps {
    actionExecutionId?: string
}

interface ResolvedActionExecutionProps {
    actionExecutionDetail: ActionExecutionIncludeDefinitionInstanceDetailsResponse
}

const ViewActionExecution = (props: ViewActionExecutionProps) => {
    const { actionExecutionId } = props
    console.log(actionExecutionId)
    const actionExecutionDetailQuery = FetchActionExecutionDetails({actionExecutionId: actionExecutionId, queryOptions: {}})
    
    const getToRenderComponent = () => {
        const data = actionExecutionDetailQuery?.data
        if(!!data){
            console.log(data)
            const props = {actionExecutionDetail: data}
            switch(actionExecutionDetailQuery.data?.ActionExecution?.Status) {
                case ActionExecutionStatus.COMPLETED:
                    return <ViewCompletedActionExecution {...props}/>
                default:
                    console.log(data, ActionExecutionStatus.COMPLETED)
                    return <>TO BUILD...</>
            }
        }
    }
    return(
        <Box>
            <LoadingWrapper
                data={actionExecutionDetailQuery.data}
                isLoading={actionExecutionDetailQuery.isLoading}
                error={actionExecutionDetailQuery.error}
            >
                {getToRenderComponent()}
            </LoadingWrapper>
        </Box>
        
    )
}

const ViewExecutingActionExecution = (props: ResolvedActionExecutionProps) => {
    return (
        <></>
    )
}

const ViewCompletedActionExecution = (props: ResolvedActionExecutionProps) => {
    const { actionExecutionDetail } = props
    const [dialogState, setDialogState] = React.useState(false)
    const handleClose = () => setDialogState(false)
    const handleOpen = () => setDialogState(true)

    const useActionExecutionParsedOutputQuery = useActionExecutionParsedOutput({ actionExecutionFilter: {Id: actionExecutionDetail?.ActionExecution?.Id}, queryOptions: {}})
    
    const viewResult = () => {
        useActionExecutionParsedOutputQuery.refetch()
    
    }
    
    const progressBarProps = {
        Progress: 100,
        Label: "Execution Completed Successfully"
    }

    return (
        <Box>
            <Dialog open={dialogState} onClose={handleClose} fullWidth maxWidth="md">
                <DialogContent>
                    <ViewActionExecutionOutput 
                        ActionDefinition={actionExecutionDetail.ActionDefinition!}
                        ActionInstance={actionExecutionDetail.ActionInstance!}
                        ActionExecution={actionExecutionDetail.ActionExecution!}
                    />
                </DialogContent>
            </Dialog>
            <Box>
                <ViewConfiguredParameters
                    parameterDefinitions={actionExecutionDetail?.ActionParameterDefinitions||[]}
                    parameterInstances={actionExecutionDetail?.ActionParameterInstances||[]}
                />
            </Box>
            <Box>
                <ProgressBar {...progressBarProps}/>
            </Box>
            <Box>
                <Card sx={{
                    p: 3,
                    background: "#F4F5F7",
                    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25), 0px 0px 1px rgba(0, 0, 0, 0.25)"
                }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <Box>
                            <Typography>
                                Review Results in Insights using a Interactive Dashboard or Download csv  
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 4, justifyContent: "center"}}>
                            <Box>
                                <Button variant="contained" onClick={() => {handleOpen()}}>
                                    View Results
                                </Button>
                            </Box>
                            <Box>
                                <Button variant="contained">
                                    Download File
                                </Button>
                            </Box>
                            <Box>
                                <Button variant="contained">
                                    Export Results
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}

export default ViewActionExecution;