import { IconButton, Menu, Typography, MenuItem, Select, Dialog, DialogTitle, DialogContent, Button, LinearProgress } from '@mui/material';
import { Box } from '@mui/material';
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from '@mui/icons-material/Remove';
import AddRemoveIcon from "../../../../src/images/add_stage.svg"
import React from 'react';
import { TextField } from '@material-ui/core';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

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
    showArrow?: boolean,
    fromAddActions?: boolean
    handleDeleteStage?: (event: string) => void
    handleAddStage?: (stageId?: string) => void
    handleStageNameChange?: (stageId: string, stageName: string) => void,
    setSelectedStage?: (stageId: string) => void
}

export const WorkflowStage = (props: WorkflowStageProps) => {
    const [isDeleteDialogOpen, setIsDialogOpen] = React.useState(false)
    const [isNameBeingEdited, setIsNameBeingEdited] = React.useState(false)
    const [menuAnchor, setMenuAnchor] = React.useState<null | HTMLElement>(null)
    const open = Boolean(menuAnchor)

    const handleAddDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if(props.fromAddActions !== true) {
            setMenuAnchor(event.currentTarget)
        }
        // if(props.cardButton === 'minus') {
        //     props.handleDeleteStage?.(props.stageId)
        // } else {
        //     props.handleAddStage?.()
        // }
    }

    const handleMenuItemSelect = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
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
        props.handleStageNameChange?.(props.stageId, e.target.value)
    }

    const handleDialogCloseWithoutDelete = () => {
        setIsDialogOpen(false)
    }

    const handleDeleteStage = () => {
        props?.handleDeleteStage?.(props.stageId)
        setIsDialogOpen(false)
    }

    const handleStageClick = () => {
        if(props.showArrow === false) {
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
            borderRadius: 3,
            height: '80%'
        }}
        onClick={handleStageClick}
        >
            <Dialog open={isDeleteDialogOpen} onClose={handleDialogCloseWithoutDelete}fullWidth maxWidth="xs" scroll="paper">
                <DialogTitle sx={{display: 'flex', justifyContent: 'center'}}>
                    Confirm Delete {props.stageName}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3}}>
                        <Button color="primary" onClick={handleDeleteStage}>
                            Yes
                        </Button>
                        <Button color="primary" onClick={handleDialogCloseWithoutDelete}>
                            No
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
            <Box sx={{
                minWidth: "35px", 
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
                gap: 3
            }}>
                <Box sx={{display: "flex"}}>
                    <Box sx={{alignItems: "flex-start", overflowY: 'clip', textOverflow: 'ellipsis'}}>
                        {!isNameBeingEdited ? (
                            <Typography variant="heroHeader" sx={{
                                fontSize: '16px',
                                fontWeight: 700,
                            }}
                            onClick = {() => {
                                if(props.showArrow !== false) {
                                    setIsNameBeingEdited(true)
                                }
                            }}
                            >
                                {props.stageName}
                            </Typography>
                        ) : (
                            <TextField autoFocus value={props.stageName} onBlur={(e) => setIsNameBeingEdited(false)} variant="standard" sx={{maxHeight: '24px'}} onChange={handleStageNameChange}/>
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
            {props.showArrow === false ? (
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
                        borderLeft: "25px solid transparent",
                        borderBottom: "25px solid transparent"
                    }}>
                    </Box>
                </Box>
            ) : (
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
                        borderRadius: "10px"
                    }}>
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
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default WorkflowStage;