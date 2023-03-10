import { ActionParameterInstance, ProviderInstance } from "@/generated/entities/Entities";
import { ActionInstanceWithParameters } from '@/generated/interfaces/Interfaces';
import ConfigureParametersNew, { isDefaultValueDefined } from '@components/parameters/ConfigureParametersNew';
import { ReactQueryWrapper } from '@components/ReactQueryWrapper/ReactQueryWrapper';
import { ExecuteActionContext, getMessageRequest, SetExecuteActionContext } from "@contexts/ExecuteActionContext";
import ActionParameterDefinitionDatatype from "@helpers/enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "@helpers/enums/ActionParameterDefinitionTag";
import useFetchActionInstancesForFilter from '@hooks/actionDefination/useFetchActionInstancesForFilter';
import useGetExistingParameterInstances from '@hooks/actionOutput/useGetExistingParameterInstances';
import useActionDefinitionDetail from "@hooks/useActionDefinitionDetail";
import { Button, Card, Col, Row } from "antd";
import styled from "styled-components";
import React from "react";
import { useLocation } from "react-router-dom";
import SelectProviderInstanceHook from "@hooks/actionDefination/SelectProviderInstanceHook";
import SelectProviderInstance from "./SelectProviderInstance";

const CardWrapperStyled = styled.div`
    display:flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: row;
    margin: 20px 0px;
    & > div {
        margin-right:20px;
        margin-bottom: 10px;
    }
    max-width:600px;
`


interface ExecuteActionProps {
    actionDefinitionId: string,
    existingParameterInstances?: ActionParameterInstance[],
    showActionDescription: boolean,
    disableRun?: boolean,
    redirectToExecution?: boolean,
    onExecutionCreate?: (executionId: string) => void,
    fromTestRun?: boolean,
    showOnlyParameters?: boolean,
    fromDeepDive?: boolean,
    parentExecutionId?: string,
    hideExecution?: boolean,
    tableId?: string,
    parentProviderInstanceId?: string,
    actionInstanceId?: string,
    onActionInstanceCreate?: (actionInstanceDetails: { Id?: string }) => void,
    existingModels?: ActionInstanceWithParameters,
    onSubmit?: (content: ActionInstanceWithParameters) => void
}

const ExecuteActionNew = (props: ExecuteActionProps) => {

    const [showSubmit, setShowSubmit] = React.useState(true)

    const actionDefinitionId = props.actionDefinitionId
    const useUrlToFindId = (props.fromDeepDive === undefined || props.fromDeepDive == false)
    const location = useLocation()
    const actionInstanceId = props.fromTestRun ? props.actionInstanceId : useUrlToFindId && location.search ? new URLSearchParams(location.search).get("instanceId") : undefined


    const { availableProviderInstanceQuery } = SelectProviderInstanceHook()
    const defaultProviderInstance = availableProviderInstanceQuery?.data?.find(prov => prov?.IsDefaultProvider)

    const setExecuteActionContext = React.useContext(SetExecuteActionContext)
    const executeActionContext = React.useContext(ExecuteActionContext)
    
    const tableTypeParameterExists = executeActionContext.ExistingModels.ActionParameterDefinitions?.some(apd => apd.Tag === ActionParameterDefinitionTag.TABLE_NAME)
    const pandasDataframeParameterExists = executeActionContext.ExistingModels.ActionParameterDefinitions?.some(apd => apd.Tag === ActionParameterDefinitionTag.DATA && apd.Datatype === ActionParameterDefinitionDatatype.PANDAS_DATAFRAME)


    // fetch data from hooks
    const { data, error, isLoading, refetch, isRefetching } = useActionDefinitionDetail({
        actionDefinitionId: actionDefinitionId, options: {
            enabled: false, onSuccess(data) {
                if (!!data && !!data[0]) {
                    setExecuteActionContext({
                        type: "SetFromActionDefinitionDetail",
                        payload: {
                            ActionDefinitionDetail: data[0],
                            existingParameterInstances: fetchExistingActionParameterInstancesQuery?.data,
                            existingModels: props.existingModels,
                            parentExecutionId: props.parentExecutionId,
                            tableId: props?.tableId
                        }
                    })
                }
            },
        }
    })

    const fetchExistingActionParameterInstancesQuery = useGetExistingParameterInstances({
        filter: { ActionInstanceId: actionInstanceId === null ? undefined : actionInstanceId },
        queryOptions: {
            onSuccess: (data) => {
                refetch()
            },
            enabled: false
        }
    })

    const fetchExistingActionInstance = useFetchActionInstancesForFilter({
        filter: { Id: actionInstanceId === null ? undefined : actionInstanceId },
        queryParams: {
            enabled: false,
            onSuccess: (data) => {
                if (!!data[0] && data?.length === 1) {
                    const postProcessingActions = JSON.parse(data?.[0]?.Config || "{}") as { PostProcessingSteps?: ActionInstanceWithParameters[] }
                    setExecuteActionContext({
                        type: "SetPostProcessingActions",
                        payload: {
                            postActions: postProcessingActions?.PostProcessingSteps || []
                        }
                    })
                }
            }
        }
    })

    // React.useEffect(() => {
        
    //     handleSubmitMessage()
    // },[executeActionContext])

     // TODO: WHY???

     React.useEffect(() => {
        if (actionInstanceId === undefined || actionInstanceId === null) {
            refetch()
        } else {
            fetchExistingActionParameterInstancesQuery.refetch()
            fetchExistingActionInstance.refetch()
        }

    }, [props.actionDefinitionId])

    React.useEffect(() => {
        if (defaultProviderInstance !== undefined) {
            setExecuteActionContext({ type: "SetProviderInstance", payload: { newProviderInstance: defaultProviderInstance } })
        }
    }, [defaultProviderInstance])

   
    const handleChange = (newActionParameterInstances: ActionParameterInstance[]) => {
        setExecuteActionContext({
            type: "SetActionParameterInstances",
            payload: {
                newActionParameterInstances: newActionParameterInstances
            }
        })
    }

    const StepNumberToComponent: { component: React.ReactNode, label: string }[] = []

    if (executeActionContext.ExistingModels.ActionParameterDefinitions.filter(apd => !isDefaultValueDefined(apd?.DefaultParameterValue)).length > 0) {
        StepNumberToComponent.unshift({
            component:
                <div>
                    <ConfigureParametersNew
                        mode="GENERAL"
                        ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                        ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                        ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                        handleParametersChange={handleChange}
                        showOnlyParameters={props.showOnlyParameters}
                        parentExecutionId={props.parentExecutionId}
                        fromTestRun={props.fromTestRun}
                    />
                </div>,
            label: "Required Inputs"
        })
    }

    if (executeActionContext.ExistingModels.ActionParameterDefinitions.filter(apd => isDefaultValueDefined(apd?.DefaultParameterValue)).length > 0) {
        StepNumberToComponent.push({
            component:
                <div>
                    <ConfigureParametersNew
                        showOnlyParameters={props.showOnlyParameters}
                        mode="ADVANCED"
                        ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                        ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                        ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                        handleParametersChange={handleChange}
                        parentExecutionId={props.parentExecutionId}
                    />
                </div>,
            label: "Inputs Advanced"

        })
    }

    if ((!tableTypeParameterExists) && (!pandasDataframeParameterExists)) {
        StepNumberToComponent.push({
            component:
                <Card>
                    <Row >
                        <Col xs={0} md={3} lg={4} />
                        <Col xs={12} md={6} lg={4}>
                            <SelectProviderInstance
                                selectedProviderInstance={executeActionContext.ExistingModels.SelectedProviderInstance}
                                onProviderInstanceChange={(newProviderInstance?: ProviderInstance) => {
                                    setExecuteActionContext({ type: "SetProviderInstance", payload: { newProviderInstance: newProviderInstance } })
                                }}
                            />
                        </Col>
                        <Col xs={0} md={3} lg={4} />
                    </Row>
                </Card>,
            label: "Providers"
        })
    }


    React.useEffect(() => {
        const messageContent = getMessageRequest(executeActionContext)
        if(Object.keys(executeActionContext?.ExistingModels.ActionDefinition)?.length > 0 && executeActionContext?.ExistingModels?.ActionParameterDefinitions?.length === 0) {
            setShowSubmit(false)
            props.onSubmit?.(messageContent)
        }
    },[executeActionContext])


    const handleSubmitMessage = () => {
        const messageContent = getMessageRequest(executeActionContext)
        props.onSubmit?.(messageContent)
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: 3 }}>
            <ReactQueryWrapper isLoading={isRefetching || isLoading || fetchExistingActionParameterInstancesQuery.isRefetching} error={error} data={data}>
             
                        {/* <Card size="small" style={{display: 'flex', gap: 2}}> */}
                            <CardWrapperStyled>
                                <ConfigureParametersNew
                                    mode="GENERAL"
                                    ActionParameterDefinitions={executeActionContext.ExistingModels.ActionParameterDefinitions}
                                    ActionParameterInstances={executeActionContext.ToCreateModels.ActionParameterInstances}
                                    ParameterAdditionalConfig={executeActionContext.ExistingModels.ParameterAdditionalConfig || []}
                                    handleParametersChange={handleChange}
                                    showOnlyParameters={props.showOnlyParameters}
                                    parentExecutionId={props.parentExecutionId}
                                    fromTestRun={props.fromTestRun}
                                />
                                {showSubmit && <Button type="primary" onClick={handleSubmitMessage}>
                                    Submit
                                </Button>}
                                
                            </CardWrapperStyled>
                          
                        {/* </Card> */}
                   
            </ReactQueryWrapper>

        </div>
    )
}

export default ExecuteActionNew;
