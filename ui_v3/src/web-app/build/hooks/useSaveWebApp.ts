import { useMutation } from "react-query"
import dataManager from "../../../data_manager/data_manager"
import { ActionDefinition, ActionTemplate } from "../../../generated/entities/Entities"
import {v4 as uuidv4} from "uuid"
import ActionDefinitionActionType from "../../../enums/ActionDefinitionActionType"
import { userSettingsSingleton } from "../../../data_manager/userSettingsSingleton"


const useSaveWebApp = () => {
    const fetchedDataManager = dataManager.getInstance as {saveData: Function}

    return useMutation("SaveWebApp", (params: {webApp: ActionDefinition}) => {
        const templateId = uuidv4()
        const webApp: ActionDefinition = {
            ...params.webApp,
            ActionType: ActionDefinitionActionType.WEB_APP,
            CreatedBy: userSettingsSingleton.userEmail,
            DefaultActionTemplateId: templateId
        }

        const webAppTemplate: ActionTemplate = {
            Id: templateId,
            DefinitionId: webApp.Id
        }

        const actionProperties = {
            ActionDefinition: {
                model: webApp,
                tags: []
            },
            ActionTemplatesWithParameters: [{
                actionParameterDefinitions: [],
                model: webAppTemplate,
                tags: []
            }],
            CreateActionDefinitionForm: true
        }

        return fetchedDataManager.saveData("ActionDefinition", actionProperties)
    })
}

export default useSaveWebApp