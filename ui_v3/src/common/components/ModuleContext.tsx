import React from "react";

export type HeaderType = {
    Title?: string,
    SubTitle?: string
}

export type ModuleContextStateType = {
    Header: HeaderType
}

const defaultModuleContextState: ModuleContextStateType = { 
    Header: {
        Title: "Default Title",
        SubTitle: "Default SubTitle"
    } 
}


export type SetModuleContextStateType = (action: ModuleContextStateAction) => void
const defaultSetModuleContextState: SetModuleContextStateType = (action: ModuleContextStateAction) => { }

export const ModuleContextState = React.createContext<ModuleContextStateType>(defaultModuleContextState)
export const SetModuleContextState = React.createContext<SetModuleContextStateType>(defaultSetModuleContextState)


export type SetHeaderAction = {
    type: "SetHeader",
    payload: {
        newHeader: HeaderType
    }
}

export type ModuleContextStateAction = SetHeaderAction


const reducer: (state: ModuleContextStateType, action: ModuleContextStateAction) => ModuleContextStateType = (state: ModuleContextStateType, action: ModuleContextStateAction) => {
    switch(action.type) {
        case "SetHeader": {
            return {
                ...state, 
                Header: action.payload.newHeader
            }
        }

        default: {
            return state
        }
    }
}


const ModuleContextStateProvider = ({children}: { children: React.ReactElement }) => {
    const [state, dispatch] = React.useReducer( reducer, defaultModuleContextState )
    const setState = (args: ModuleContextStateAction) => dispatch(args)

    return (
        <ModuleContextState.Provider value={state}>
            <SetModuleContextState.Provider value={setState}>
                {children}
            </SetModuleContextState.Provider>
        </ModuleContextState.Provider>
    )
}

export default ModuleContextStateProvider;