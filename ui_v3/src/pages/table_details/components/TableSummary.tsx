import { Avatar, Box, Card, Divider, Grid, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import RunWorkflowButton from "../../../common/components/RunWorkflowButton";
import TagHandler from "../../../common/components/tag-handler/TagHandler";
import { lightShadows } from "../../../css/theme/shadows";
import labels from "../../../labels/labels";
import { ProviderIcon } from "../../data/components/connections/ConnectionDialogContent";
import { relativeTimeFromTimestamp, useProviderDefinitionForTable, useTable, useTableDescriptionMutation } from "./TableSummaryHooks";

export type TableSummaryProps = {
    TableId?: string
}

const TableSummary = (props: TableSummaryProps) => {
    return (
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: lightShadows[31]}}>
            <Grid container spacing={1}>
                <Grid item xs={12} lg={6} sx={{ display: "flex", flexDirection: "row", gap: 1}}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1}}>
                        <Box>
                            <TableDescriptionEditor TableId={props.TableId}/>
                        </Box>
                        <Box>
                            <TableTagEditor TableId={props.TableId}/>
                        </Box>
                    </Box>
                    <Box sx={{ display: { xs: "none", sm: "block"}}}>
                        <Divider orientation="vertical"/>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Box>
                        <TableHighLevelInfo TableId={props.TableId}/>
                        <RunWorkflowButton TableId={props.TableId}/>
                    </Box>
                </Grid>
            </Grid>
            
        </Card>
    )
}


type TableDescriptionEditorProps = { TableId?: string }

const TableDescriptionEditor = (props: TableDescriptionEditorProps) => {
    const tableQuery = useTable({ TableId: props?.TableId, options: {}})
    const providerForTableQuery = useProviderDefinitionForTable({TableId: props?.TableId, options: {}})
    const tableDescriptionUpdateMutation = useTableDescriptionMutation({ TableId: props?.TableId, options: {}})
    const [description, setDescription] = React.useState<string| undefined>()

    React.useEffect(() => {
        if(!!tableQuery.data?.Description) {
            setDescription(tableQuery.data?.Description)
        }
    }, [tableQuery.data?.Description])

    const saveDescription = () => { 
        if(!!props?.TableId)
        tableDescriptionUpdateMutation.mutate({
            TableId: props?.TableId,
            NewDescription: description
        }, {
            onSuccess: (data, variables, context) => tableQuery.refetch()
        })
    }

    return (
        <LoadingWrapper
            isLoading={tableQuery.isLoading}
            error={tableQuery.error}
            data={tableQuery.data}
        >
            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 1}} className="data">
                <Box sx={{display: "flex", flexDirection: "row"}} className="data-author">
                    <Box sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40, background: "transparent" }} alt={tableQuery.data?.Owner}>
                            { !!providerForTableQuery.data && <ProviderIcon provider={{ ProviderDefinition: providerForTableQuery.data, ProviderParameterDefinition: [] }}/> }
                        </Avatar>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around"}} className="data-author-info">
                        <Box className="header">
                            <Typography variant="heroMeta" sx={{
                                fontSize: '16px',
                                color: "#253858"
                            }}>Table Description</Typography>
                        </Box>
                        <Box className="meta">
                            <Typography variant="heroMeta">
                                <span>By <b>{tableQuery.data?.Owner}</b></span>
                                <span> | </span>
                                <span>Updated <b>{relativeTimeFromTimestamp(tableQuery.data?.ModifiedOn)}</b></span>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{display: 'flex'}} className="description">
                    <Tooltip title="Edit" placement="right">
                        <TextField value={description} 
                            variant="standard" 
                            multiline
                            minRows={5}
                            maxRows={6}
                            placeholder="Enter Description Here"
                            onChange={(event) => setDescription(event.target.value)} 
                            onBlur={() => saveDescription()}
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
                                            background: "#E3E3E3"    
                                    }
                                },
                                disableUnderline: true
                            }}
                            sx={{ width: "100%" }}
                        />
                    </Tooltip>
                </Box>
            </Box>
        </LoadingWrapper>
    )
}


type TableTagEditorProps = { TableId?: string }

const TableTagEditor = (props: TableTagEditorProps) => {
    return (
        !!props.TableId ?
            <TagHandler
                entityType={labels.entities.TableProperties}
                entityId={props?.TableId!}
                tagFilter={{}}
                allowAdd={true}
                allowDelete={true}
                inputFieldLocation="BOTTOM"
            />
        :
            <></>
    )
}

type TableHighLevelInfoProps = { TableId?: string }

const TableHighLevelInfo = (props: TableHighLevelInfoProps) => {
    return <></>
}

export default TableSummary;