import { ActionInstanceWithParameters } from "@/generated/interfaces/Interfaces";
import MessageTypes from "@/helpers/enums/MessageTypes";
import { ExecuteActionContextProvider } from "@contexts/ExecuteActionContext";
import ExecuteAction from "./executeAction";

interface MatchParams {
    ActionDefinitionId: string
    ExistingModels?: ActionInstanceWithParameters,
    onSubmit?: (content: ActionInstanceWithParameters, type: string) => void
}


const ActionDefination = ({ ActionDefinitionId, ExistingModels, onSubmit}: MatchParams) => {

    const onActionSubmit = (messageContent: ActionInstanceWithParameters) => {
        onSubmit?.(messageContent, MessageTypes.ACTION_INSTANCE)
        
    }


    return (
        <ExecuteActionContextProvider>
            <ExecuteAction existingModels={ExistingModels} actionDefinitionId={ActionDefinitionId} showActionDescription={true} onSubmit={onActionSubmit} parentExecutionId={ExistingModels?.ParameterInstances?.[0]?.SourceExecutionId}/>
        </ExecuteActionContextProvider>
    )
}

export default ActionDefination;