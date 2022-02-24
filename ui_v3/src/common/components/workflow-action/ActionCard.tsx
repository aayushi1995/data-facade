import React from "react"
import { Card, Box, IconButton, Icon } from "@material-ui/core"
import { lightShadows } from '../../../../src/css/theme/shadows'
import selectGrid from '../../../../src/images/select_icon.png'
import dataCleansing from '../../../../src/images/data_cleansing.png'
import { Typography } from "@mui/material"
import closeIcon from '../../../../src/images/delete_workflow_action.png'
import { SystemStyleObject } from "@mui/system"


export interface ActionCardProps {
    index: number
    actionId: string
    actionName: string
    actionGroup: string
    displayRowsEffected: boolean
    rowsEffected?: number
    isComplete?: boolean
    dragHandleProps?: any
    percentageCompleted?: number
    isCardSelected?: boolean
    deleteButtonAction: (actionId: string, actionNumber: number) => void
}

const ActionCard = (props: ActionCardProps) => {
    // TODO: add in themes
    const isSelectedStyles: SystemStyleObject = {
        background: 'linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #FFFFFF;',
        boxShadow: 'inset -5px -5px 10px #FAFBFF, inset 5px 5px 10px #A6ABBD',
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxSizing: 'border-box',
        backgroundBlendMode: 'soft-light, normal'
    }

    return (
        <Card sx={{
            borderRadius: '10px'
        }}>
            <Box sx={{
                backgroundColor: (props.isComplete ? '#DFFFEA' : '#FFFFFF'), 
                display: "flex", 
                flex: 1, 
                boxShadow: lightShadows[25], 
                ...(props.isCardSelected && isSelectedStyles)
                }}>
                <Box sx={{flex: 2, display: 'flex', flexDirection: 'row', p: 2, justifyContent: 'flex-start'}}>
                    <Box sx={{flex: 0.15, display: 'flex', alignItems: 'center'}} {...props.dragHandleProps}>
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '12px', width: '12px', alignItems: 'center'}} >
                            <img src={selectGrid} alt="select" ></img>
                        </Box>
                    </Box>
                    <Box sx={{flex: 0.25, display: 'flex', alignItems: 'center'}}>
                        <Box sx={{alignItems: 'center', justifyContent: 'center'}}>
                            <img src={dataCleansing} alt="action"></img>
                        </Box>
                    </Box>
                    <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                        <Box sx={{flex: 1}}>
                            <Typography>
                                {props.actionName}
                            </Typography>
                        </Box>
                        {props.displayRowsEffected ? (
                            <Box>
                                <span>{props.rowsEffected} rows Effected</span>
                            </Box>
                        ) : (
                            <Box>
                                <span>{props.actionGroup}</span>
                            </Box>
                        )}
                        
                    </Box>
                </Box>
                <Box sx={{flex: 0.25}}>
                    <IconButton onClick={() => props.deleteButtonAction(props.actionId, props.index)}>
                        <Icon>
                            <img src={closeIcon} alt='remove'/>
                        </Icon>
                    </IconButton>
                </Box>
            </Box>
        </Card>
    )
}

export default ActionCard;