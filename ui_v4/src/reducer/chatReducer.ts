
interface IChatReducerState {
    chats: chatType | null,
    loading: LoadchatType | null
    
}

interface chatType {
    [key:string]: any
}

interface LoadchatType {
    [key:string]: boolean
}

const initialState = {
    chats: null,
    loading: null
}


type addChatAction = {
    type: "ADD_CHAT",
    payload: {
        data: any,
        id: string
    }
}

type updateChatAction = {
    type: "SET_CHAT",
    payload: {
        message: any,
        id: string
    }
}

type setLoading = {
    type: "SET_LOADING",
    payload: {
        id: string,
        isLoading: boolean
    }
}

type Action = addChatAction | updateChatAction | setLoading
 

export const chatReducer = (state: IChatReducerState = initialState, action: Action) => {
    switch(action.type){
        case "ADD_CHAT": {
            const id = action.payload.id as unknown as string
            return {
                ...state,
                chats: state?.chats ? { 
                    ...state?.chats,
                    [id]:[...action?.payload?.data] 
                } : {
                    [id]:[...action?.payload?.data] 
                }
            }
        }
        case "SET_CHAT": {
            const id = action.payload.id as unknown as string
            const chatIDS = state?.chats?.[id]!
            
            return {
                ...state,
                chats: state?.chats ? { 
                    ...state?.chats,
                    [id]: chatIDS ? [
                        ...state?.chats?.[id],
                        action?.payload?.message
                    ]: [action?.payload?.message]
                } : { 
                    [id]: chatIDS ? [
                        ...state?.chats?.[id],
                        action?.payload?.message
                    ]: [action?.payload?.message]
                }
                
            }
        }

        case "SET_LOADING": {
            const id = action?.payload?.id as unknown as string
            const loading = action?.payload?.isLoading as unknown as boolean
            
            return {
                ...state,
                loading: state?.loading ? {
                    ...state?.loading,
                    [id]: loading
                } : {
                    [id]: loading
                }
                
            }
        }

        default: {
            return state
        }
    }
}