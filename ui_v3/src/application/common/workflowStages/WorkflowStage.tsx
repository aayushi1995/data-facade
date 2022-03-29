import { IconButton, Menu, Typography, MenuItem, Select, Dialog, DialogTitle, DialogContent, Button, LinearProgress } from '@mui/material';
import { Box } from '@mui/material';
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from '@mui/icons-material/Remove';
import AddRemoveIcon from "../../../../src/images/add_stage.svg"
import React from 'react';
import { TextField } from '@mui/material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import ConfirmationDialog from '../../../common/components/ConfirmationDialog';
import { SetWorkflowContext } from '../../../pages/applications/workflow/WorkflowContext';

export interface WorkflowStageProps {
    stageId: string
    stageName: string,
    isDisabled: boolean,
    color: string,
    percentageCompleted: number,
    failed: boolean,
    cardButton: 'minus' | 'plus',
    showDetails: boolean,
    numberOfActions?: number,
    totalRunTime?: string,
    selectedStageId?: string,
    fromAddActions?: boolean
    handleDeleteStage?: (event: string) => void
    handleAddStage?: (stageId?: string) => void
    setSelectedStage?: (stageId: string) => void
}

export const WorkflowStage = (props: WorkflowStageProps) => {
    const setWorkflowContext = React.useContext(SetWorkflowContext)
    const [isDeleteDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isNameBeingEdited, setIsNameBeingEdited] = React.useState(false)
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)

    const handleAddDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation()
        if(props.fromAddActions !== true) {
            setMenuAnchor(event.currentTarget)
        }
    }

    const handleMenuItemSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
        event.stopPropagation()
        setMenuAnchor(null)
        const menuItem: number = event.currentTarget.value
        if(menuItem === 1) {
            props.handleAddStage?.()
        } else if(menuItem === 0) {
            props.handleAddStage?.(props.stageId)
        } else if(menuItem === 2) {
            setIsDialogOpen(true)
        }
    }

    const handleStageNameChange = (e: any) => {
        if(e.target.value === "") {
            setIsNameBeingEdited(true)
        }
        setWorkflowContext({type: 'STAGE_NAME_CHANGE', payload: {
            stageId: props.stageId,
            Name: e.target.value
        }})
    }

    const handleDialogCloseWithoutDelete = () => {
        setIsDialogOpen(false)
    }

    const handleDeleteStage = () => {
        console.log(props.stageId)
        props?.handleDeleteStage?.(props.stageId)
        setIsDialogOpen(false)
    }

    const handleStageClick = () => {
        if(props.selectedStageId!==undefined){
            props.setSelectedStage?.(props.stageId)
        }
    }

    return (
        <Box 
            sx={{
                display: "flex", 
                flexDirection: "row", 
                backgroundColor: props.color, 
                alignItems: "center", 
                pt: 2, 
                pb: 2, 
                borderRadius: 1,
                height: '100%'
            }}
        >
            <ConfirmationDialog
                messageToDisplay={`Confirm Delete ${props.stageName}`}
                dialogOpen={isDeleteDialogOpen}
                onDialogClose={handleDialogCloseWithoutDelete}
                onAccept={handleDeleteStage}
                onDecline={handleDialogCloseWithoutDelete}
            />
            <Box sx={{
                minWidth: "40px", 
                zIndex: 1
            }}></Box>
            <Box sx={{
                display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-start", 
                overflowX: "hidden", 
                mr: "2", 
                boxSizing: "border-box", 
                backgroundColor: "inherit",
                zIndex: 2, 
                flexGrow: 1,
                gap: 3,
                cursor: 'pointer'
            }} onClick={handleStageClick}>
                <Box sx={{display: "flex"}}>
                    <Box sx={{alignItems: "flex-start", overflowY: 'clip', textOverflow: 'ellipsis'}} >
                        {!isNameBeingEdited ? (
                            <Typography variant="heroHeader" sx={{
                                fontSize: '16px',
                                fontWeight: 700,
                            }}
                            onClick = {() => {
                                if(props.selectedStageId===undefined || props.selectedStageId === props.stageId) {
                                    setIsNameBeingEdited(true)
                                }
                            }}
                            >
                                {props.stageName}
                            </Typography>
                        ) : (
                            <TextField autoFocus value={props.stageName} onBlur={(e) => {if(props.stageName !== ""){setIsNameBeingEdited(false)}}} variant="standard" sx={{maxHeight: '24px'}} onChange={handleStageNameChange}/>
                            )}
                        
                    </Box>
                </Box>
                {props.showDetails ? (
                    <Box>
                        <Typography sx={{
                            display: 'inline-block',
                            whiteSpace: "nowrap",
                        }}
                        >
                            Actions: {props.numberOfActions} <b>|</b> RunTime: {props.totalRunTime}
                        </Typography>
                    </Box>
                ): (
                    <></>
                )}
                {props.percentageCompleted !== undefined ? (
                    <Box sx={{width: '100%'}}>
                        <LinearProgress sx={{flex: 1}} variant="determinate" value={props.percentageCompleted}></LinearProgress>
                    </Box>
                ) : (
                    <></>
                )}
                
            </Box>
            {(props.selectedStageId===undefined || props.selectedStageId===props.stageId) &&
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    left: "40px",
                    zIndex: 1
                }}>
                    <Box sx={{
                        width: "0",
                        height: "0",
                        borderTop: "25px solid transparent",
                        borderLeft: "25px solid",
                        borderLeftColor: props.color,
                        borderBottom: "25px solid transparent"
                    }}>
                    </Box>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        right:"10px",
                        borderRadius: "10px",
                        minWidth: "20px"
                    }}>
                        {props.selectedStageId === undefined &&
                            <>
                                <IconButton sx={{p: "0px", mt: '5px'}} onClick={handleAddDeleteClick}>
                                    {/* {props.cardButton === 'plus' ? (
                                        <AddIcon sx={{height: "20px", width: "20px", color: "#fff"}}/>
                                    ):
                                    (
                                        <RemoveIcon sx={{height: "20px", width: "20px", color: "#fff"}}/>
                                    )} */}
                                    <img src={AddRemoveIcon} alt="Add" style={{height: '20px', width: '20px', background: 'transparent', transform: 'scale(1.5)'}}/>
                                </IconButton>
                                <Menu 
                                    anchorEl={menuAnchor} 
                                    open={open} 
                                    onClose={() => {setMenuAnchor(null)}}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                        }}
                                        transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                        }}
                                >
                                        <MenuItem onClick={handleMenuItemSelect} value={0}>Add Stage Next</MenuItem>
                                        <MenuItem onClick={handleMenuItemSelect} value={1}>Add Stage Last</MenuItem>
                                        <MenuItem onClick={handleMenuItemSelect} value={2}>Delete Stage</MenuItem>
                                </Menu>
                            </>
                        }
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default WorkflowStage;
