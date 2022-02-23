import { Typography } from "@material-ui/core";
import { Box, Card, IconButton } from "@material-ui/core";
import { Divider } from "@mui/material";
import React from "react";
import { lightShadows } from '../../../../src/css/theme/shadows'
import ActionCard, { ActionCardProps } from "../../../common/components/workflow-action/ActionCard";
import addAction from '../../../../src/images/add_action_workflow_container.png'
import buildAction from '../../../../src/images/Frame.png'
import arrow from '../../../../src/images/workflow_action_arrow.png'
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";


export interface WorkflowActionContainerProps {
    Actions: ActionCardProps[],
    stageName: string
    onActionListChange: (event: ActionCardProps[]) => void,
    addActionHandler: (event: React.MouseEvent<HTMLButtonElement>) => void
    buildActionHandler: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const WorkflowActionContainer = (props: WorkflowActionContainerProps) => {
    // TODO: add colors to theme
    const handleDeleteAction = (actionId: string) => {
        const newActions = props.Actions?.filter(action => action.actionId !== actionId)
        props.onActionListChange(newActions)
    }

    const handleDragEnd = (e: DropResult) => {
        console.log(e)
        if (!e.destination) {
            return;
        }
        const newActions = props.Actions;
        const [reorderedActions] = newActions.splice(e.source.index, 1);
        newActions.splice(e.destination.index, 0, reorderedActions);

        props.onActionListChange(newActions)

    }

    return (
        <Box sx={{ display: 'flex', flex: 1, }}>
            <Card sx={{ display: 'flex', background: '#FFFFFF', boxShadow: lightShadows[26], alignContent: 'center', flex: 1, flexDirection: 'column', overflowY: 'auto' }}>
                <Box sx={{ p: 1, flex: 0.05, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ flex: 1, fontWeight: 600 }}>
                        Selected Actions
                    </Typography>
                    <Box sx={{ flex: 0.25, display: 'flex' }}>
                        <IconButton sx={{ flex: 1 }} onClick={props.addActionHandler}>
                            <img src={addAction} alt="add action" />
                        </IconButton>
                        <IconButton sx={{ flex: 1 }} onClick={props.buildActionHandler}>
                            <img src={buildAction} alt="build action" />
                        </IconButton>
                    </Box>
                </Box>
                <Divider />
                <Box p={1} />
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="drop-id" >
                        {(provided: any) => (
                            <Box sx={{ flexShrink: 1, p: 0}} ref={provided.innerRef}>
                                <ul style={{ 'listStyleType': 'none', padding: '0px'}}>
                                    {props.Actions.map((action: any, index: number) => {
                                        return (
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Box sx={{ flex: 1, px: 1 }} >
                                                    <Draggable key={action.actionId} draggableId={action.actionId + index} index={index}>
                                                        {(_provided: any) => (
                                                            <li {..._provided.draggableProps} ref={_provided.innerRef}>
                                                                <ActionCard
                                                                    {...{ ...action, deleteButtonAction: handleDeleteAction, dragHandleProps: { ..._provided.dragHandleProps } }}
                                                                />
                                                            </li>
                                                        )}
                                                    </Draggable>
                                                </Box>
                                                <Box sx={{ flex: 0.5, display: 'flex', justifyContent: 'center' }}>
                                                    <img src={arrow} alt="arrow" />
                                                </Box>
                                            </Box>
                                        )
                                    })}
                                    {provided.placeholder}
                                </ul>
                            </Box>
                        )}
                    </Droppable>
                </DragDropContext>
                <Box sx={{ flex: 1, px: 2, pb: 2, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px dashed #66748A', borderRadius: '10px', alignItems: 'center', height: '100%' }}>
                        <Typography sx={{ flex: 1, pt: 1 }}>
                            Add Action
                        </Typography>
                        <IconButton sx={{ flex: 1, paddingBottom: 1 }}>
                            <img src={addAction} alt="add action" />
                        </IconButton>
                    </Box>
                    <Box px={0.5} />
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', border: '1px dashed #66748A', borderRadius: '10px', alignItems: 'center', height: '100%' }}>
                        <Typography sx={{ flex: 1, pt: 1 }}>
                            Build Action
                        </Typography>
                        <IconButton sx={{ flex: 1, paddingBottom: 1 }}>
                            <img src={buildAction} alt="build action" />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
        </Box>
    )
}

export default WorkflowActionContainer;