import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { ActionDefinition } from "../../../../generated/entities/Entities"
import { ActionRun } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"


interface UseFetchActionRunsProps {
    filter: ActionDefinition,
    params?: UseQueryOptions<unknown, unknown, ActionRun[], [string, string, ActionDefinition]>
}

const useFetchActionRuns = (props: UseFetchActionRunsProps) => {

    return useQuery([labels.entities.ActionDefinition, "ActionRuns", props.filter],
        () => Fetcher.fetchData("GET", "/getPastRunsForActions", props.filter), {
            ...props.params
        }
    )
}

export default useFetchActionRuns