import React from "react"
import { ActionDefinitionDetail, WebAppDetails } from "../../../../../generated/interfaces/Interfaces"
import useGetWebAppDetails from "../../hooks/useGetWebAppDetails"
import { EditWebAppContext, SetEditWebAppContext } from "../context/EditWebAppContextProvider"
import useSaveWebApp from "./useSaveWebApp"


interface UseWebAppEditHomePageParams {
    webAppId: string
}

const useWebAppEditHomePage = ({webAppId}: UseWebAppEditHomePageParams) => {

    const setEditWebAppContext = React.useContext(SetEditWebAppContext)
    const editWebAppContext = React.useContext(EditWebAppContext)
    const [addActionDialogState, setAddActionDialogState] = React.useState(false)
    const saveWebAppMutation = useSaveWebApp()

    console.log(editWebAppContext)

    const loadContextWithWebApp = (webAppDetaisList: WebAppDetails[]) => {
        if(webAppDetaisList.length > 0) {
            const webAppDetails = webAppDetaisList[0]
            setEditWebAppContext({
                type: 'SetContextWithDetails',
                payload: {
                    details: webAppDetails
                }
            }) 
        }
    }

    const onSave = () => {
        saveWebAppMutation.mutate({
            state: editWebAppContext
        }, {
            onSuccess(data, variables, context) {
                console.log("SAVED")
            },
        })
    }

    const webAppDetailsQuery = useGetWebAppDetails({
        filter: {Id: webAppId},
        options: {
            enabled: false,
            onSuccess: loadContextWithWebApp
        }
    })

    const onAddActionDialogStateChange = () => {
        setAddActionDialogState(state => !state)
    }

    const onActionAdd = (actionDefintionDetail: ActionDefinitionDetail, actionReferenceName?: string) => {
        console.log(actionDefintionDetail)
        setEditWebAppContext({
            type: 'AddActionToWebApp',
            payload: {
                actionDefinitionToAdd: actionDefintionDetail,
                referenceName: actionReferenceName || actionDefintionDetail.ActionDefinition?.model?.UniqueName!
            }
        })
        onAddActionDialogStateChange()
    }

    return {
        loadContextWithWebApp,
        webAppDetailsQuery,
        onSave,
        saveWebAppMutation,
        onAddActionDialogStateChange,
        addActionDialogState,
        onActionAdd
    }

}

export default useWebAppEditHomePage