import { Avatar, Box, Button, Card, Divider, Grid, TextField, Tooltip, Typography, Link } from "@mui/material";
import React from "react";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import NumberStat from "../../../common/components/NumberStat";
import useGetActionExecution from "../hooks/useGetActionExecution";

type HeroComponentMode = "EDIT" | "READONLY"

export interface DashboardHeroProps {
    mode: HeroComponentMode,
    name?: string,
    description?: string,
    lastUpdatedOn?: number,
    createdBy?: string,
    numberOfCharts?: number,
    flowExecutionId?: string,
    onChangeHandlers?: {
        onNameChange?: (newName?: string) => void,
        onDescriptionChange?: (newDescription?: string) => void,
    }
}

const DashboardHero = (props: DashboardHeroProps) => {

    const [flowData, isFlowLoading, flowDataError] = useGetActionExecution({
        filter: {
            Id: props.flowExecutionId || "NA"
        }
    })

    const redirectToFlowExecution = () => {
        window.open(`/application/workflow-execution/${props.flowExecutionId}`)
    }

    return (
        <Card
            sx={{
            backgroundColor: 'buildActionDrawerCardBgColor.main',
            boxSizing: "border-box",
            boxShadow: '0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)',
            borderRadius: "26.3934px",
            border: '0.439891px solid #FFFFFF',
            minWidth: '100%'
            }}
            variant={'outlined'}
        >
            <Grid container spacing={1}>
                <Grid container item xs={12} md={6} spacing={2}>
                    <Grid item xs={12} lg={9}>
                        <Box sx={{ display: "flex", flexDirection: "column", pl: 2, pt: 1, gap: 2}}>
                            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}} className="header">
                                <Box className="name">
                                    <Tooltip title={props.mode==="READONLY" ? "Edit not permitted" : "Edit"} placement="left">
                                        <TextField value={props.name} 
                                            variant="standard"
                                            fullWidth
                                            onChange={(event) => props?.onChangeHandlers?.onNameChange?.(event.target.value)} 
                                            placeholder={props.mode==="EDIT" ? "Enter Name Here" : "NA"}
                                            InputProps ={{
                                                sx: {
                                                    fontFamily: "SF Pro Display",
                                                    fontStyle: "normal",
                                                    fontWeight: 600,
                                                    fontSize: "36px",
                                                    lineHeight: "116.7%",
                                                    color: "ActionDefinationHeroTextColor1.main",
                                                    borderStyle: "solid",
                                                    borderColor: "transparent",
                                                    borderRadius: "10px",
                                                    backgroundColor: "ActionDefinationTextPanelBgColor.main",
                                                    ":hover": {
                                                        ...(props.mode==="READONLY" ? {
                                                            
                                                        } : {
                                                            backgroundColor: "ActionDefinationTextPanelBgHoverColor.main"
                                                        })
                                                    }
                                                },
                                                disableUnderline: true,
                                                readOnly: props?.mode==="READONLY"
                                            }}
                                        />
                                    </Tooltip>
                                </Box>
                                <Box className="meta">
                                    <Typography variant="heroMeta">
                                        <span>Created By </span>
                                        <span><b>{props.createdBy}</b></span>
                                        <span> | </span>
                                        <span>Created On on </span>
                                        <span><b>{new Date(props.lastUpdatedOn || Date.now()).toString()}</b></span>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "row", gap: 4}}>
                                <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 2}} className="info">
                                    <Box className="createdBy">
                                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.createdBy}/>
                                    </Box>
                                        <Divider orientation="vertical" flexItem/>
                                    <Box>
                                        <NumberStat label="Charts" value={props.numberOfCharts || 0}/>
                                    </Box>
                                    <LoadingWrapper
                                        isLoading={isFlowLoading} error={flowDataError} data={flowData}
                                    >
                                        <Box sx={{display: 'flex', flexDirection: 'column', gap: 1, justfifyContent: 'center', alignItems: 'center'}}>
                                            <Link sx={{fontFamily: 'SF Pro Display', cursor: 'pointer'}} onClick={redirectToFlowExecution}>{flowData?.[0]?.ActionInstanceName}</Link>
                                            <Typography variant="heroMeta">
                                                Source Flow
                                            </Typography>
                                        </Box>
                                    </LoadingWrapper>
                                </Box>
                                
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Box sx={{display: "flex", flexDirection: "row", flex: 8}} className="master">
                            <Box sx={{pl: 1, pt: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", flexGrow: 1}} className="data">
                                <Box sx={{display: "flex", flexDirection: "row"}} className="data-author">
                                    <Box sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                                        <Button sx={{m:0, p:0}}>
                                            <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.createdBy}>

                                            </Avatar>
                                        </Button>
                                    </Box>
                                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around"}} className="data-author-info">
                                        <Box className="header">
                                            <Typography variant="heroMeta" sx={{
                                                fontSize: '16px',
                                                color: "ActionDefinationHeroTextColor1.main"
                                            }}>Description</Typography>
                                        </Box>
                                        <Box className="meta">
                                            <Typography variant="heroMeta">
                                                <span>By <b>{props.createdBy}</b></span>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ml: 3, mb: 1, mt: 1, mr: 1, display: 'flex', gap: 3}} className="description">
                                    <Tooltip title={props.mode==="READONLY" ? "Edit not permitted" : "Edit"} placement="right">
                                        <TextField value={props.description} 
                                            variant="standard" 
                                            multiline
                                            minRows={5}
                                            maxRows={6}
                                            placeholder={props.mode==="EDIT" ? "Enter Description Here" : "NA"}
                                            onChange={(event) => props?.onChangeHandlers?.onDescriptionChange?.(event.target.value)} 
                                            InputProps ={{
                                                sx: {
                                                    fontFamily: "SF Pro Text",
                                                    fontStyle: "normal",
                                                    fontWeight: "normal",
                                                    fontSize: "14px",
                                                    lineHeight: "143%",
                                                    letterSpacing: "0.15px",
                                                    color: "rgba(66, 82, 110, 0.86)",
                                                    borderWidth: "2px",
                                                    borderStyle: "solid",
                                                    borderColor: "transparent",
                                                    borderRadius: "10px",
                                                    backgroundColor: "ActionDefinationTextPanelBgColor.main",
                                                    ":hover": {
                                                        ...(props.mode==="READONLY" ? {
                                                            
                                                        } : {
                                                            backgroundColor: "ActionDefinationTextPanelBgHoverColor.main"
                                                        })
                                                    }
                                                },
                                                disableUnderline: true,
                                                readOnly: props?.mode==="READONLY"
                                            }}
                                            sx={{ width: "100%" }}
                                        />
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    )
}


export default DashboardHero;