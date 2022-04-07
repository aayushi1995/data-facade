import { Autocomplete, Avatar, Box, Button, Card, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import LoadingWrapper from "../../../../common/components/LoadingWrapper";
import UsageStatus from "../../../../common/components/UsageStatus";
import useGetApplications from "../../../../common/components/workflow/edit/hooks/useGetApplications";
import ActionDefinitionActionGroups from "../../../../enums/ActionDefinitionActionGroups";
import { Application } from "../../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";

type HeroComponentMode = "EDIT" | "READONLY"

export interface ActionDefinitionHeroProps {
    mode: HeroComponentMode,
    name?: string,
    description?: string,
    createdBy?: string,
    group?: string,
    applicationId?: string,
    lastUpdatedOn?: number,
    publishStatus?: string,
    onChangeHandlers?: {
        onNameChange?: (newName?: string) => void,
        onDescriptionChange?: (newDescription?: string) => void,
        onGroupChnage?: (newGroupName?: string) => void,
        onApplicationChange?: (newApplicationId?: string) => void
    }
}

const ActionDefinitionHero = (props: ActionDefinitionHeroProps) => {
    const applicationQuery = useGetApplications({ options: { }, filter: {} })

    return (
        <Card
            sx={{
            backgroundColor: '#F5F9FF',
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
                                                    color: "#253858",
                                                    borderStyle: "solid",
                                                    borderColor: "transparent",
                                                    borderRadius: "10px",
                                                    background: "#E5E5E5",
                                                    ":hover": {
                                                        ...(props.mode==="READONLY" ? {
                                                            
                                                        } : {
                                                            background: "#E3E3E3"
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
                                        <span>Last Updated on </span>
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
                                    <Box className="status">
                                        <UsageStatus status={props.publishStatus}/>
                                    </Box>
                                </Box>
                                
                            </Box>
                        </Box>
                    </Grid>
                    <Grid container item xs={12} lg={3}>
                        <Box sx={{ display: "flex", flexDirection: "column", py: 2, gap: 2, width: "100%" }}>
                            <Box sx={{ width: "100%" }}>
                                <LoadingWrapper
                                    isLoading={applicationQuery.isLoading}
                                    error={applicationQuery.error}
                                    data={applicationQuery.data}
                                >
                                    {
                                        props.mode==="EDIT" ?
                                            <Autocomplete
                                                options={applicationQuery.data!}
                                                getOptionLabel={(application: Application) => application.Name || "Name NA"}
                                                renderInput={(params) => <TextField {...params} label="Add to Application"/>}
                                                filterSelectedOptions
                                                fullWidth
                                                selectOnFocus
                                                clearOnBlur
                                                handleHomeEndKeys
                                                value={(applicationQuery.data||[]).find(app => app.Id === props.applicationId)}
                                                onChange={(event, value, reason, details) => (reason==="selectOption" && value!==null) && props?.onChangeHandlers?.onApplicationChange?.(value?.Id)}
                                            />
                                        :
                                        <TextField
                                            label="Application"
                                            defaultValue={(applicationQuery.data||[]).find(app => app.Id === props.applicationId)?.Name || "NA"}
                                            InputProps={{
                                                readOnly: true
                                            }}
                                        />
                                    }
                                    
                                </LoadingWrapper>
                            </Box>
                            <Box sx={{ width: "100%" }}>
                                {
                                    props.mode==="EDIT" ?
                                        <Autocomplete
                                            options={Object.entries(ActionDefinitionActionGroups).map(([groupKey, groupName]) => groupName)}
                                            renderInput={(params) => <TextField {...params} label="Add to Group"/>}
                                            filterSelectedOptions
                                            fullWidth
                                            selectOnFocus
                                            clearOnBlur
                                            handleHomeEndKeys
                                            value={props?.group}
                                            onChange={(event, value, reason, details) => (reason==="selectOption" && value!==null) && props?.onChangeHandlers?.onGroupChnage?.(value)}
                                        />
                                    :
                                    <TextField
                                        label="Group"
                                        defaultValue={props?.group || "NA"}
                                        InputProps={{
                                            readOnly: true
                                        }}
                                    />
                                }
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
                                                color: "#253858"
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
                                                    background: "#E5E5E5",
                                                    ":hover": {
                                                        ...(props.mode==="READONLY" ? {
                                                            
                                                        } : {
                                                            background: "#E3E3E3"
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

export interface ActionDefinitionHeroActionContextWrapperProps {
    mode?: HeroComponentMode
}

export const ActionDefinitionHeroActionContextWrapper = (props: ActionDefinitionHeroActionContextWrapperProps) => {
    const actionContext = React.useContext(BuildActionContext)
    const setActionContext = React.useContext(SetBuildActionContext)
    
    const actionDefinitionHeroProps: ActionDefinitionHeroProps = {
        mode: props?.mode || "EDIT",
        name: actionContext?.actionDefinitionWithTags?.actionDefinition?.UniqueName,
        description: actionContext?.actionDefinitionWithTags?.actionDefinition?.Description,
        createdBy: actionContext?.actionDefinitionWithTags?.actionDefinition?.CreatedBy,
        group: actionContext?.actionDefinitionWithTags?.actionDefinition?.ActionGroup,
        applicationId: actionContext?.actionDefinitionWithTags?.actionDefinition?.ApplicationId,
        lastUpdatedOn: actionContext?.actionDefinitionWithTags?.actionDefinition?.UpdatedOn,
        publishStatus: actionContext?.actionDefinitionWithTags?.actionDefinition?.PublishStatus,
        onChangeHandlers: {
            onNameChange: (newName?: string) => setActionContext({ type: "SetActionDefinitionName", payload: { newName: newName } }),
            onDescriptionChange: (newDescription?: string) => setActionContext({ type: "SetActionDefinitionDescription", payload: { newDescription: newDescription } }),
            onGroupChnage: (newGroupName?: string) => setActionContext({ type: "SetActionGroup", payload: { newGroup: newGroupName } }),
            onApplicationChange: (newApplicationId?: string) => setActionContext({ type: "SetApplicationId", payload: { newApplicationId: newApplicationId } }) 
        }
    }

    return <ActionDefinitionHero {...actionDefinitionHeroProps}/>
}

export default ActionDefinitionHero;