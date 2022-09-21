import React from "react"
import {v4 as uuidv4} from 'uuid'
import { Application, Tag } from "../../../../generated/entities/Entities"


type BuildApplicationContextState = {
    Tags: Tag[],
    Application: Application,
    isCreating: boolean
}

const defaultBuildActionContext: () => BuildApplicationContextState = () => ({
    Application: {
        Id: uuidv4(),
        Description: "Description",
        UniqueName: "Demo"
    },
    Tags: [],
    isCreating: false
})

export const BuildApplicationContext = React.createContext<BuildApplicationContextState>(defaultBuildActionContext()) 

// Set Build Application Context State
type SetBuildApplicationContextState = (action: BuildApplicationAction) => void
const defaultSetBuildApplicationContextState: SetBuildApplicationContextState = (action: BuildApplicationAction) => {}
export const SetBuildApplicationContext = React.createContext<SetBuildApplicationContextState>(defaultSetBuildApplicationContextState)

// Action Types
// Action Definition
type SetApplicationNameAction = {
    type: "SetApplicationName",
    payload: {
        newName: string|undefined
    }
}

type SetApplicationDescriptionAction = {
    type: "SetApplicationDescription",
    payload: {
        newDescription: string|undefined
    }
}

type SetApplicationTagsAction = {
    type: "SetApplicationTags",
    payload: {
        newTags: Tag[]
    }
}

type CreatingApplicationAction = {
    type: "CreatingApplication"
}

type CreatingApplicationOverAction = {
    type: "CreatingApplicationOver"
}

type RefreshIdAction = {
    type: "RefreshId"
}

type SetUniqueName = {
    type: "SetUniqueName",
    payload: {
        newUniqueName: string|undefined
    }
}

export type BuildApplicationAction = SetApplicationNameAction | 
SetApplicationDescriptionAction | 
SetApplicationTagsAction | 
CreatingApplicationAction |
CreatingApplicationOverAction |
RefreshIdAction |
SetUniqueName



const reducer = (state: BuildApplicationContextState, action: BuildApplicationAction): BuildApplicationContextState => {
    switch (action.type) {
        case "SetApplicationName":
            return {
                ...state,
                Application: {
                    ...state.Application,
                    Name: action.payload.newName
                }
            }
        
        case "SetApplicationDescription":
            return {
                ...state,
                Application: {
                    ...state.Application,
                    Description: action.payload.newDescription
                }
            }

        case "SetApplicationTags":
            return {
                ...state,
                Tags: action.payload.newTags
            }

        case "CreatingApplication":
            return {
                ...state,
                isCreating: true
            }

        case "CreatingApplicationOver":
            return {
                ...state,
                isCreating: false
            }

        case "RefreshId":
            return {
                ...state,
                Application: {
                    ...state.Application,
                    Id: uuidv4()
                }
            }
        case "SetUniqueName": {
            return {
                ...state,
                Application: {
                    ...state.Application,
                    UniqueName: action.payload.newUniqueName
                }
            }
        }

        default:
            const neverAction: never = action
            console.log(`Action: ${neverAction} does not match any action`)
            return state
    }
}


export const BuildApplicationContextProvider = ({children}: {children: React.ReactElement}) => {
    const [contextState, dispatch] = React.useReducer(reducer, defaultBuildActionContext())
    const setContextState: SetBuildApplicationContextState = ( args: BuildApplicationAction) => dispatch(args)

    return (
        <BuildApplicationContext.Provider value={contextState}>
            <SetBuildApplicationContext.Provider value={setContextState}>
                {children}
            </SetBuildApplicationContext.Provider>
        </BuildApplicationContext.Provider>
    )
}