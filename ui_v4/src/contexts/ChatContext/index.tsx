import { createContext, useReducer } from 'react';

export type DataType = {
  tableData?: any | null
}

const initialState: DataType = { tableData: null };

export const ChatContext = createContext<DataType>(initialState)

export type SetDataContextType = (args: DataAction) => void

const initialSetModuleState: SetDataContextType = (args) => { }

export const SetChatContext = createContext<SetDataContextType>(initialSetModuleState)

type setChatDataAction = {
  type: "setTableData",
  payload: {
    tableData?: any | null,
  }
}

type DataAction = setChatDataAction

const reducer = (state: DataType, action: DataAction): DataType => {

  switch (action.type) {
    case "setTableData" : {
      return {
        ...state,
        tableData: action?.payload?.tableData || null
      }
    }
    default:
      break
  }
  return state;
}


export const ChatProvider = ({ children }: { children: React.ReactElement }) => {
  const [chatData, dispatch] = useReducer(reducer, initialState);
  const setChatData: SetDataContextType = (args: DataAction) => dispatch(args)
  

  return (
    <ChatContext.Provider value={chatData}>
      <SetChatContext.Provider value={setChatData}>
        {children}
      </SetChatContext.Provider>
    </ChatContext.Provider>

  );
};

