import { createContext, useReducer } from 'react';

export type DataType = {
  tableData?: any | null,
  actionData?: any | null
}

const initialState: DataType = { tableData: null, actionData: null };

export const ChatContext = createContext<DataType>(initialState)

export type SetDataContextType = (args: DataAction) => void

const initialSetModuleState: SetDataContextType = (args) => { }

export const SetChatContext = createContext<SetDataContextType>(initialSetModuleState)

type setChatDataAction = {
  type: "setTableData",
  payload: {
    tableData: {
      tableId: string,
      data?: any | null
    },
  }
}
type setActionOwner = {
  type: "setActionOwner",
  payload: {
    actionData: {
      [actionId:string]: string
    },
  }
}

type DataAction = setChatDataAction | setActionOwner

const reducer = (state: DataType, action: DataAction): DataType => {

  switch (action.type) {
    case "setTableData": {
      const tableId = action.payload?.tableData?.tableId;
      const tableData = action.payload?.tableData?.data;
      return {
        ...state,
        tableData: {
          ...state.tableData,
          [tableId]: {
            ...tableData 
          }
        }
      }
    }

    case "setActionOwner": {
      const id = action.payload.actionData?.actionId
      const data = action.payload.actionData?.actionUpdatedBy

      return {
        ...state,
        actionData: {
          ...state.actionData,
          [id]:data
        }
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

