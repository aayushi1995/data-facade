import React from "react"
import { EditWebAppContext, WebAppActionDefition } from "../context/EditWebAppContextProvider"


const useAddedActionList = () => {

    const editWebAppContext = React.useContext(EditWebAppContext)
    const [selectedAction, setSelectedAction] = React.useState<WebAppActionDefition | undefined>()

    const actions = editWebAppContext.Actions

    const handleActionClick = (action: WebAppActionDefition) => {
        setSelectedAction(action)
    }

    const handleDialogClose = () => {
        setSelectedAction(undefined)
    }

    return {
        actions,
        selectedAction,
        handleActionClick,
        handleDialogClose
    }

}

export default useAddedActionList