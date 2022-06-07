import { string } from "prop-types"
import { useMutation, UseMutationOptions } from "react-query"
import dataManager from "../../../../../data_manager/data_manager"
import { ActionDefinition } from "../../../../../generated/entities/Entities"
import labels from "../../../../../labels/labels"


interface CreateRuntimeWorkflowProps {
    mutationName: string,
    options?: UseMutationOptions<ActionDefinition[], unknown, unknown, unknown>
}

const useCreateRuntimeWorkflow = (props: CreateRuntimeWorkflowProps) => {

    const fetchedDataManager = dataManager.getInstance as {retreiveData: Function}

    return useMutation(
        props.mutationName,
        (params: {tableId: string, autoFlow: string, actionGroups?: string[]}) => {
            return fetchedDataManager.retreiveData(
                labels.entities.TableProperties,
                {
                    filter: {
                        Id: params.tableId
                    },
                    "makeWorkflowForTable": true,
                    "AutoFlow": params.autoFlow,
                    "ActionGroups": params.actionGroups
                }
            )
        }, {
            ...props.options
        }
    )
}

export default useCreateRuntimeWorkflow