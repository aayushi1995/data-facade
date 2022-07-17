import { Box, Card, Icon, IconButton, Typography, TextField } from "@mui/material"
import LinearProgress from '@mui/material/LinearProgress'
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip'
import { styled } from '@mui/styles'
import { SystemStyleObject } from "@mui/system"
import React from "react"
import { lightShadows } from '../../../../src/css/theme/shadows'
import dataCleansing from '../../../../src/images/data_cleansing.png'
import closeIcon from '../../../../src/images/delete_workflow_action.png'
import selectGrid from '../../../../src/images/select_icon.png'
import viewErrorIcon from '../../../../src/images/ShowErrorLogs.png'
import viewResultIcon from '../../../../src/images/ViewResult.png'


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
    runTime?: number,
    stageId?: string,
    errorMessages?: string[]
    deleteButtonAction: (actionId: string, actionNumber: number) => void
    onActionSelect?: (actionId: string, actionIndex: number) => void
    handlePreviewOutput: (executionId: string) => void
    handleActionClick?: (actionId: string, actionIndex: number, stageId: string) => void
    handleActionNameChange?: (actionId: string, actionIndex: number, stageId: string, name: string) => void
}

export const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }}/>
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: '#F5F9FF',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 300,
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
    const [isNameBeingEdited, setIsNameBeingEdited] = React.useState(false)

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
        if(!!props.executionStaus && props.executionStaus !== 'Completed') {
            return;
        }
        props.onActionSelect?.(props.actionId, props.index)
    }

    const handleActionClick = () => {
        if(!!props.executionStaus && props.executionStaus !== 'Completed') {
            return;
        }
        props.handleActionClick?.(props.actionId, props.index, props.stageId || "stageID")
    }

    const tooltipTitle = (props?.executionStaus === 'Completed' || props?.executionStaus === 'Failed') ? props.runTime : "";
    const border: string | undefined = (props?.executionStaus !== undefined  ? undefined : (props.errorMessages || []).length === 0 ? '0.75px solid #00AA11' : '0.75px solid #DC2430' )

    const handleNameClick = (e: React.MouseEvent<HTMLInputElement>) => {
        if(!props.executionStaus) {
            e.stopPropagation()
            setIsNameBeingEdited(true)
        }
    }

    const handleActionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!!e.target?.value && e.target?.value?.length) {
            props.handleActionNameChange?.(props.actionId, props.index, props.stageId || "stageId", e.target.value)
        }
    } 

    return (
        <HtmlTooltip title={
            (props.executionStaus === 'Completed' || props.executionStaus === 'Failed') ? (
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
                overflowX: 'auto',
                boxShadow: '-9.71814px -9.71814px 14.5772px #FFFFFF, 9.71814px 9.71814px 14.5772px rgba(0, 0, 0, 0.05);',
                background: '#F8F8F8',
                border: border
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
                            <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '12px', width: 'auto', alignItems: 'center', cursor: 'pointer'}} >
                                <img src={selectGrid} alt="select" ></img>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer'}} onClick={handleActionClick}>
                            <Box sx={{alignItems: 'center', justifyContent: 'center'}}>
                                <img src={dataCleansing} alt="action"></img>
                            </Box>
                        </Box>
                        <Box sx={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', cursor: 'pointer'}} onClick={handleActionClick}>
                            <Box sx={{flex: 1}}>
                                {isNameBeingEdited ? (
                                    <TextField autoFocus value={props.actionName} onBlur={(e) => {if(props.actionName !== ""){setIsNameBeingEdited(false)}}} variant="standard" sx={{maxHeight: '24px'}} onChange={handleActionNameChange}/>
                                ) : (
                                    <Typography variant="actionCardHeader" sx={{overflowX: 'clip'}} onClick={handleNameClick}>
                                        {props.actionName}
                                    </Typography>
                                )}
                                
                            </Box>
                            {props.displayRowsEffected ? (
                                <Box>
                                    <span>{props.rowsEffected} rows Effected</span>
                                </Box>
                            ) : (
                                <Box>
                                    <Typography variant="actionCardSubHeader">
                                        {props.actionGroup}
                                    </Typography>
                                </Box>
                            )}
                            
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                            {!!!props.executionStaus &&
                                <IconButton onClick={(e: any) => {
                                    e.stopPropagation?.()
                                    props.deleteButtonAction(props.actionId, props.index)}}>
                                    <Icon>
                                        <img src={closeIcon} alt='remove'/>
                                    </Icon>
                                </IconButton>
                            }
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