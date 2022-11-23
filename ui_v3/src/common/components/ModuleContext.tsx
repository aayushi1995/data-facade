import React from "react";
import { useHistory } from "react-router";

export type HeaderType = {
    Title?: string,
    SubTitle?: string,
}

export type ModuleContextStateType = {
    Header: HeaderType,
    DisplayHeader: boolean
}

const defaultModuleContextState: ModuleContextStateType = { 
    Header: {
        Title: "Default Title",
        SubTitle: "Default SubTitle"
    },
    DisplayHeader: false 
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

export type SetDisplayHeader = {
    type: "SetDisplayHeader",
    payload: {
        display: boolean
    }
}

export type ModuleContextStateAction = SetHeaderAction | SetDisplayHeader


const reducer: (state: ModuleContextStateType, action: ModuleContextStateAction) => ModuleContextStateType = (state: ModuleContextStateType, action: ModuleContextStateAction) => {
    switch(action.type) {
        case "SetHeader": {
            return {
                ...state, 
                Header: action.payload.newHeader
            }
        }
        case "SetDisplayHeader": {
            return {
                ...state,
                DisplayHeader: action.payload.display
            }
        }

        default: {
            return state
        }
    }
}


const ModuleContextStateProvider = ({children}: { children: React.ReactElement }) => {

    const history = useHistory()
    const [state, dispatch] = React.useReducer( reducer, defaultModuleContextState )
    const setState = (args: ModuleContextStateAction) => dispatch(args)

    React.useEffect(() => {
        console.log(history.location.pathname.includes("application/workflow-execution"))
        if(history.location.pathname.includes("application/action-execution") || history.location.pathname.includes("application/workflow-execution")) {
            console.log(history.location.pathname)
            setState({
                type: 'SetDisplayHeader',
                payload: {
                    display: false
                }
            })
        } else {
            setState({
                type: 'SetDisplayHeader',
                payload: {
                    display: true
                }
            })
        }
    }, [history.location.pathname])

    return (
        <ModuleContextState.Provider value={state}>
            <SetModuleContextState.Provider value={setState}>
                {children}
            </SetModuleContextState.Provider>
        </ModuleContextState.Provider>
    )
}

export default ModuleContextStateProvider;