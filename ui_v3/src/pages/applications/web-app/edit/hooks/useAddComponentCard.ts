import React from "react"
import { SetEditWebAppContext } from "../context/EditWebAppContextProvider"



interface UseAddComponentProps {
    componentType: string
}

const useAddComponentCard = ({componentType}: UseAddComponentProps) => {

    const setEditWebAppContext = React.useContext(SetEditWebAppContext)


    const onComponentAdd = () => {
        setEditWebAppContext({
            type: 'AddComponentToWebApp',
            payload: {
                component: {
                    Type: componentType
                }
            }
        })    
    }

    return {
        onComponentAdd
    }
}

export default useAddComponentCard