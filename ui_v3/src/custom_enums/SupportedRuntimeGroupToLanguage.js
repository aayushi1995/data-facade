import TemplateLanguage from "../enums/TemplateLanguage"
import TemplateSupportedRuntimeGroup from "../enums/TemplateSupportedRuntimeGroup"

const SupportedRuntimeGroupToLanguage = {
    [TemplateSupportedRuntimeGroup.PYTHON]: TemplateLanguage.PYTHON,
    [TemplateSupportedRuntimeGroup.DATABRICKS_SQL]: TemplateLanguage.SQL,
    [TemplateSupportedRuntimeGroup.SNOWFLAKE_SQL]: TemplateLanguage.SQL,
    [TemplateSupportedRuntimeGroup.POSTGRES_SQL]: TemplateLanguage.SQL,
}

const getLanguage = (supportedRuntimeGroup) => {
    if (supportedRuntimeGroup in SupportedRuntimeGroupToLanguage) {
        return SupportedRuntimeGroupToLanguage[supportedRuntimeGroup]
    } else {
        return TemplateLanguage.SQL
    }
}

export {
    SupportedRuntimeGroupToLanguage,
    getLanguage
}