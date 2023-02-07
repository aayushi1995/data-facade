import { createContext, useReducer } from 'react';

export type FileType = {
  fileURL?: string | null,
  fileName?: string | null,
  isUploadSucess?: boolean | null
}

const initialState: FileType = { fileURL: null, fileName: null, isUploadSucess: false };

export const DataContext = createContext<FileType>(initialState)

export type SetDataContextType = (args: DataAction) => void

const initialSetModuleState: SetDataContextType = (args) => { }

export const SetDataContext = createContext<SetDataContextType>(initialSetModuleState)

type SetFileAction = {
  type: "SetFile",
  payload: {
    fileURL?: string|null,
  }
}

type SetFileNameAction = {
  type: "SetFileName",
  payload: {
    fileName?: string|null,
  }
}

type SetFileUploadStateAction = {
  type: "SetFileUpload",
  payload: {
    isUploadSucess?: boolean,
  }
}

type DataAction = SetFileAction | SetFileNameAction | SetFileUploadStateAction

const reducer = (state: FileType, action: DataAction): FileType => {
  switch (action.type) {
    case "SetFile": {
      return {
        ...state,
        fileURL: action.payload.fileURL
      }
    }
    case "SetFileName": {
      return {
        ...state,
        fileName: action.payload?.fileName
      }
    }
    case "SetFileUpload": {
      return {
        ...state,
        isUploadSucess: action.payload?.isUploadSucess
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
  

  return (
    <DataContext.Provider value={fileData}>
      <SetDataContext.Provider value={setFileData}>
        {children}
      </SetDataContext.Provider>
    </DataContext.Provider>

  );
};

