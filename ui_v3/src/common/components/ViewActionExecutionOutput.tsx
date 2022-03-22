// @ts-nocheck

import React from "react"
import { useMutation } from "react-query"
import { getActionExecutionParsedOutput } from "../../data_manager/entity_data_handlers/action_execution_data"
import JobsRowJobDetail from "../../pages/jobs/components/JobsRowJobDetail"
import NoData from "./NoData"
import QueryData from "./QueryData"



const ViewActionExecutionOutput = (props: { executionId: string }) => {
    console.log("here")
    const fetchActionExeuctionParsedOutput = useMutation(getActionExecutionParsedOutput)

    React.useEffect(() => {
        fetchActionExeuctionParsedOutput.mutate({ Id: props.executionId },
            {
                onSuccess: (data) => {
                    console.table(data)
                },
                onError: (error) => {
                    console.table(error)
                }
            }
        )
    }, [props.executionId])


    if (fetchActionExeuctionParsedOutput.isLoading) {
        return <>Loading...</>
    } else if(fetchActionExeuctionParsedOutput.data) {
        if(fetchActionExeuctionParsedOutput.data?.Status === 'Completed'){
            return <QueryData props={[fetchActionExeuctionParsedOutput?.data?.Output]}/>
        } else {
            return <JobsRowJobDetail ActionExecution={fetchActionExeuctionParsedOutput.data}/>
        }
    } else {
        return <NoData/>
    }

}

export default ViewActionExecutionOutput
