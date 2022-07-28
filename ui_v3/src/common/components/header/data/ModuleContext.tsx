import React, { useReducer } from "react";
import { useRouteMatch } from "react-router";
import { TabType } from "../schema";

// Module State Contract
export type ModuleType = { tabsVisible: boolean, activeTab?: TabType };
// Initial State for Module
const initialState: ModuleType = {tabsVisible: true};
// Context to provide Module State
export const ModuleContext = React.createContext<ModuleType>(initialState)

// Set Module Callback State Contract 
export type SetModuleContextType = (args: ModuleAction) => void
// Initial State for Set Module Callback
const initialSetModuleState: SetModuleContextType = (args) => {}
// Context to provide Set Module Callback
export const SetModuleContext = React.createContext<SetModuleContextType>(initialSetModuleState)

// Collection of Actions that can be performed on the Module State
type ToggleTabsVisibilityAction = {
    type: "ToggleTabsVisibility"
}

type SetActiveTabAction = {
    type: "SetActiveTab",
    payload: {
        activeTab: TabType
    }
}

type ModuleAction = ToggleTabsVisibilityAction | SetActiveTabAction

// Reducer that returns updated Module State
const reducer = (state: ModuleType, action: ModuleAction): ModuleType => {
    switch(action.type) {
        case "ToggleTabsVisibility": {
            return {
                ...state,
                tabsVisible: !state.tabsVisible
            }
        }

        case "SetActiveTab": {
            return {
                ...state,
                activeTab: action.payload.activeTab
            }
        }
        
        default:
            const impossibleAction: never = action
            console.log("Unkown Action", impossibleAction)
    }
    return state;
}

// Component to Provide ModuleContext and SetModuleContext to children
export const ModuleProvider = ({children}: { children: React.ReactElement }) => {
    const [moduleState, dispatch] = useReducer(reducer, initialState);
    const setModuleState: SetModuleContextType = (args: ModuleAction) => dispatch(args)

    return <ModuleContext.Provider value={moduleState}>
        <SetModuleContext.Provider value={setModuleState}>
            {children}
        </SetModuleContext.Provider>
    </ModuleContext.Provider>
}