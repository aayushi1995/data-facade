
import { ReactQueryWrapper } from "@/components/ReactQueryWrapper/ReactQueryWrapper"
import useActionExecutionDetails from "@/hooks/actionExecution/useActionExecutionDetails"
import { Badge, Button, Card, Col, Row, Skeleton, Tag, Typography } from "antd"
import React, { useState } from "react"
import styled from "styled-components"
import FailedActionOutput from "../../failedActionOutput"
import SuccessActionOutput from "../../successActionOutput"
import { ReactComponent as DeepDiveIcon} from '@assets/icons/scuba_diving.svg'
import { FlexBox } from "../../../ChatFooter/ChatFooter.styles"
import ActionOutput from "../../actionOutput"

const ActionCard = styled(Card)`
    border-radius: 0px 8px 8px 8px;
    border: 0.87659px solid #D1D5DB;
    margin-bottom:20px;
`

export interface ActionExecutionDetailProps {
    actionExecutionId: string,
    childActionExecutionId?: string,
    showDescription?: boolean,
    showParametersOnClick?: boolean,
    fromTestAction?: boolean,
    fromDeepDive?: boolean,
    onExecutionCreate?: (actionExecutionId: string) => void,
    displayPostProcessed?: boolean
    showChart?: boolean
    handleDeepDive?: (data:any) => void
}



const TableOutput = (props: ActionExecutionDetailProps) => {

    const {
        actionExecutionDetailQuery,
        actionExecutionError,
        actionExecutionTerminalState,
        getElapsedTime,
        childActionExecutionId,
        fetchChildActionExecutionQuery,
        postProcessedAction,
    } = useActionExecutionDetails(props)


    return ( 
        <ReactQueryWrapper  {...actionExecutionDetailQuery}>
            <FlexBox style={{alignItems:'center', maxWidth: '700px',maxHeight:'500px',overflow:'scroll'}}>
                <>            
                    {
                        !actionExecutionTerminalState ?
                            <Skeleton active />
                            :
                            <React.Fragment>
                                {
                                    actionExecutionError ?
                                        <FailedActionOutput actionExecutionDetail={actionExecutionDetailQuery?.data || {}} />
                                        :
                                        <>
                                        <SuccessActionOutput
                                            ActionExecution={actionExecutionDetailQuery?.data?.ActionExecution!}
                                            ActionDefinition={actionExecutionDetailQuery?.data?.ActionDefinition!}
                                            ActionInstance={actionExecutionDetailQuery?.data?.ActionInstance!}
                                            showCharts={false}
                                        />
                                        </>
                                        
                                    
                                }
                            </React.Fragment>
                    }
                    {
                        fetchChildActionExecutionQuery.data &&
                        <ReactQueryWrapper {...fetchChildActionExecutionQuery}>
                            {
                                postProcessedAction?.map(value => <ActionOutput actionExecutionId={value?.Id!} displayPostProcessed={false} />)
                            }
                        </ReactQueryWrapper>
                    }
                    {childActionExecutionId && <ActionOutput actionExecutionId={childActionExecutionId} />}
                </>
            </FlexBox>
        </ReactQueryWrapper>
    )
}

export default TableOutput