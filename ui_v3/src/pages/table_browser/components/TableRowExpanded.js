import { Grid } from '@mui/material'
import React from 'react'
import { useMutation } from 'react-query'
import TableSummary from '../../table_details/components/TableSummary'
import TableView from '../../table_details/components/TableView'
import LoadingIndicator from './../../../common/components/LoadingIndicator'
import NoData from './../../../common/components/NoData'
import './../../../css/table_browser/TableRowExpanded.css'
import dataManagerInstance, { useRetreiveData } from './../../../data_manager/data_manager'
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
            <Grid container spacing={6}>
                <Grid item xs={12}>
                    <TableSummary TableId={props?.TableId}/>
                </Grid>
                <Grid item xs={12}>
                    <TableView TableId={props?.TableId}/>
                </Grid>
            </Grid>
        )
    }
}

export default TableRowExpanded;
