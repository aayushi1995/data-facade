import React from 'react'
import {Button, Grid, Table, TableBody, TableCell, TableRow, TextField} from '@mui/material'
import {Cell, Legend, Pie, PieChart, ResponsiveContainer} from 'recharts'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import {useMutation} from 'react-query'
import NoData from './../../../common/components/NoData'
import DownloadTableButton from './../../../common/components/DownloadTableButton'
import RunWorkflowButton from './../../../common/components/RunWorkflowButton'
import TagScope from './../../../enums/TagScope'
import EditTags from './../../../common/components/EditTags'
import StatsTable from './StatsTable'
import CreateCleanupTriggerButton from './../../../common/components/CreateCleanupTriggerButton.js'
import dataManagerInstance, {useRetreiveData} from './../../../data_manager/data_manager'
import './../../../css/table_browser/TableRowExpanded.css'
import labels from './../../../labels/labels'

const COLORS = ['#0088FE', '#FF8042', '#00C49F', 'red'];

const collectTableLevelStats = (rowcount, columns) => {
    const statsData = []
    if (rowcount?.Output !== undefined && rowcount?.ActionInstanceName == "Table-Row-Count-Stat") {
        const output = JSON.parse(rowcount?.Output)
        statsData.push({
            "stat": rowcount.ActionInstanceName,
            "value": output.Value
        })
    }

    if (columns !== undefined && columns.length > 0) {
        const columnStats = columns.reduce(
            (oldFreqMap, currColumn) => (oldFreqMap[currColumn.Datatype] = (oldFreqMap[currColumn.Datatype] || 0) + 1, oldFreqMap),
            Object.create(null)
        )

        Object.keys(columnStats).forEach(key => statsData.push({
            "stat": `${key} Column(s)`,
            "value": columnStats[key]
        }))
        statsData.push({
            "stat": "Total Column(s)",
            "value": columns.length
        })
    }
    return statsData
}

const TableRowExpanded = (props) => {
    const {isLoading: tableDetailLoading, error: tableDetailError, data: tableDetailData} =
        useRetreiveData(labels.entities.TableProperties, {
            "filter": {
                "Id": `${props?.TableId}`
            },
            "TableRowExpanded": true
        })


    const extractResponseEntity = () => {
        if (tableDetailData?.length === 1) {
            return tableDetailData[0]
        } else {
            return {}
        }
    }


    const saveTableDescriptionMutation = useMutation((tableInfo) => {

        let desc = document.getElementById(`table-row-expanded-desc-${props.TableId}`).value
        if (desc === undefined || desc === null) desc = ""
        const saveFunc = dataManagerInstance.getInstance.patchData(labels.entities.TableProperties, {
            filter: {
                "Id": props.TableId
            },
            newProperties: {
                "Description": desc
            }
        })
        let response = saveFunc.then(res => res.json())
        return response
    })

    const handleSaveDescription = () => {
        saveTableDescriptionMutation.mutate()
    }

    if (tableDetailLoading) {
        return (<LoadingIndicator/>)
    } else if (tableDetailError) {
        return (<NoData/>)
    } else {
        const data = extractResponseEntity(tableDetailData)
        const stats = collectTableLevelStats(data?.MostRecentTableRowCountExecution, data?.Columns)
        const pieChartData = [
            {name: `${data?.CompletedActionExecution} Jobs Completed`, value: data?.CompletedActionExecution},
            {name: `${data?.StartedActionExecution} Jobs Started`, value: data?.StartedActionExecution},
            {name: `${data?.CreatedActionExecution} Jobs Created`, value: data?.CreatedActionExecution},
            {name: `${data?.FailedActionExecution} Jobs Failed`, value: data?.FailedActionExecution},
        ]

        return (
            <Grid container spacing={2}>
                <Grid item xs={10} style={{position: "relative"}}>
                    <ResponsiveContainer width="30%" height={200}>
                        <PieChart style={{display: 'flex', justifyContents: 'space-between'}}>
                            <Pie
                                data={pieChartData}
                                cx={100}
                                cy={100}
                                innerRadius={50}
                                outerRadius={70}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value">
                                {
                                    pieChartData?.map((entry, index) => <Cell key={`cell-${index}`}
                                                                             key={`piechartindex${index}`}
                                                                             fill={COLORS[index % COLORS.length]}/>)
                                }
                            </Pie>
                            <Legend layout="vertical" verticalAlign="middle" align={"right"}/>
                        </PieChart>
                    </ResponsiveContainer>
                </Grid>
                <Grid item xs={9}>
                    <StatsTable statsData={stats}/>
                </Grid>
                <Grid item xs={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{labels.TableRowExpanded.description}</TableCell>
                                        <TableCell>
                                            <TextField multiline id={`table-row-expanded-desc-${props.TableId}`}
                                                       defaultValue={data.TableDescription}/>
                                            <Button onClick={handleSaveDescription}>Save</Button>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
                        <Grid container item xs={6} lg={12}>
                            <EditTags RelatedEntityId={props.TableId}
                                      RelatedEntityType={labels.entities.TABLE_PROPERTIES} scope={TagScope.TABLE}
                                      label="Tags"/>
                        </Grid>
                        {/* {(data.ProviderInstanceName == "LocalDB") ? */}
                            <Grid container item xs={12} justifyContent="space-evenly">
                                {/* <Grid item xs={4}>
                                    <DownloadTableButton TableId={props.TableId} TableName={props.TableName}
                                                         TableProviderInstanceId={props.TableProviderInstanceId}/>
                                </Grid> */}
                                <Grid item>
                                    <RunWorkflowButton tableMeta={props?.table}/>
                                </Grid>
                                {/* <Grid item>
                                    <CreateCleanupTriggerButton TableId={props.TableId} TableName={props.TableName}
                                                                TableProviderInstanceId={props.TableProviderInstanceId}/>
                                </Grid> */}
                            </Grid>
                            :
                            <Grid item xs={12}></Grid>
                        {/* } */}
                    </Grid>
                </Grid>
            </Grid>
        )
    }
}

export default TableRowExpanded;
