import React from "react"
import { Layout } from "react-grid-layout"
import { SetEditWebAppContext } from "../context/EditWebAppContextProvider"

const useWebAppBody = () => {

    const setEditWebAppContext = React.useContext(SetEditWebAppContext)

    const updateComponents = (layout: Layout[]) => {
        setEditWebAppContext({
            type: 'ChangeLayout',
            payload: {
                loayout: layout
            }
        })
    }

    return {
        updateComponents
    }

}

export default useWebAppBody