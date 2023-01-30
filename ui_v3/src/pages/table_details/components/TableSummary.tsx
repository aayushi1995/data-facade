import { Avatar, Box, Card, Divider, Grid, LinearProgress, SvgIcon, TextField, Tooltip, Typography } from "@mui/material";
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
import CertifiedIcon from "./../../../images/Certified.svg";
import NotCertifiedIcon from "./../../../images/NotCertified.svg";
import { useTableAndColumnStats } from "./ColumnInfoViewHooks";
import { relativeTimeFromTimestamp, useProviderDefinitionForTable, useTable, useTableCertificationMutation, useTableDescriptionMutation } from "./TableSummaryHooks";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import certified from "../../../images/certified1.svg";
import notCertified from "../../../images/not certified.svg"
export type TableSummaryProps = {
    TableId?: string
}

const TableSummary = (props: TableSummaryProps) => {
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    const health = tableFullStats?.data?.TableStat?.Health

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
            <Grid container spacing={1}>

                <Grid item xs={12} lg={5} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Card sx={{ height: '22vh', borderRadius: '5px' }}>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
                                <Box>
                                    <TableDescriptionEditor TableId={props.TableId} />
                                </Box>
                                <Box sx={{ px: 2, pb: 1 }}>
                                    <TableTagEditor TableId={props.TableId} />
                                </Box>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
                <Grid item xs={12} lg={7}>
                    <Grid container spacing={1} sx={{ display: "flex", flexDirection: "column", gap: '2vh' }}>
                        <Grid item xs={12} >
                            <Card sx={{ pb: 2, height: '22vh', borderRadius: '5px' }}>
                                <Box>
                                    <TableHighLevelInfo TableId={props.TableId} />
                                </Box>
                            </Card>
                        </Grid>
                        {/* <Grid item xs={12} >
                            <Card sx={{ height: '8vh', borderRadius: '5px' }}>
                                {!!health &&
                                    <Box sx={{ pt: 3, px: 2 }}>
                                        <RunWorkflowButton TableId={props.TableId} />
                                    </Box>
                                }
                            </Card>
                        </Grid> */}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}


type TableDescriptionEditorProps = { TableId?: string }

const TableDescriptionEditor = (props: TableDescriptionEditorProps) => {
    const tableQuery = useTable({ TableId: props?.TableId, options: {} })
    const providerForTableQuery = useProviderDefinitionForTable({ TableId: props?.TableId, options: {} })
    const tableDescriptionUpdateMutation = useTableDescriptionMutation({ TableId: props?.TableId, options: {} })
    const tableCertificationStatusUpdateMutation = useTableCertificationMutation({ TableId: props?.TableId, options: {} })
    const [description, setDescription] = React.useState<string | undefined>()
    const [TableName, setTableName] = React.useState<string | undefined>()
    const isCertifiedTable = tableQuery?.data?.CertificationStatus === TablePropertiesCertificationStatus.CERTIFIED

    React.useEffect(() => {
        if (!!tableQuery.data?.Description) {
            setDescription(tableQuery.data?.Description)

        }
        if (!!tableQuery.data?.DisplayName) {
            setTableName(tableQuery.data?.DisplayName)
        }
    }, [tableQuery.data?.Description])

    const saveDescription = () => {
        if (!!props?.TableId)
            tableDescriptionUpdateMutation.mutate({
                TableId: props?.TableId,
                NewDescription: description
            }, {
                onSuccess: (data, variables, context) => tableQuery.refetch()
            })
    }

    const toggleCertification = () => {
        if (!!props?.TableId && !!tableQuery.data) {
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
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 1 }} className="data">
                <Box sx={{ display: "flex", flexDirection: "row" }} className="data-author">
                    {/* <Box sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40, background: "transparent" }} alt={tableQuery.data?.Owner}>
                            { !!providerForTableQuery.data && <ProviderIcon providerUniqueName={providerForTableQuery.data.UniqueName}/> }
                        </Avatar>
                    </Box> */}
                    <Box sx={{ px: 2, pt: 2, display: "flex", flexDirection: "column", justifyContent: "space-around" }} className="data-author-info">
                        <Box className="header">
                            <Typography sx={{
                                fontSize: '1.2rem',
                                color: "#253858",
                                fontWeight: 600,
                                textTransform: 'uppercase'
                            }}>{TableName}</Typography>
                        </Box>
                        <Box className="meta">
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ color: '#65676B', fontSize: '1rem', fontWeight: 600 }}>
                                    <span>By {tableQuery.data?.Owner}</span>
                                    <span> | </span>
                                </Typography>

                                <Typography sx={{ fontSize: '1rem', color: '#24B2CF', fontWeight: 900, }}>
                                    <span>Updated {relativeTimeFromTimestamp(tableQuery.data?.ModifiedOn)}</span>

                                </Typography>
                                <span> | </span>
                                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                                    <Tooltip title={isCertifiedTable ? "Click to Remove Certification" : "Click to Certify Table"}>
                                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            {tableCertificationStatusUpdateMutation.isLoading ?
                                                <LoadingIndicator />
                                                :
                                                <Box onClick={() => toggleCertification()} sx={{ cursor: "pointer" }}>
                                                    {isCertifiedTable ?
                                                        <img width='30px' height='30px' src={certified} />
                                                        :
                                                        <img width='30px' height='30px' src={notCertified} />
                                                    }
                                                </Box>
                                            }
                                        </Box>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                </Box>
                <Box sx={{ display: 'flex' }} className="description">
                    <Tooltip title="Edit" placement="right">
                        <TextField value={description}
                            variant="standard"
                            multiline
                            minRows={3}
                            maxRows={4}
                            placeholder="Add Table Description Here"
                            onChange={(event) => setDescription(event.target.value)}
                            onBlur={() => saveDescription()}
                            InputProps={{
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
                                    background: "#EFF3FB",
                                    px: 2,
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
                inputFieldLocation="LEFT"
            />
            :
            <></>
    )
}

type TableHighLevelInfoProps = { TableId?: string }

const TableHighLevelInfo = (props: TableHighLevelInfoProps) => {
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    const health = tableFullStats?.data?.TableStat?.Health
    const stats = [
            {
            Label: "Number of columns",
            Value: tableFullStats?.data?.TableStat?.RowCount
        },
        {
            Label: "number of Rows",
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
        // {
        //     Label: "Health",
        //     Value: `${((tableFullStats?.data?.TableStat?.Health || 0) * 100).toFixed(2)} %`
        // }
    ]
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row',px: 2 }}>
                <Typography sx={{
                    fontSize: '1.2rem',
                    color: "#253858",
                    fontWeight: 600,
                }}> TABLE DETAILS</Typography>
                <Box sx={{width:'10vw',ml:'auto'}}>
                    <Typography sx={{
                        fontSize: '1rem',
                        color: "#615E83",
                        textAlign: 'Center',
                        ml:'3vw',
                        display:'inline'
                    }}> Health : {((tableFullStats?.data?.TableStat?.Health || 0) * 100)}%</Typography><Tooltip arrow title={"What health means "}><InfoOutlinedIcon sx={{ml:'25px',fontSize:'18px',mb:"-5px"}}/></Tooltip>
                    <LinearProgress variant={tableFullStats?.data?.TableStat?.Health !== undefined ? "determinate" : "indeterminate"} value={((tableFullStats?.data?.TableStat?.Health || 0) * 100)} color="success" />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', mt:4.2,py:1,px: 2,backgroundColor:'#EFF3FB' }}>
                <ReactQueryWrapper
                    isLoading={tableFullStats.isLoading}
                    error={tableFullStats.error}
                    data={tableFullStats.data}
                    children={() =>
                        <Grid container spacing={1}>
                            {stats?.map(stat =>
                                <Grid item xs={12} sm={6} md={4} lg={2}>
                                    <Card sx={{ px: 2, py: 1, borderRadius: '10px', height: "100%", backgroundColor: '#C9E6FC', boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1), 0px 0px 1px rgba(0, 0, 0, 0.25)' }}>
                                        <Box><Typography sx={{ textTransform: 'uppercase', fontSize: '0.6rem' }}>{stat?.Label}</Typography></Box>
                                        <Box><Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }}>{stat?.Value}</Typography></Box>
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
