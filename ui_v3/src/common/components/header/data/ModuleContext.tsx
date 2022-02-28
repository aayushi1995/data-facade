import React, {useReducer} from "react";
import {TabType} from "../schema";

export type ModuleType = { isOpen: boolean, currentTab?: TabType };
export const ModuleContext = React.createContext<ModuleType>(
    {isOpen: true}
)
type ModuleCbType = (oldModule:ModuleType)=>ModuleType;
export type ModuleSetContextType = (newState: ModuleType | ModuleCbType)=>null
export const ModuleSetContext = React.createContext<ModuleSetContextType>(
    (newState: ModuleType| ModuleCbType)=> null
)

const initialState: ModuleType = {isOpen: true};
type ModuleAction = {type: string, payload: ModuleType};
const reducer = (state: ModuleType, action: ModuleAction)=>{
    return {...state, ...action.payload};
}
export const ModuleProvider = ({children}: { children: React.ReactElement }) => {
    const [moduleState, dispatch] = useReducer(reducer, initialState);
    const setModuleState: ModuleSetContextType = ( arg )=>{
        if('isOpen' in arg){
            dispatch({type: 'SET_MODULE', payload: arg});
        }else{
            const newModuleState = arg(moduleState);
            dispatch({type: 'TOGGLE_MODULE', payload: newModuleState});
        }
        return null;
    }
    return <ModuleContext.Provider value={moduleState}>
        <ModuleSetContext.Provider value={setModuleState}>
            {children}
        </ModuleSetContext.Provider>
    </ModuleContext.Provider>
}