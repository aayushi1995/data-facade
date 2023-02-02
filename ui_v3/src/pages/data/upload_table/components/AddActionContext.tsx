import React from 'react';

interface addActionContextType {
    ActionMaker: string;
    setActionMaker: (value:string) => void;
}

const AddActionContext = React.createContext<addActionContextType >({
    ActionMaker: '',
    setActionMaker: () => {}
});

export default AddActionContext;