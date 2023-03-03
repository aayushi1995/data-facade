import { createContext, useReducer } from 'react';

export type DataType = {
  data?: any | null
}

const initialState: DataType = { data: null };

export const PlaygroundContext = createContext<DataType>(initialState)

export type SetDataContextType = (args: DataAction) => void

const initialSetModuleState: SetDataContextType = (args) => { }

export const SetPlaygroundContext = createContext<SetDataContextType>(initialSetModuleState)

type setPlaygroundDataAction = {
  type: "setData",
  payload: {
    data: any | null
  }
}

type DataAction = setPlaygroundDataAction

const reducer = (state: DataType, action: DataAction): DataType => {

  switch (action.type) {
    case "setData": {
      return {
        ...state,
        data: {
          ...state,
           data:  action?.payload?.data
        }
      }
    }
    
    default:
      break
  }
  return state;
}


export const PlaygroundProvider = ({ children }: { children: React.ReactElement }) => {
  const [data, dispatch] = useReducer(reducer, initialState);
  const setData: SetDataContextType = (args: DataAction) => dispatch(args)
  

  return (
    <PlaygroundContext.Provider value={data}>
      <SetPlaygroundContext.Provider value={setData}>
        {children}
      </SetPlaygroundContext.Provider>
    </PlaygroundContext.Provider>

  );
};

