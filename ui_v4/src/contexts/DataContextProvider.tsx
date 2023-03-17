import { createContext, useReducer } from 'react';

export type FileType = {
  chatData?: any | null
}

const initialState: FileType = { chatData: {} };

export const DataContext = createContext<FileType>(initialState)

export type SetDataContextType = (args: DataAction) => void

const initialSetModuleState: SetDataContextType = (args) => { }

export const SetDataContext = createContext<SetDataContextType>(initialSetModuleState)

type setChatDataAction = {
  type: "setChatData",
  payload: {
    chatData?: any | null,
  }
}

type DataAction = setChatDataAction

const reducer = (state: FileType, action: DataAction): FileType => {

  switch (action.type) {
    case "setChatData": {
      const chatId = action.payload?.chatData?.chatId;
      const chatData = action.payload?.chatData;
      return {
        ...state,
        chatData: {
          ...state.chatData,
          [chatId]: {
            ...state.chatData[chatId],
            ...chatData 
          }
        }
      }
    }
    default:
      break
  }
  return state;
}


export const DataProvider = ({ children }: { children: React.ReactElement }) => {
  const [fileData, dispatch] = useReducer(reducer, initialState);
  const setFileData: SetDataContextType = (args: DataAction) => dispatch(args)
  // const [fileData, dispatch] = useReducer(reducer, initialState);
  // const setFileData: SetDataContextType = (args: DataAction) => dispatch(args)

  return (
    <DataContext.Provider value={fileData}>
      <SetDataContext.Provider value={setFileData}>
        {children}
      </SetDataContext.Provider>
    </DataContext.Provider>

  );
};

