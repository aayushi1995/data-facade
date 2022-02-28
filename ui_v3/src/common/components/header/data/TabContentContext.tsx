import React, {useReducer} from "react";
const defaultTabContextState = {"": {}};
export type TabContentType = Record<string, any>; //toDatdo key oneof tabs.href
export const TabContentContext = React.createContext<TabContentType>(
    defaultTabContextState
)
type TabContentCbType = (oldTabContent:TabContentType)=>TabContentType;
export type TabContentSetContextType = (newState: TabContentType | TabContentCbType)=>null
export const TabContentSetContext = React.createContext<TabContentSetContextType>(
    (newState: TabContentType| TabContentCbType)=> null
)

const initialState: TabContentType = defaultTabContextState;
type TabContentAction = {type: string, payload: TabContentType};
const reducer = (state: TabContentType, action: TabContentAction)=>{
    return {...state, ...action.payload};
}
export const TabContentProvider = ({children}: { children: React.ReactElement }) => {
    const [TabContentState, dispatch] = useReducer(reducer, initialState);
    const setTabContentState: TabContentSetContextType = ( arg )=>{
        if(typeof arg === 'function'){
            const newTabContentState = arg(TabContentState);
            dispatch({type: 'TOGGLE_TAB_CONTENT', payload: newTabContentState});
        }else{
            dispatch({type: 'SET_TAB_CONTENT', payload: arg});
        }
        return null;
    }
    return <TabContentContext.Provider value={TabContentState}>
        <TabContentSetContext.Provider value={setTabContentState}>
            {children}
        </TabContentSetContext.Provider>
    </TabContentContext.Provider>
}