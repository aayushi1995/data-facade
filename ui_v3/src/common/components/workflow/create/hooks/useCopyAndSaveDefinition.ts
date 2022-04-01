import { useMutation } from "react-query"
import ActionDefinitionId from "../../../../../enums/ActionDefinitionId"
import { Fetcher } from "../../../../../generated/apis/api"



const useCopyAndSaveDefinition = (props: {mutationName: string}) => {

    return useMutation(
        props.mutationName,
        (options: {actionDefinitionId: string}) => {
            return Fetcher.fetchData("POST", "/copyAndSaveActionDefinition", {ExistingActionId: options.actionDefinitionId})
        } 
    )
}

export default useCopyAndSaveDefinition