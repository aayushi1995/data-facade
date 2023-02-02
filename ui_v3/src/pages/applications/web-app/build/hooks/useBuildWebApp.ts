import React from "react"
import { generatePath, useHistory, useLocation } from "react-router"
import { v4 as uuidv4 } from "uuid"
import { APPLICATION_WEB_APP_EDIT_ROUTE } from "../../../../../common/components/route_consts/data/ApplicationRoutesConfig"
import { ActionDefinition } from "../../../../../generated/entities/Entities"
import useSaveWebApp from "./useSaveWebApp"

interface UseBuildWebAppParams {
    applicationId?: string
}

const useBuildWebApp = ({applicationId}: UseBuildWebAppParams) => {
    const [webAppName, setWebAppName] = React.useState<string | undefined>()
    const [webAppDescription, setWebAppDescription] = React.useState<string | undefined>()

    const saveWebAppMutation = useSaveWebApp()
    const location = useLocation()
    const history = useHistory()

    const handleWebAppNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebAppName(event.target.value)
    }

    const handleWebAppDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setWebAppDescription(event.target.value)
    }
    const webAppApplicationId = applicationId || location.search ? new URLSearchParams(location.search).get("applicationId") as string
                            : undefined

    const onSave = () => {
        const webAppToBeSaved: ActionDefinition = {
            DisplayName: webAppName,
            Description: webAppDescription,
            UniqueName: webAppName,
            ApplicationId: webAppApplicationId,
            Id: uuidv4()
        }

        saveWebAppMutation.mutate({
            webApp: webAppToBeSaved
        },{
            onSuccess: () => {
                history.push(generatePath(APPLICATION_WEB_APP_EDIT_ROUTE, {WebAppId: webAppToBeSaved.Id}))
            }
        })
    }

    return {
        webAppName,
        webAppDescription,
        handleWebAppNameChange,
        handleWebAppDescriptionChange,
        onSave
    }
}

export default useBuildWebApp