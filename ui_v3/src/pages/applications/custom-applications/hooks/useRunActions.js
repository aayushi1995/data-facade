import { useMutation, useQueryClient } from "react-query";
import dataManagerInstance from "../../../../data_manager/data_manager";
import dataManager, { useRetreiveData } from "../../../../data_manager/data_manager";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { getADMPayload } from "./getADMPayload";

export const ACTION_EXECUTION_STATUS = {
    INITIAL: "Waiting",
    PENDING: "Running",
    SUCCESS: "Completed",
    FAIL: "Failed",
    STOPPED: "Stopped"
};
const statusMapInternal = {
    data: {},
    observers: [],
    subscribe: (observer) => {
        statusMapInternal.observers.push(observer);
        return () => {
            statusMapInternal.observers = statusMapInternal.observers.filter(l => l === observer);
        };
    }
};
const OVERALL_EXECUTION_STATUS = {
    INITIAL: "INITIAL",
    SUSPENDED: "SUSPENDED",
    IN_PROGRESS: "IN_PROGRESS",
    DONE: "DONE",
};
let _executionStatus = OVERALL_EXECUTION_STATUS.SUSPENDED;
const getActionInstanceQKey = (ActionInstanceId) => [
    "ActionInstance",
    {
        "filter": { Id: ActionInstanceId },
        "withDetail": true
    }
];

export const getActionExecutionQKey = (ActionExecutionId) => [
    "ActionExecution",
    {
        "filter": {} //Id: ActionExecutionId TODO
    }
];

const actionDefinitionKey = [
    "ActionDefinition",
    {
        filter: {},
        withActionParameterDefinition: true,
    },
];

const asyncWFExecutionPollingResultKey = (workflowExecutionId) => ['ActionExecution', {
    filter: {
        Id: workflowExecutionId
    },
    GetWorkflowExecutionStatus: true
}];

let actionNameMap = {};
let asyncWFExecutionId;
export const useRunActions = () => {
    const observer = useState({})[1];
    //keep single copy of this ref object across hook calls, no need to save this state as its not rendered anywhere
    const statusMap = statusMapInternal.data;

    useEffect(() => statusMapInternal.subscribe(observer), [observer]);
    const setStatusMap = (cb) => {
        statusMapInternal.data = cb(statusMapInternal.data);
        statusMapInternal.observers.forEach(l => l(statusMapInternal.data));
    };
    const { data: actionDefinitionData } = useRetreiveData(
        ...actionDefinitionKey
    );

    useRetreiveData(...asyncWFExecutionPollingResultKey(asyncWFExecutionId), {
        enabled: !!asyncWFExecutionId,
        refetchInterval: 1000,
        onSuccess: async (asyncPollingResult) => {
            const executionResult = asyncPollingResult?.[0];
            const WorkflowExecutionResult = executionResult?.WorkflowExecution;
            const ChildExecutions = executionResult?.ChildExecutions;
            const Percentage = executionResult?.Percentage;
            const ActionInstanceId = WorkflowExecutionResult?.InstanceId
            console.log('asyncPollingResult Percentage', Percentage);
            /**
             * //TODO: check if
            [{WorkflowExecution: {
                ActionInstanceName: "TagBasedWorkflowForTable"
                //all we sent in call payload
                Config: "[{\"model\":{\"Id\":\"87e85191-3f45-466b-990c-ada523e3a9f7\",
                DeletedStatus: "None"
                Id: "ffca3778-196c-4ff3-9b3b-56eabccfb898"//parent workflow execution id
                //instance id
                InstanceId: "5e4ad11f-7be8-48ae-b68d-014cc98ad19f"
                ScheduledTime: 1641565818901
                Status: "Created"
                TableId:
            },Percentage:40%, ChildExecutions: [{ActionInstanceName, Config...}]}] //[{ActionExecution}]**/


            const actionInstanceQKey = getActionInstanceQKey(ActionInstanceId);
            const actionInstanceData = await queryClient.fetchQuery(actionInstanceQKey,
                () => dataManager.getInstance.retreiveData(...actionInstanceQKey));


            setStatusMap((statusMap) => (ChildExecutions?.reduce((statusMap, item) => {
                statusMap[item.InstanceId] = {
                    result: item?.Status, //use enum, TODO: have ui for each state, created means just initiated
                    data: item, //executionResult , ChildExecution
                    ActionInstanceId: item.InstanceId,
                    actionInstanceData: actionInstanceData, //instance
                    actionExecutionData: ChildExecutions, //complete ids
                };
                return statusMap;
            }, { ...statusMap })));
            if (WorkflowExecutionResult?.Status === "Completed" || WorkflowExecutionResult?.Status === "Failed") {
                asyncWFExecutionId = null;
                //throw new Error("WorkflowExecutionResult status is not completed, keep polling");
            }
        },
        onError: console.error
    });
    const queryClient = useQueryClient();


    const fetchActionDefinitionMutation = useMutation(
        "CreateActionInstance",
        (config) => dataManagerInstance.getInstance.saveData(
            config.entityName,
            config.actionProperties
        ),
        {
            onMutate: (payload) => {
                const itemId = payload?.actionProperties?.entityProperties?.DefinitionId;
                itemId && setStatusMap((statusMap) => ({
                    ...statusMap,
                    [itemId]: { result: ACTION_EXECUTION_STATUS.PENDING },
                }));
            },
        }
    );
    const handleCreateSynchronous = (items, Table) => {
        const isSingleActionExecution = true;
        setStatusMap((statusMap) => (items.reduce((statusMap, item) => {
            statusMap[item.Id] = { result: ACTION_EXECUTION_STATUS.INITIAL };
            return statusMap;
        }, { ...statusMap })));
        const execute = (item) => {
            const ActionInstanceId = item.ActionInstance.model || uuidv4();
            const ActionDefinitionParameterId2 = uuidv4();

            const actionDefinition = actionDefinitionData?.find((ad) => {
                return ad.ActionDefinition.Id === item.Id;
            });

            const tableTypeActionParameter = actionDefinition?.ActionParameterDefinition?.find((ad) => {
                return ad.Tag === 'table_name' || ad.Tag === 'data';
            });
            fetchActionDefinitionMutation.mutate(
                getADMPayload(item, ActionInstanceId, Table, tableTypeActionParameter, ActionDefinitionParameterId2, actionNameMap.current),
                {
                    onSuccess: async (data) => {
                        const actionInstanceQKey = getActionInstanceQKey(ActionInstanceId);
                        const actionInstanceData = await queryClient.fetchQuery(actionInstanceQKey,
                            () => dataManager.getInstance.retreiveData(...actionInstanceQKey));

                        const actionExecutionQKey = getActionExecutionQKey(ActionDefinitionParameterId2);
                        const unfilteredActionExecutionData = await queryClient.fetchQuery(actionExecutionQKey,
                            () => dataManager.getInstance.retreiveData(...actionExecutionQKey));
                        /**
                         * [{ActionInstanceName,ActionInstanceRenderedTemplate,DeletedStatus,ExecutionCompletedOn, Id, InstanceId, Output, Status, TableId}]
                         */
                        const actionExecutionData = unfilteredActionExecutionData.filter(ae => ae.InstanceId === ActionInstanceId);
                        const result = actionExecutionData?.[0]?.Status?.toLowerCase() === "completed" ?
                            ACTION_EXECUTION_STATUS.SUCCESS :
                            ACTION_EXECUTION_STATUS.FAIL;
                        setStatusMap((statusMap) => ({
                            ...statusMap,
                            [item.Id]: {
                                result,
                                data,
                                ActionInstanceId,
                                actionInstanceData,
                                actionExecutionData
                            }
                        }));
                    },
                    onError: (data) => setStatusMap((statusMap) => ({
                        ...statusMap,
                        [item.Id]: {
                            result: ACTION_EXECUTION_STATUS.FAIL,
                            data,
                            ActionInstanceId
                        }
                    })),
                    onSettled: () => {
                        if (isSingleActionExecution) {
                            _executionStatus = OVERALL_EXECUTION_STATUS.DONE;
                        }
                    }
                }
            );
        };
        _executionStatus = OVERALL_EXECUTION_STATUS.IN_PROGRESS;
        execute(items[0]);
    };

    const stopExecution = () => {
        _executionStatus = OVERALL_EXECUTION_STATUS.SUSPENDED;
        setStatusMap(statusMap => Object.keys(statusMap).reduce((statusMap, itemId) => {
            const result = statusMap?.[itemId]?.result;
            if (result === ACTION_EXECUTION_STATUS.INITIAL) {
                statusMap[itemId].result = ACTION_EXECUTION_STATUS.STOPPED
            }
            return statusMap;
        }, { ...statusMap }))

    };
    const updateActionName = (itemId, newActionName) => {
        actionNameMap[itemId] = newActionName;
    }
    const reset = () => {
        actionNameMap = {};
        setStatusMap(() => ({}));
        _executionStatus = OVERALL_EXECUTION_STATUS.INITIAL;
    }
    const startPollingAsyncExecutionResult = (executionId) => asyncWFExecutionId = executionId;
    return {
        handleCreateSynchronous,
        statusMap,
        stopExecution,
        updateActionName,
        actionNameMap,
        reset,
        startPollingAsyncExecutionResult,
        actionDefinitionData
    };
};


