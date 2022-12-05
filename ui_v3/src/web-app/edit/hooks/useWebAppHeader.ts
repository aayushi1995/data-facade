import React from "react"
import { EditWebAppContext, SetEditWebAppContext } from "../context/EditWebAppContextProvider"


const useWebAppHeader = () => {
    const setEditWebAppContext = React.useContext(SetEditWebAppContext)

    const handleWebAppModelChange = (key: string, value: string) => {
        setEditWebAppContext({
            type: 'ChangeWebAppModel',
            payload: {
                key: key,
                value: value
            }
        })
    }

    return {
        handleWebAppModelChange
    }
}

export default useWebAppHeader