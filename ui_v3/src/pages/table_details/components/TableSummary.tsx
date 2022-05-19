import { Avatar, Box, Card, Divider, Grid, SvgIcon, TextField, Tooltip, Typography } from "@mui/material";
import React from "react";
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import LoadingWrapper from "../../../common/components/LoadingWrapper";
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper";
import RunWorkflowButton from "../../../common/components/RunWorkflowButton";
import TagHandler from "../../../common/components/tag-handler/TagHandler";
import { lightShadows } from "../../../css/theme/shadows";
import TablePropertiesCertificationStatus from '../../../enums/TablePropertiesCertificationStatus';
import labels from "../../../labels/labels";
import { ProviderIcon } from "../../data/components/connections/ConnectionDialogContent";
import { ReactComponent as CertifiedIcon } from "./../../../images/Certified.svg";
import { ReactComponent as NotCertifiedIcon } from "./../../../images/NotCertified.svg";
import { useTableAndColumnStats } from "./ColumnInfoViewHooks";
import { relativeTimeFromTimestamp, useProviderDefinitionForTable, useTable, useTableCertificationMutation, useTableDescriptionMutation } from "./TableSummaryHooks";

export type TableSummaryProps = {
    TableId?: string
}

const TableSummary = (props: TableSummaryProps) => {
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    const health = tableFullStats?.data?.TableStat?.Health 

    return (
        <Card sx={{ p: 3, borderRadius: 2, boxShadow: lightShadows[31]}}>
            <Grid container spacing={1}>
                <Grid item xs={12} lg={6} sx={{ display: "flex", flexDirection: "column", gap: 1}}>
                    <Box sx={{ display: "flex", flexDirection: "row"}}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1}}>
                            <Box>
                                <TableDescriptionEditor TableId={props.TableId}/>
                            </Box>
                            <Box>
                                <TableTagEditor TableId={props.TableId}/>
                            </Box>
                        </Box>
                        <Box sx={{ display: { xs: "none", lg: "block"}}}>
                            <Divider orientation="vertical" sx={{ pl: 1 }}/>
                        </Box>
                    </Box>
                    <Box sx={{ display: { xs: "block", lg: "none"}}}>
                        <Divider orientation="horizontal"/>
                    </Box>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box>
                            <TableHighLevelInfo TableId={props.TableId}/>
                        </Box>
                        {!!health &&
                            <Box>
                                <RunWorkflowButton TableId={props.TableId}/>
                            </Box>
                        }
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
    const tableCertificationStatusUpdateMutation = useTableCertificationMutation({ TableId: props?.TableId, options: {}})
    const [description, setDescription] = React.useState<string| undefined>()
    const isCertifiedTable = tableQuery?.data?.CertificationStatus === TablePropertiesCertificationStatus.CERTIFIED
    
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

    const toggleCertification = () => {
        if(!!props?.TableId && !!tableQuery.data) {
            tableCertificationStatusUpdateMutation.mutate({
                TableId: props?.TableId,
                NewCertificationStatus: isCertifiedTable ? TablePropertiesCertificationStatus.NOT_CERTIFIED : TablePropertiesCertificationStatus.CERTIFIED
            })
        }
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
                            { !!providerForTableQuery.data && <ProviderIcon providerUniqueName={providerForTableQuery.data.UniqueName}/> }
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
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", flex: 1 }}>
                        <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                            <Tooltip title={ isCertifiedTable ? "Click to Remove Certification" : "Click to Certify Table" }>
                                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {tableCertificationStatusUpdateMutation.isLoading ?
                                        <LoadingIndicator/>
                                        :
                                        <Box onClick={() => toggleCertification()} sx={{ cursor: "pointer", height: "56px", width: "40px" }}>
                                            {isCertifiedTable ?
                                                <SvgIcon sx={{ height: "inherit", width: "inherit" }} viewBox="">
                                                    <CertifiedIcon/>
                                                </SvgIcon>
                                                :
                                                <SvgIcon sx={{ height: "inherit", width: "inherit" }} viewBox="">
                                                    <NotCertifiedIcon/>
                                                </SvgIcon>
                                            }
                                        </Box>
                                    }
                                </Box>
                            </Tooltip>
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
                                    px: 1,
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
                tagFilter={{ Scope: labels.entities.TableProperties }}
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
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    const health = tableFullStats?.data?.TableStat?.Health 
    const stats = [{
            Label: "RowCount",
            Value: tableFullStats?.data?.TableStat?.RowCount
        },
        {
            Label: "Int Columns",
            Value: tableFullStats?.data?.TableStat?.IntColumnCount
        },
        {
            Label: "Float Columns",
            Value: tableFullStats?.data?.TableStat?.FloatColumnCount
        },
        {
            Label: "Boolean Columns",
            Value: tableFullStats?.data?.TableStat?.BoolColumnCount
        },
        {
            Label: "String Columns",
            Value: tableFullStats?.data?.TableStat?.StringColumnCount
        },
        {
            Label: "Health",
            Value: `${((tableFullStats?.data?.TableStat?.Health || 0)*100).toFixed(2)} %`
        }
    ]
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box>
                <Typography variant="higlLevelInfoHeader"> High Level Info</Typography>
            </Box>
            <Box>
                <ReactQueryWrapper
                    isLoading={tableFullStats.isLoading}
                    error={tableFullStats.error}
                    data={tableFullStats.data}
                    children={() => 
                        <Grid container spacing={2}>
                            {stats?.map(stat =>  
                                <Grid item xs={12} sm={6} md={4} lg={3}>
                                    <Card sx={{ px: 2, py: 1, borderRadius: 1, height: "100%"}}>
                                        <Box><Typography variant="tableStatLabel">{stat?.Label}</Typography></Box>
                                        <Box><Typography variant="tableStatValue">{stat?.Value}</Typography></Box>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    }
                />
            </Box>
        </Box>
    )
}

export default TableSummary;
