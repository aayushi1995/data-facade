// @ts-nocheck

import React from "react"
import { useMutation } from "react-query"
import { getActionExecutionParsedOutput, getActionExecutionParsedOutputForTimeSeries } from "../../data_manager/entity_data_handlers/action_execution_data"
import ActionDefinitionPresentationFormat from "../../enums/ActionDefinitionPresentationFormat"
import JobsRowJobDetail from "../../pages/jobs/components/JobsRowJobDetail"
import ColumnChartVisualizer from "./ColumnChartVisualizer"
import NoData from "./NoData"
import QueryData from "./QueryData"



const ViewActionExecutionOutput = (props: { executionId: string, presentationFormat: string }) => {
    const fetchActionExeuctionParsedOutput = useMutation(getActionExecutionParsedOutput)
    const fetchActionExecutionTimeSeriesParsedOutput = useMutation(getActionExecutionParsedOutputForTimeSeries)

    React.useEffect(() => {
        switch(props.presentationFormat) {
            case ActionDefinitionPresentationFormat.TABLE_VALUE: {
                fetchActionExeuctionParsedOutput.mutate({ Id: props.executionId })
            }
            case ActionDefinitionPresentationFormat.OBJECT: {
                fetchActionExeuctionParsedOutput.mutate({ Id: props.executionId })
            }
            case ActionDefinitionPresentationFormat.TIME_SERIES: {
                fetchActionExecutionTimeSeriesParsedOutput.mutate( {Id: props.executionId}, {
                    onSuccess: (data, errors) => console.log(data, errors)
                } )
            }
        }
        
    }, [props.executionId])


    if (fetchActionExeuctionParsedOutput.isLoading || fetchActionExecutionTimeSeriesParsedOutput.isLoading) {
        return <>Loading...</>
    } else if(fetchActionExeuctionParsedOutput.data) {
        if(fetchActionExeuctionParsedOutput.data?.Status === 'Completed'){
            return <QueryData props={[fetchActionExeuctionParsedOutput?.data?.Output]}/>
        } else {
            return <JobsRowJobDetail ActionExecution={fetchActionExeuctionParsedOutput.data}/>
        }
    } else if(fetchActionExecutionTimeSeriesParsedOutput.data) {
        if(fetchActionExecutionTimeSeriesParsedOutput.data?.actionExecution?.Status === 'Completed'){
            return <ColumnChartVisualizer options={fetchActionExecutionTimeSeriesParsedOutput.data?.defaultOptions}/>
        } else {
            return <JobsRowJobDetail ActionExecution={fetchActionExeuctionParsedOutput.data?.actionExecution}/>
        }
    } else {
        return <NoData/>
    }

}

export default ViewActionExecutionOutput
