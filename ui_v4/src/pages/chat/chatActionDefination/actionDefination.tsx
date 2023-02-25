import { ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import MessageTypes from "@/helpers/enums/MessageTypes";
import { ExecuteActionContextProvider } from "@contexts/ExecuteActionContext";
import ExecuteAction from "./executeAction";

interface MatchParams {
    ActionDefinitionId: string
    ExistingModels?: ActionInstanceWithParameters,
    onSubmit?: (content: ActionInstanceWithParameters, type: string) => void
}


const ActionDefination = ({ ActionDefinitionId, ExistingModels, onSubmit }: MatchParams) => {
    console.log('inside action defintion',ActionDefinitionId, ExistingModels, onSubmit )

    const onActionSubmit = (messageContent: ActionInstanceWithParameters) => {
        onSubmit?.(messageContent, MessageTypes.ACTION_INSTANCE)
    }

    return (
        <ExecuteActionContextProvider>
                <ExecuteAction existingModels={ExistingModels} actionDefinitionId={ActionDefinitionId} showActionDescription={true} onSubmit={onActionSubmit}/>
        </ExecuteActionContextProvider>
    )
}

export default ActionDefination;