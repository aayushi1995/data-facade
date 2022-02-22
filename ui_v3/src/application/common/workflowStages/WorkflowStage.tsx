import { IconButton, Typography } from '@material-ui/core';
import { Box } from '@mui/material';
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from '@mui/icons-material/Remove';
import React from 'react';
import { TextField } from '@material-ui/core';

export interface WorkflowStageProps {
    stageId: string
    stageName: string,
    isDisabled: boolean,
    color: 'blue' | 'pink'
    percentageCompleted: number,
    failed: boolean,
    cardButton: 'minus' | 'plus',
    showDetails: boolean,
    numberOfActions?: number,
    totalRunTime?: string,
    handleDeleteStage?: (event: string) => void
    handleAddStage?: (event: React.MouseEvent<HTMLButtonElement>) => void
    handleStageNameChange?: (stageId: string, stageName: string) => void
}


export const WorkflowStage = (props: WorkflowStageProps) => {
    const [isNameBeingEdited, setIsNameBeingEdited] = React.useState(false)

    const handleAddDeleteClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if(props.cardButton === 'minus') {
            props.handleDeleteStage?.(props.stageId)
        } else {
            props.handleAddStage?.(event)
        }
    }

    const handleStageNameChange = (e: any) => {
        props.handleStageNameChange?.(props.stageId, e.target.value)
    }

    return (
        <Box sx={{
            display: "flex", 
            flexDirection: "row", 
            backgroundColor: props.color, 
            alignItems: "center", 
            pt: 2, 
            pb: 2, 
            borderRadius: 3
        }}>
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
                flexGrow: 1
            }}>
                <Box sx={{display: "flex"}}>
                    <Box sx={{alignItems: "flex-start", overflowY: 'clip'}}>
                        {!isNameBeingEdited ? (
                            <Typography sx={{
                                display: 'inline-block',
                                whiteSpace: "nowrap",
                                fontWeight: 800,
                                
                            }}
                            onClick = {() => {setIsNameBeingEdited(true)}}
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
                
            </Box>
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
                    backgroundColor: "rgba(3, 42, 90, 1)",
                    borderRadius: "10px"
                }}>
                    <IconButton sx={{p: "0px"}} onClick={handleAddDeleteClick}>
                        {props.cardButton === 'plus' ? (
                            <AddIcon sx={{height: "20px", width: "20px", color: "#fff"}}/>
                        ):
                        (
                            <RemoveIcon sx={{height: "20px", width: "20px", color: "#fff"}}/>
                        )}
                        
                    </IconButton>
                </Box>
            </Box>
            
        </Box>
    )
}

export default WorkflowStage;