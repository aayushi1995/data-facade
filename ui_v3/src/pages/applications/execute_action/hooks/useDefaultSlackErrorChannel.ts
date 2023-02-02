import { useQuery } from "react-query"
import dataManagerInstance from "../../../../data_manager/data_manager"
import ProviderParameterDefinitionId from "../../../../enums/ProviderParameterDefinitionId"
import { ProviderParameterInstance } from "../../../../generated/entities/Entities"
import labels from "../../../../labels/labels"

function useDefaultSlackErrorChannel() {
    const fetchedDataManagerInstance = dataManagerInstance.getInstance as {retreiveData: Function}

    const query = useQuery([labels.entities.ProviderParameterInstance, "Slack"],
        () => {
            return fetchedDataManagerInstance.retreiveData(labels.entities.ProviderParameterInstance, {
                filter: {
                    ProviderParameterDefinitionId: ProviderParameterDefinitionId.SLACK_ERROR_CHANNEL
                }
            }).then((params: ProviderParameterInstance[]) => params?.[0]?.ParameterValue)
        }
    )
    
    return query
}

export default useDefaultSlackErrorChannel;