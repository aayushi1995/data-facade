import dataManager from "@/api/dataManager"
import { ProviderInstance } from "@/generated/entities/Entities"
import { GetSlackChannelsResponse, SlackConversation } from "@/generated/interfaces/Interfaces"
import { labels } from "@/helpers/constant"
import ProviderDefinitionId from "@/helpers/enums/ProviderDefinitionId"
import { useQuery } from "react-query"

export type UseSlackChannelIDInputProps = {
    selectedChannelIds?: (string | undefined)[],
    onSelectedIDChange?: (selectedChannelIds: string[]) => void
}

function useSlackChannelIDInputProps(params: UseSlackChannelIDInputProps) {
    const fetchedDataManagerInstance = dataManager.getInstance as {retreiveData: Function}
    const query = useQuery<GetSlackChannelsResponse, unknown, GetSlackChannelsResponse, any>([labels.entities.ProviderInstance, "SLACK"], 
        () => {
            const response = fetchedDataManagerInstance.retreiveData(
                labels.entities.ProviderInstance,
                {
                    filter: {
                        ProviderDefinitionId: ProviderDefinitionId.SLACK
                    } as ProviderInstance,
                    GetSlackChannels: true
                }
            )
            return response.then((data?: any[]) => data?.[0])
        }
    )
        
    
    const availableChannels = query?.data?.channels || []
    const selectedChannels = availableChannels?.filter(channel => channel?.Id && params?.selectedChannelIds?.includes(channel?.Id))
    const onSelectedChannelChange = (selectedChannels?: SlackConversation[]) => 
        params?.onSelectedIDChange?.(
            selectedChannels?.filter?.(c => !!c?.Id)?.map?.(channel => channel.Id!) || []
        )

    return { selectedChannels, avialableChannels: availableChannels, onSelectedChannelChange }
}

export default useSlackChannelIDInputProps