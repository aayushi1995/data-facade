import { ReactQueryWrapper } from '@/components/ReactQueryWrapper/ReactQueryWrapper';
// import TagHandler from '@/components/TagHandler/TagHandler';
import { labels } from '@/helpers/constant';
import TablePropertiesCertificationStatus from '@/helpers/enums/TablePropertiesCertificationStatus';
import { useTableAndColumnStats } from '@/hooks/tableView/ColumnInfoViewHooks';
import React from "react";
import { relativeTimeFromTimestamp, useProviderDefinitionForTable, useTable, useTableCertificationMutation, useTableDescriptionMutation } from "@/hooks/tableView/TableSummaryHooks";
import { Card, Col, Input, Progress, Row, Tooltip, Typography } from 'antd';
import { CertifyTypo, StyledCertify, StyledRow, StyledRow2, TableNameTypo, TableOwnerNameTypo } from './ConnectionPage.style';
import TableChatIcon from '@/assets/icons/table_chart.svg'
import CertifyIcon from '@/assets/icons/certifyIcon.svg'
export type TableSummaryProps = {
    TableId?: string
}

const TableSummary = (props: TableSummaryProps) => {
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    const health = tableFullStats?.data?.TableStat?.Health

    return (
        <div>
            <Row>
                <Col span={24}>
                    <Card >
                        <div>
                            <div>
                                <div>
                                    <TableDescriptionEditor TableId={props.TableId} />
                                </div>
                                <div>
                                    {/* <TableTagEditor TableId={props.TableId} /> */}
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={24}>
                    <Row>
                        {/* <Col span={24} >
                            <Card>
                                <div>
                                    <TableHighLevelInfo TableId={props.TableId} />
                                </div>
                            </Card>
                        </Col> */}
                        {/* <Grid item xs={12} >
                            <Card sx={{ height: '8vh', borderRadius: '5px' }}>
                                {!!health &&
                                    <div sx={{ pt: 3, px: 2 }}>
                                        <RunWorkflowButton TableId={props.TableId} />
                                    </div>
                                }
                            </Card>
                        </Grid> */}
                    </Row>
                </Col>
            </Row>
        </div>
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
        <ReactQueryWrapper
            isLoading={tableQuery.isLoading}
            error={tableQuery.error}
            data={tableQuery.data}
        >
            <div>
                <div>
                    {/* <div sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40, background: "transparent" }} alt={tableQuery.data?.Owner}>
                            { !!providerForTableQuery.data && <ProviderIcon providerUniqueName={providerForTableQuery.data.UniqueName}/> }
                        </Avatar>
                    </div> */}
                    <div>
                        <StyledRow2><img style={{margin:'0px 10px 0px 0px'}} src={TableChatIcon}/>
                            <TableNameTypo>{TableName}</TableNameTypo>
                            <Tooltip title={isCertifiedTable ? "Click to Remove Certification" : "Click to Certify Table"}>
                                <div style={{ marginLeft: 'auto' }}>
                                    
                                <StyledCertify style={{backgroundColor:isCertifiedTable?'#10B981':'#EF4444'}} onClick={() => toggleCertification()} >
                                    {tableCertificationStatusUpdateMutation.isLoading ?
                                       <Row><img src={CertifyIcon}/><CertifyTypo>Loading</CertifyTypo></Row>
                                        :<>
                                            {isCertifiedTable ?
                                                <Row><img src={CertifyIcon}/> <CertifyTypo>Cerified</CertifyTypo></Row>
                                                :
                                                <Row><img src={CertifyIcon}/> <CertifyTypo>Not Certified</CertifyTypo></Row>
                                            }</>
                                        
                                    }
                                    </StyledCertify>
                                </div>
                            </Tooltip>
                                        
                        </StyledRow2>
                            <div>
                                <TableOwnerNameTypo>
                                    Table Owner
                                </TableOwnerNameTypo>
                                <TableOwnerNameTypo>
                                    {tableQuery.data?.Owner}
                                </TableOwnerNameTypo>
                            </div>
                    </div>

                </div>
                <div>
                    <Tooltip title="Edit" placement="right">
                        <Input value={description}
                            placeholder="Add Table Description Here"
                            onChange={(event) => setDescription(event.target.value)}
                            onBlur={() => saveDescription()}
                        />
                    </Tooltip>
                </div>
            </div>
        </ReactQueryWrapper>
    )
}


type TableTagEditorProps = { TableId?: string }

// const TableTagEditor = (props: TableTagEditorProps) => {
//     return (
//         !!props.TableId ?
//             <TagHandler
//                 entityType={labels.entities.TableProperties}
//                 entityId={props?.TableId!}
//                 tagFilter={{ Scope: labels.entities.TableProperties }}
//                 allowAdd={true}
//                 allowDelete={true}
//                 inputFieldLocation="LEFT"
//             />
//             :
//             <></>
//     )
// }

type TableHighLevelInfoProps = { TableId?: string }

const TableHighLevelInfo = (props: TableHighLevelInfoProps) => {
    const tableFullStats = useTableAndColumnStats({ TableId: props.TableId })
    const health = tableFullStats?.data?.TableStat?.Health
    const TotalCol =    (tableFullStats?.data?.TableStat?.IntColumnCount || 0)+ 
                        (tableFullStats?.data?.TableStat?.FloatColumnCount || 0)+
                        (tableFullStats?.data?.TableStat?.BoolColumnCount || 0)+
                        (tableFullStats?.data?.TableStat?.StringColumnCount || 0) 
    let AllCol :any= 0
    TotalCol==0?(AllCol=undefined):(AllCol=TotalCol)                    
    const stats = [
            {
            Label: "Number of columns",
            Value: AllCol
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
        <div>
            <div>
                <Typography> TABLE DETAILS</Typography>
                <div>
                    <Typography> Health : {((tableFullStats?.data?.TableStat?.Health || 0) * 100)}%</Typography><Tooltip title={"What health means "}>infoIcon</Tooltip>
                    <Progress percent={((tableFullStats?.data?.TableStat?.Health || 0) * 100)}  />
                </div>
            </div>
            <div>
                {/* <ReactQueryWrapper
                    isLoading={tableFullStats.isLoading}
                    error={tableFullStats.error}
                    data={tableFullStats.data}> */}
                        <Row gutter={4}>
                            {stats?.map(stat =>
                                <Col span={4}>
                                    <Card>
                                        <div><Typography>{stat?.Label}</Typography></div>
                                        <div><Typography>{stat?.Value}</Typography></div>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    
                    {/* </ReactQueryWrapper> */}
            </div>
        </div>
    )
}

export default TableSummary;
