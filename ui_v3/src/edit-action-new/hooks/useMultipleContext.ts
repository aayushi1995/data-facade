/*
Collection of utility functions needed to hep maintain multiple BuildActionContext
*/

import React from "react"
import { BuildActionContextState } from "../../pages/build_action/context/BuildActionContext"

export const getActionIdFromActionContext = (context?: BuildActionContextState) => context?.actionDefinitionWithTags?.actionDefinition?.Id

function useMultipleContext() {
    const [contextStore, setContextStore] = React.useState<BuildActionContextState[]>([])
    
    const contextExistsInActionContexts = (context?: BuildActionContextState) => contextStore?.some(ac => ac?.actionDefinitionWithTags?.actionDefinition?.Id === getActionIdFromActionContext(context))
    
    const updateExistingContextOfActionContexts = (newContext: BuildActionContextState) => {
        setContextStore((oldContexts: BuildActionContextState[]) => oldContexts?.map((oldContext: BuildActionContextState) => 
            (getActionIdFromActionContext(oldContext)===getActionIdFromActionContext(newContext) && !!newContext) ? newContext : oldContext
        ))
    }

    const appendContextToActionContexts = (newContext: BuildActionContextState) => {
        setContextStore((oldContexts: BuildActionContextState[]) => {
            if(newContext){
                return [...oldContexts, newContext]
            }
            return oldContexts
        })
    }

    const storeActionContextInActionContexts = (newContext: BuildActionContextState) => {
        if(getActionIdFromActionContext(newContext)){
            if(contextExistsInActionContexts(newContext)) {
                updateExistingContextOfActionContexts(newContext)
            } else {
                appendContextToActionContexts(newContext)
            }
        }
    }

    const addContext = (newContext?: BuildActionContextState) => newContext && storeActionContextInActionContexts(newContext)
    const removeContext = (context?: BuildActionContextState) => context && setContextStore(oldContexts => oldContexts.filter(ac => getActionIdFromActionContext(ac) !== getActionIdFromActionContext(context)))
    const removeContextWithId = (contextId?: string) => contextId && setContextStore(oldContexts => oldContexts.filter(ac => getActionIdFromActionContext(ac) !== contextId))

    return {
        contextStore,
        addContext,
        removeContext,
        removeContextWithId
    }

}

export default useMultipleContext;