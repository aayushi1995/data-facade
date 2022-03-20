import React from "react"
import { Card, Box, IconButton, Icon } from "@material-ui/core"
import { lightShadows } from '../../../../src/css/theme/shadows'
import selectGrid from '../../../../src/images/select_icon.png'
import dataCleansing from '../../../../src/images/data_cleansing.png'
import { Typography } from "@mui/material"
import closeIcon from '../../../../src/images/delete_workflow_action.png'
import { createTheme, SystemStyleObject, useTheme } from "@mui/system"
import LinearProgress from '@mui/material/LinearProgress';
import viewResultIcon from '../../../../src/images/ViewResult.png'
import viewErrorIcon from '../../../../src/images/ShowErrorLogs.png'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


export interface ActionCardProps {
    index: number
    actionId: string
    actionName: string
    actionGroup: string
    displayRowsEffected: boolean
    rowsEffected?: number
    executionStaus?: string
    dragHandleProps?: any
    percentageCompleted?: number
    isCardSelected?: boolean,
    runTime?: number
    deleteButtonAction: (actionId: string, actionNumber: number) => void
    onActionSelect?: (actionId: string, actionIndex: number) => void
    handlePreviewOutput: (executionId: string) => void
}

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }}/>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#F9F9F9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      borderRadius: '8px 8px 8px 8px',
    },
  }));


const ActionCard = (props: ActionCardProps) => {
    // TODO: add in themes
    const isSelectedStyles: SystemStyleObject = {
        background: 'linear-gradient(317.7deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 105.18%), #FFFFFF;',
        boxShadow: lightShadows[28],
        border: '1px solid rgba(255, 255, 255, 0.4)',
        boxSizing: 'border-box',
        backgroundBlendMode: 'soft-light, normal'
    }
    var background = "#F8F8F8"
    switch(props.executionStaus){
        case 'WaitingForUpstream': 
            background = 'rgba(248, 241, 178, 1)';
            break;
        case 'Completed': 
            background = '#DFFFEA'
            break;
        case 'Failed':
            background = '#FFBDBD'
            break;
    } 

    const handleClick = (e: any) => {
        props.onActionSelect?.(props.actionId, props.index)
    }
    const tooltipTitle = (props?.executionStaus === 'Completed' || props?.executionStaus === 'Failed') ? props.runTime : "";

    return (
        <HtmlTooltip title={
            (props.executionStaus === 'Completed' || props.executionStaus === 'Faield') ? (
                <React.Fragment>
                    <Box sx={{height: '50px', minWidth:'120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Typography>
                            <span>Run time: <b>{tooltipTitle}s</b></span>
                        </Typography>
                    </Box>
                </React.Fragment>
            ): ("")
        } placement="top-end"  arrow sx={{'& .MuiTooltip-arrow': {
            color: '#F9F9F9',
            width: '10px'
          }}}>
            <Card sx={{
                maxWidth: '100%',
                overflowX: 'auto'
                }} onClick={handleClick}
            >
                <Box sx={{
                    backgroundColor: background, 
                    display: "flex", 
                    flex: 1, 
                    boxShadow: lightShadows[30], 
                    ...(props.isCardSelected && isSelectedStyles)
                    }}>
                    <Box sx={{flex: 2, display: 'flex', flexDirection: 'row', p: 2, justifyContent: 'flex-start', gap: 1}}>
                        <Box sx={{ display: 'flex', alignItems: 'center'}} {...props.dragHandleProps}>
                            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '12px', width: 'auto', alignItems: 'center'}} >
                                <img src={selectGrid} alt="select" ></img>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center'}}>
                            <Box sx={{alignItems: 'center', justifyContent: 'center'}}>
                                <img src={dataCleansing} alt="action"></img>
                            </Box>
                        </Box>
                        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start'}}>
                            <Box sx={{flex: 1}}>
                                <Typography variant="workflowActionCard" sx={{overflowX: 'clip'}}>
                                    {props.actionName}
                                </Typography>
                            </Box>
                            {props.displayRowsEffected ? (
                                <Box>
                                    <span>{props.rowsEffected} rows Effected</span>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography sx={{overflowX: 'clip', fontFamily: 'SF Pro Text', fontStyle: 'normal', fontSize: '11.66px', lineHeight: '143%', letterSpacing: '0.1457px', fontWeight: 400, color: 'rgba(66, 82, 110, 0.86)'}}>
                                        {props.actionGroup}
                                    </Typography>
                                </Box>
                            )}
                            
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            <IconButton onClick={(e: any) => {
                                e.stopPropagation?.()
                                props.deleteButtonAction(props.actionId, props.index)}}>
                                <Icon>
                                    <img src={closeIcon} alt='remove'/>
                                </Icon>
                            </IconButton>
                            {props.executionStaus === "Completed" ? (
                                <IconButton sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={(e: any) => {
                                    e.stopPropagation?.()
                                    props.handlePreviewOutput(props.actionId)
                                }}>
                                    <img src={viewResultIcon} alt='view result'/>
                                </IconButton>
                            ) : (
                                <></>
                            )}
                            {props.executionStaus === "Failed" ? (
                                <IconButton sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} onClick={(e: any) => {
                                    e.stopPropagation?.()
                                    props.handlePreviewOutput(props.actionId)
                                }}>
                                    <img src={viewErrorIcon} alt='view result'/>
                                </IconButton>
                            ): (
                                <></>
                            )}
                        </Box>
                    </Box>
                </Box>
                {props.executionStaus === "Started" ? (
                    <Box sx={{width: '100%'}}>
                        <LinearProgress/>
                    </Box>
                ) : (
                    <></>
                )}
            </Card>
        </HtmlTooltip>
    )
}

export default ActionCard;