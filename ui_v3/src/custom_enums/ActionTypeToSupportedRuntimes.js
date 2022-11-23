import ActionDefinitionActionType from './../enums/ActionDefinitionActionType'
import TemplateSupportedRuntimeGroup from './../enums/TemplateSupportedRuntimeGroup'

const ActionTypeToSupportedRuntimes = {
    [ActionDefinitionActionType.CHECK]: [
        TemplateSupportedRuntimeGroup.DATABRICKS_SQL,
        TemplateSupportedRuntimeGroup.POSTGRES_SQL,
        TemplateSupportedRuntimeGroup.SNOWFLAKE_SQL,
        TemplateSupportedRuntimeGroup.COMMON,
        TemplateSupportedRuntimeGroup.PYTHON
    ],
    [ActionDefinitionActionType.PROFILING]: [
        TemplateSupportedRuntimeGroup.DATABRICKS_SQL,
        TemplateSupportedRuntimeGroup.POSTGRES_SQL,
        TemplateSupportedRuntimeGroup.SNOWFLAKE_SQL,
        TemplateSupportedRuntimeGroup.COMMON,
        TemplateSupportedRuntimeGroup.PYTHON
    ],
    [ActionDefinitionActionType.ML_PREDICT]: [
        TemplateSupportedRuntimeGroup.SAGEMAKER,
    ],
    [ActionDefinitionActionType.ML_TRAIN]: [
        TemplateSupportedRuntimeGroup.SAGEMAKER,
    ]
}

export default ActionTypeToSupportedRuntimes;