import { useQuery, UseQueryOptions } from "react-query"
import { Fetcher } from "../../../../generated/apis/api"
import { RecurringActionInstanceDetails } from "../../../../generated/interfaces/Interfaces"
import labels from "../../../../labels/labels"

interface UseGetScheduledActionInstancesProps {
    options?: UseQueryOptions<RecurringActionInstanceDetails[], unknown, RecurringActionInstanceDetails[], string[]>
}

const useGetScheduledActionInstances = (props: UseGetScheduledActionInstancesProps) => {

    return useQuery([labels.entities.ActionInstance, "Scheduled"], 
        () => Fetcher.fetchData('GET', '/getRecurringActionInstanceDetails', {}), 
        {
            ...props?.options
        }
    )
}

export default useGetScheduledActionInstances