import {useRouteMatch} from "react-router-dom";
import {useRef, useState} from "react";
import dataManagerInstance from "../../../../data_manager/data_manager.js";
import {useMutation} from "react-query";
import {deDup} from "../components/WorkflowEditor.js";
import {v4 as uuidv4} from "uuid";
import {RUN_WORKFLOW_VIEWS} from "../components/RunWorkflowHomePage.js";
import {useRunActions} from "./useRunActions.js";
import {useFetchActionInstances, WorkflowState} from "./useFetchActionInstances.js";

const isEmpty = (obj) => {
    for (let key in obj) {
        if (obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

export function useRunWorkflow(props) {

    const match = useRouteMatch()
    const workflowId = match.params.workflowId;
    const tableMeta = props?.tableMeta

    const tableIdForWorkflow = tableMeta?.Table?.Id;
    const ProviderInstanceID = tableMeta?.Table?.ProviderInstanceID;

    const actionDefinitions = WorkflowState.ActionDefinitions;
    const selectedActionDefinitionsRef = useRef([[], []]);//[workflowDefinitions, ParameterMappings]
    const ParameterMappings = selectedActionDefinitionsRef.current?.[1];

    const orderInstances = {};
    const runtimeWorkflow = props?.runtimeWorkflow

    const [currentView, setCurrentView] = useState(RUN_WORKFLOW_VIEWS.INSTANCES);
    const { startPollingAsyncExecutionResult, actionNameMap } = useRunActions();
    const CreateActionInstanceFormConfigRef = useRef({});
    const { definitions } = useFetchActionInstances({
        tableMeta, actionNameMap, selectedActionDefinitionsRef, WorkflowState,
        setCurrentView, workflowId, runtimeWorkflow, tableIdForWorkflow
    });

    const createActionExecutionMutation = useMutation((execution) => {
        const config = dataManagerInstance.getInstance.saveData(execution.entityName, {
            "entityProperties": execution.entityProperties,
            withWorkflowActionInstances: execution.withWorkflowActionInstances
        })

        return config.then(res => res)
    });


    if(props.actionExecutionFromProps) {
        const actionExecutionFromProps = props.actionExecutionFromProps?.[0]
        const actionInstancesFromProps = JSON.parse(actionExecutionFromProps.Config)
        const dedupedActionInstances = deDup(actionInstancesFromProps?.map((action, index) => {
            const Id = action?.model?.Id;
            const currentOrder = orderInstances[Id] = (orderInstances[Id] || 0) + 1;
            return ({
                ...action?.model,
                newIndex: index,
                ActionType: definitions?.find(a => a.Id === action?.model?.DefinitionId)?.ActionType,
                uniqueKey: `${Id}_${currentOrder}`,
                ActionInstance: action,
                order: currentOrder
            });
        }) || [], 'uniqueKey');
        if(currentView !== RUN_WORKFLOW_VIEWS.EXECUTION_RESULT) {
            setCurrentView(RUN_WORKFLOW_VIEWS.EXECUTION_RESULT)
            startPollingAsyncExecutionResult(actionExecutionFromProps.Id);
        }
        const viewsDataMap = {
            [RUN_WORKFLOW_VIEWS.EXECUTION_RESULT]: {
                data: dedupedActionInstances,
                showRenderedTemplate: true,
                executeActionsLabel: null,
                executeActions: null
            }
        }
        return {
            tableMeta, currentView,
            actionDefinitions,
            ActionInstancesResult: { data: dedupedActionInstances },
            viewsDataMap, ParameterMappings,
            ActionParameterInstancesMap: CreateActionInstanceFormConfigRef.current
        };
    }


    const workflowActionInstances = deDup(WorkflowState.ActionInstances?.map((action, index) => {
        const Id = action?.model?.Id;
        const currentOrder = orderInstances[Id] = (orderInstances[Id] || 0) + 1;
        return ({
            ...action?.model,
            newIndex: index,
            ActionType: definitions?.find(a => a.Id === action?.model?.DefinitionId)?.ActionType,
            uniqueKey: `${Id}_${currentOrder}`,
            ActionInstance: action,
            order: currentOrder
        });
    }) || [], 'uniqueKey');
    const updateActionInstances = () => {
        const configMap = CreateActionInstanceFormConfigRef.current;
        Object.keys(configMap).forEach(Id => {
            const config = configMap[Id];
            const ActionParameterInstancesC = config.ActionParameterInstances;
            if (!isEmpty(ActionParameterInstancesC)) {
                const ActionParameterInstancesValuesC = Object.values(ActionParameterInstancesC);
                WorkflowState.ActionInstances?.forEach(ai => {
                    if (ai.model.Id === Id) {
                        ai?.ParameterInstances?.forEach(pi => {
                            const ActionParameterDefinitionIdValueC = ActionParameterInstancesValuesC
                                .find(
                                    apivC => pi.ActionParameterDefinitionId === apivC.Id ||
                                        apivC.ActionParameterDefinitionId === pi.ActionParameterDefinitionId
                                );
                            if (ActionParameterDefinitionIdValueC) {
                                pi.TableId = ActionParameterDefinitionIdValueC.TableId
                                pi["SourceExecutionId"] = ActionParameterDefinitionIdValueC.SourceExecutionId
                                pi.ParameterValue = ActionParameterDefinitionIdValueC.ParameterValue;
                            }
                        })
                    }
                });
            }
        })
    }
    const handleRunBackground = () => {
        updateActionInstances();
        const actionInstances = WorkflowState.ActionInstances;

        createActionExecutionMutation.mutate({
            "entityName": "ActionInstance",
            "entityProperties": {
                Id: uuidv4(),
                Name: actionDefinitions?.[0]?.workflowDefinition?.UniqueName,
                DefinitionId: workflowId,
                DisplayName: actionDefinitions?.[0]?.workflowDefinition?.DisplayName,
                TableId: tableIdForWorkflow,
                ProviderInstanceId: ProviderInstanceID
            },
            withWorkflowActionInstances: actionInstances
        }, {
            onSuccess: (data, variables, context) => {
                const actionExecutionId = data?.[0].Id;
                setCurrentView(RUN_WORKFLOW_VIEWS.EXECUTION_RESULT);
                console.log('this should be actionExecutionId', actionExecutionId);
                actionExecutionId && startPollingAsyncExecutionResult(actionExecutionId);
            },

        })
    }
    const saveCreateActionInstanceFormConfig = (Id, config) => {
        CreateActionInstanceFormConfigRef.current[Id] = config;
        console.log(config);
    };
    const viewsDataMap = {
        [RUN_WORKFLOW_VIEWS.INSTANCES]: {
            data: workflowActionInstances,
            showRenderedTemplate: true,
            executeActionsLabel: 'Execute Workflow',
            executeActions: handleRunBackground,
        },
        [RUN_WORKFLOW_VIEWS.EXECUTION_RESULT]: {
            data: workflowActionInstances,
            showRenderedTemplate: false,
            executeActionsLabel: null,
            executeActions: null
            //TODO: will have data related to execution result once the service starts giving execution id
        }
    }
    tableMeta?.Table && (tableMeta.Table.WorkflowDisplayName = actionDefinitions?.[0]?.workflowDefinition?.DisplayName);
    return {
        tableMeta, currentView,
        actionDefinitions,
        ActionInstancesResult: { data: WorkflowState.ActionInstances },
        viewsDataMap, ParameterMappings,
        saveCreateActionInstanceFormConfig,
        ActionParameterInstancesMap: CreateActionInstanceFormConfigRef.current
    };
}

