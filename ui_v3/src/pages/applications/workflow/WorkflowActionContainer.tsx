import { Typography } from "@mui/material";
import { Box, Card, IconButton, Dialog} from "@mui/material";
import { Divider } from "@mui/material";
import React from "react";
import { lightShadows } from '../../../css/theme/shadows'
import ActionCard, { ActionCardProps } from "../../../common/components/workflow-action/ActionCard";
import addAction from '../../../../src/images/add_action_workflow_container.png'
import buildActionIcon from '../../../../src/images/build_action.svg'
import addActionIcon from "../../../../src/images/add_action.svg"
import arrow from '../../../../src/images/workflow_action_arrow.png'
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { SetWorkflowContext, WorkflowContext } from "./WorkflowContext";
import NoData from "../../../common/components/NoData";
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import BuildActionFromWorkflow from "../../../common/components/workflow/create/addAction/BuildActionFromWorkflow";
import { ActionDefinition } from "../../../generated/entities/Entities";
import { BuildActionContextProvider } from "../../build_action/context/BuildActionContext";


export interface WorkflowActionContainerProps {
    stageId: string,
    fromBuildAction?: boolean,
    actionSelectable?: boolean
    addActionHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void
    buildActionHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void
    handleSelectAction?: (actionId: string, actionIndex: number) => void
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" {...props}/>
});

const WorkflowActionContainer = (props: WorkflowActionContainerProps) => {
    // TODO: add colors to theme
    const workflowContext = React.useContext(WorkflowContext)
    const [selectedDefinition, setSelectedDefinition] = React.useState({id: "", index: -1})
    const [isBuildDialogOpen, setIsBuildDialogOpen] = React.useState(false)
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    // console.log(workflowContext)
    const stageDetails = workflowContext.stages.filter(stage => stage.Id === props.stageId)?.[0]

    const handleDeleteAction = (actionId: string, actionIndex: number) => {
        const payload = {
            stageId: props.stageId,
            actionId: actionId,
            actionIndex: actionIndex
        }

        setWorkflowContext({type: 'DELETE_ACTION', payload: payload})

    }

    const onActionSelect = (actionId: string, actionIndex: number) => {
        if(props.actionSelectable === false) {
            return;
        }

        if(selectedDefinition.index === -1) {
            setSelectedDefinition({id: actionId, index: actionIndex})
            props.handleSelectAction?.(actionId, actionIndex)
        } else if(selectedDefinition.index === actionIndex) {
            setSelectedDefinition({id: "", index: -1})
            props.handleSelectAction?.("", -1)
        } else {
            setSelectedDefinition({id: actionId, index: actionIndex})
            props.handleSelectAction?.(actionId, actionIndex)
        }
        
    }

    const handlePreviewOutput = (executionId: string) => {
        console.log("here")
        const presentationFormat = stageDetails.Actions.filter((action, index) => action.Id == executionId)?.[0]?.PresentationFormat
        setWorkflowContext({type: 'SET_EXECUTION_FOR_PREVIEW', payload: {executionId: executionId, presentationFormat: presentationFormat}})
    }

    const stageActions = stageDetails?.Actions?.map((action, index) => {
        const runTime = ((action.ExecutionCompletedOn || 0) - (action.ExecutionStartedOn || 0))/1000 
        const baseAction = {
            index: index,
            actionId: action.Id,
            actionName: action.DisplayName,
            actionGroup: action.ActionGroup,
            displayRowsEffected: false,
            parameters: action.Parameters,
            defaultTemplateId: action.DefaultActionTemplateId,
            deleteButtonAction: handleDeleteAction,
            onActionSelect: onActionSelect,
            executionStaus: action.ExecutionStatus,
            runTime: runTime
        }
        if(selectedDefinition.index === index && selectedDefinition.id === action.Id) {
            return {
                ...baseAction,
                isCardSelected: true
            }
        } else {
            return {
                ...baseAction,
                isCardSelected: false
            }
        }
    })

    const handleDragEnd = (e: DropResult) => {
        if (!e.destination) {
            return;
        }
        const newActions = stageActions;
        const [reorderedActions] = newActions.splice(e.source.index, 1);
        newActions.splice(e.destination.index, 0, reorderedActions);

        const newWorkflowActions = newActions.map(actionDefinition => {
            return {
                DisplayName: actionDefinition.actionName,
                Id: actionDefinition.actionId,
                DefaultActionTemplateId: actionDefinition.defaultTemplateId,
                Parameters: actionDefinition.parameters,
                ActionGroup: 'Data Cleansing'
            }
        })

        setWorkflowContext({type: 'REORDER_ACTION', payload: {stageId: props.stageId, newActions: newWorkflowActions}})

    }

    const handleAddAction = () => {
        setWorkflowContext({type: 'CHANGE_CURRENT_SELECTED_STAGE', payload: {stageId: props.stageId}})
    }

    const handleDialogClose = (action?: ActionDefinition) => {
        if(!!action) {
            setWorkflowContext({
                type: 'ADD_ACTION',
                payload: {
                    stageId: props.stageId,
                    Action: {
                        Id: action.Id || "id",
                        ActionGroup: "Data Cleansing",
                        DisplayName: action.DisplayName || "Action added",
                        DefaultActionTemplateId: action.DefaultActionTemplateId || "defaultTemplateId",
                        Parameters: []
                    }
                }
            })
        }
        setIsBuildDialogOpen(false)
    }
    

    if(stageDetails) {
        return (
            <Box sx={{ display: 'flex', flex: 1, maxHeight: !!!(props.handleSelectAction) ? "600px" : undefined}}>
                        <Dialog 
                            fullScreen
                            open={isBuildDialogOpen}
                            TransitionComponent={Transition}
                        >
                            <BuildActionContextProvider>
                                <BuildActionFromWorkflow handleDialogClose={handleDialogClose}/>
                            </BuildActionContextProvider>
                        </Dialog>
                <Box sx={{ display: 'flex', alignContent: 'center', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
                    <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography sx={{ flex: 1, fontWeight: 600, fontFamily: 'SF Pro Display' }}>
                            Selected Actions
                        </Typography>
                        
                        {workflowContext.WorkflowExecutionStatus === undefined ? (
                            <Box sx={{  display: 'flex' }}>
                                <IconButton sx={{ flex: 1, background: "#F8F8F8",  boxShadow:"-9.71814px -9.71814px 14.5772px #FFFFFF, 9.71814px 9.71814px 14.5772px rgba(0, 0, 0, 0.05)" }} onClick={handleAddAction}>
                                    <img src={addActionIcon} alt="add action" style={{height: '100%', width: '100%', transform: 'scale(1.7)'}}/>
                                </IconButton>
                                <IconButton sx={{ flex: 1, background: "#F8F8F8",  boxShadow:"-9.71814px -9.71814px 14.5772px #FFFFFF, 9.71814px 9.71814px 14.5772px rgba(0, 0, 0, 0.05)" }} onClick={() => setIsBuildDialogOpen(true)}>
                                    <img src={buildActionIcon} alt="build action" />
                                </IconButton>
                            </Box>
                        ) : (
                            <></>
                        )}
                    </Box>
                    <Divider />
                    <Box p={1} />
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="drop-id" isDropDisabled={!workflowContext.draggingAllowed}>
                            {(provided: any) => (
                                <Box sx={{ flexShrink: 1, p: 0}} ref={provided.innerRef}>
                                    <ul style={{ 'listStyleType': 'none', padding: '0px'}}>
                                        {stageActions.map((action: any, index: number) => {
                                            return (
                                                <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                                    <Box sx={{ flex: 1, px: 1}} >
                                                        <Draggable key={action.actionId} draggableId={action.actionId + index} index={index}>
                                                            {(_provided: any) => (
                                                                <li {..._provided.draggableProps} ref={_provided.innerRef}>
                                                                    <Box px={3}>
                                                                    <ActionCard
                                                                        {...{ ...action, dragHandleProps: { ..._provided.dragHandleProps }, onActionSelect: onActionSelect, handlePreviewOutput: handlePreviewOutput }}
                                                                    />
                                                                    </Box>
                                                                </li>
                                                            )}
                                                        </Draggable>
                                                    </Box>
                                                    {index !== (stageActions.length - 1) ? (
                                                        <Box sx={{ flex: 0.5, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
                                                            <img src={arrow} alt="arrow" />
                                                        </Box>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    
                                                </Box>
                                            )
                                        })}
                                        {provided.placeholder}
                                    </ul>
                                </Box>
                            )}
                        </Droppable>
                    </DragDropContext>
                    {props?.fromBuildAction === true || stageActions.length === 0 ? (
                        <Box sx={{ flex: 1, px: 2, pb: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', flexDirection: 'column', height: '100%' }}>
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px dashed #66748A', borderRadius: '6px', alignItems: 'center', flexBasis: 0, flexGrow: 1, width: '100%', minHeight: '70px'}}>
                                <Typography sx={{ fontFamily: 'SF Compact Text', color: '#A6ABBD', letterSpacing: '0.15px', fontWeight: '500px' }}>
                                    Select Action to add here
                                </Typography>
                                <IconButton sx={{ flex: 1, background: "#F8F8F8",  boxShadow:"-9.71814px -9.71814px 14.5772px #FFFFFF, 9.71814px 9.71814px 14.5772px rgba(0, 0, 0, 0.05)" }} onClick={handleAddAction}>
                                    <img src={addActionIcon} alt="add action" style={{height: '100%', width: '100%', transform: 'scale(1.7)'}}/>
                                </IconButton>
                            </Box>
                            <Box py={0.5} />
                            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px dashed #66748A', borderRadius: '6px', alignItems: 'center', height: '100%', width: '100%' }}>
                                <Typography sx={{ flex: 1, pt: 1, fontFamily: 'SF Compact Text', color: '#A6ABBD', letterSpacing: '0.15px' }}>
                                    Create New Action
                                </Typography>
                                <IconButton sx={{ flex: 1, paddingBottom: 1 }} onClick={() => setIsBuildDialogOpen(true)}>
                                    <img src={buildActionIcon} alt="build action" style={{transform: 'scale(1.5)'}}/>
                                </IconButton>
                            </Box>
                        </Box>
                    ) : (
                        <></>
                    )}
                    
                </Box>
            </Box>
        )
    } else {
        return <NoData/>
    }
}

export default WorkflowActionContainer;