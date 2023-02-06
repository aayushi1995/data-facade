import { Box, IconButton, LinearProgress, Menu, MenuItem, TextField, Typography } from '@mui/material';
import React from 'react';
import AddRemoveIcon from "../../../../../src/assets/images/add_stage.svg";
import ConfirmationDialog from '../../../../common/components/ConfirmationDialog';
import { SetWorkflowContext } from '../context/WorkflowContext';

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
    fromAddActions?: boolean,
    allowEdit?: boolean
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
        if(props.fromAddActions !== true && props.allowEdit !== false) {
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
        props?.handleDeleteStage?.(props.stageId)
        setIsDialogOpen(false)
    }

    const handleStageClick = () => {
        setWorkflowContext({
            type: 'CHANGE_CURRENT_SELECTED_STAGE',
            payload: {
                stageId: props.stageId
            }
        })
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
                borderRadius: '10px',
                height: '8vh',
                boxShadow: 'rgb(204, 219, 232) 3px 3px 6px 0px inset, rgba(255, 255, 255, 0.5) -3px -3px 6px 1px inset'
                // boxShadow: 'rgba(0, 0, 0, 0.15) 2.4px 2.4px 3.2px'
            }}
        >
            <ConfirmationDialog
                messageToDisplay={`Confirm Delete ${props.stageName}`}
                dialogOpen={isDeleteDialogOpen}
                onDialogClose={handleDialogCloseWithoutDelete}
                onAccept={handleDeleteStage}
                onDecline={handleDialogCloseWithoutDelete} messageHeader={''} acceptString={'Delete'} declineString={'Cancel'}            />
            <Box sx={{
                minWidth: "40px", 
                zIndex: 1
            }}></Box>
            <Box sx={{
                display: "flex", 
                flexDirection: "column", 
                alignItems: "center", 
                overflowX: "hidden", 
                mr: "2", 
                boxSizing: "border-box", 
                backgroundColor: "inherit",
                zIndex: 2, 
                flexGrow: 1,
                cursor: 'pointer'
            }} onClick={handleStageClick}>
                <Box sx={{display: "flex"}}>
                    <Box sx={{alignItems: "flex-end", overflowY: 'clip', textOverflow: 'ellipsis'}} >
                        {!isNameBeingEdited ? (
                            <Typography variant="heroHeader" sx={{
                                fontSize: '1rem',
                                fontWeight: 700,
                                textAlign:'center'
                            }}
                            onClick = {() => {
                                if((props.selectedStageId===undefined || props.selectedStageId === props.stageId) && props.allowEdit !== false) {
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
                            fontSize: '0.8rem',
                            fontWeight: 600,
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
                    left: "50px",
                    zIndex: 1
                }}>
                    <Box sx={{
                        width: "0",
                        height: "0",
                        borderTop: "25px solid transparent",
                        borderLeft: "60px solid",
                        borderLeftColor: props.color,
                        borderBottom: "25px solid transparent",
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
                            <>  { props.allowEdit ? 
                                <Box>
                                <IconButton sx={{p: "0px", mt: '5px'}} onClick={handleAddDeleteClick}>
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
                                </Box> :<></>
                                }
                                
                            </>
                        }
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default WorkflowStage;