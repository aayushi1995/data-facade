// @ts-nocheck

import React from "react"
import { useMutation } from "react-query"
import { getActionExecutionParsedOutput } from "../../data_manager/entity_data_handlers/action_execution_data"
import ActionDefinitionPresentationFormat from "../../enums/ActionDefinitionPresentationFormat"
import JobsRowJobDetail from "../../pages/jobs/components/JobsRowJobDetail"
import NoData from "./NoData"
import QueryData from "./QueryData"



const ViewActionExecutionOutput = (props: { executionId: string, presentationFormat: string }) => {
    const fetchActionExeuctionParsedOutput = useMutation(getActionExecutionParsedOutput)

    React.useEffect(() => {
        switch(props.presentationFormat) {
            case ActionDefinitionPresentationFormat.TABLE_VALUE: {
                fetchActionExeuctionParsedOutput.mutate({ Id: props.executionId })
            }
            case ActionDefinitionPresentationFormat.OBJECT: {
                fetchActionExeuctionParsedOutput.mutate({ Id: props.executionId })
            }
        }
        
    }, [props.executionId])


    if (fetchActionExeuctionParsedOutput.isLoading) {
        return <>Loading...</>
    } else if(fetchActionExeuctionParsedOutput.data) {
        if(fetchActionExeuctionParsedOutput.data?.Status === 'Completed'){
            return <QueryData props={[fetchActionExeuctionParsedOutput?.data?.Output]}/>
        } else {
            return <JobsRowJobDetail ActionExecution={fetchActionExeuctionParsedOutput.data}/>
        }
    } 
    else {
        return <NoData/>
    }

}

export default ViewActionExecutionOutput
