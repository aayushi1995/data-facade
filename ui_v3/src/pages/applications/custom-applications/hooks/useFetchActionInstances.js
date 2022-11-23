import React from "react";
import dataManagerInstance, {useRetreiveData} from "../../../../data_manager/data_manager.js";
import {useMutation} from "react-query";
import {deDup, hasActionDefinitionsChanged} from "../components/WorkflowEditor.js";
import {getWorkflowActionDefinitions} from "../selectors/GetWorkflowActionDefinitions.js";
import {RUN_WORKFLOW_VIEWS} from "../components/RunWorkflowHomePage.js";
import {usePrevious} from "./useGetActionDefinitionForTable.js";
import {useEffect} from "react";

export const WorkflowState = {
    ActionDefinitions: undefined,
    ActionInstances: undefined
};

function useActionInstancesMutation(workflowId, runtimeWorkflow, tableIdForWorkflow, setCurrentView) {
    return useMutation("ActionInstanceMutation", (payload) => {
        return dataManagerInstance.getInstance.retreiveData(
            "ActionDefinition",
            {
                filter: {
                    Id: workflowId
                },
                getWorkflowActionInstances: true,
                ...payload
            }
        )
    }, {
        onMutate: () => {
            console.log("getting instances...");
            setCurrentView("Loading");
        }
    });
}

export function useFetchActionInstances({
                                            tableMeta, actionNameMap, selectedActionDefinitionsRef, WorkflowState,
                                            setCurrentView, workflowId, runtimeWorkflow, tableIdForWorkflow
                                        }) {
    const [areActionsReady, setAreActionsReady] = React.useState(false)

    const previousWorkflowId = usePrevious(workflowId);
    const {data, isLoading, error} = useRetreiveData(
        "ActionDefinition",
        {
            filter: {
                Id: workflowId
            },
            "IsWorkflow": true,
            "withTableId": runtimeWorkflow ? tableIdForWorkflow : undefined
        },
        {
            enabled: previousWorkflowId !== workflowId
        }
    );
    React.useEffect(() => {
        if(data) {
            console.log("tmp")
            WorkflowState.ActionDefinitions = data;
            setAreActionsReady(true)
        }
    }, [data])

    const mutation = useActionInstancesMutation(workflowId, runtimeWorkflow, tableIdForWorkflow, setCurrentView);
    const orderDefinitions = {};
    const definitions = deDup(WorkflowState.ActionDefinitions?.[0]?.LinkedDefinitions?.map((action, index) => {
        const Id = action?.ActionDefinition?.model?.Id;
        const currentOrder = orderDefinitions[Id] = (orderDefinitions[Id] || 0) + 1;
        return ({
            ...action?.ActionDefinition?.model,
            newIndex: index,
            uniqueKey: `${Id}_${currentOrder}`,
            order: currentOrder
        });
    }) || [], 'uniqueKey');
    const createActionInstances = (items) => {
        const wads = getWorkflowActionDefinitions(WorkflowState.ActionDefinitions, items, tableMeta, actionNameMap);
        selectedActionDefinitionsRef.current = [wads?.childDefinitions, wads?.mappings];
        mutation.mutate({
            ParameterMappings: wads?.mappings,
            workflowDefinitions: wads?.childDefinitions /** selected action definitions*/
        }, {
            onSuccess: (actionInstances) => {
                WorkflowState.ActionInstances = actionInstances;
                setCurrentView(RUN_WORKFLOW_VIEWS.INSTANCES);
            }
        });
        //add data to mappings
    };
    const previousDefinitions = usePrevious(definitions);
    React.useEffect(() => {
        console.log(areActionsReady)
        canActionInstancesChange({
            previousWorkflowId, workflowId, WorkflowState, definitions, previousDefinitions, mutation
        }) && areActionsReady && createActionInstances(definitions);
    }, [areActionsReady])
    //Take care to only call for instances once, as  action instance ids should not change while executing workflows


    return {definitions};
}

const canActionInstancesChange
    = ({
           previousWorkflowId,
           workflowId,
           WorkflowState,
           definitions,
           mutation,
           previousDefinitions
       }) => (previousWorkflowId!==workflowId
    || (!WorkflowState.ActionInstances?.length>0 && definitions?.length > 0)
    || hasActionDefinitionsChanged(previousDefinitions, definitions)) && !mutation.isLoading;