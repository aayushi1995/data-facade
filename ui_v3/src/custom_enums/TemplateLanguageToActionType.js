import TemplateLanguage from '../enums/TemplateLanguage.js'
import ActionDefinitionActionType from '../enums/ActionDefinitionActionType.js'


const TemplateLanguageToActionType = {
    [TemplateLanguage.SQL]: [
        ActionDefinitionActionType.PROFILING,
        ActionDefinitionActionType.CHECK,
    ],
    [TemplateLanguage.PYTHON]: [
        ActionDefinitionActionType.PROFILING,
        ActionDefinitionActionType.CHECK,
        ActionDefinitionActionType.CLEANUP_STEP,
    ]
}

export default TemplateLanguageToActionType;