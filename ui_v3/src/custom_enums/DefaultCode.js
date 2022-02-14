import TemplateSupportedRuntimeGroup from '../enums/TemplateSupportedRuntimeGroup.js';
import ActionDefinitionActionType from './../enums/ActionDefinitionActionType.js';


const DefaultCode = {
    [ActionDefinitionActionType.PROFILING]: {
        [TemplateSupportedRuntimeGroup.DATABRICKS_SQL]: `SELECT COUNT(*) FROM {table_name} where {column_name} = {some_value}`,
        [TemplateSupportedRuntimeGroup.POSTGRES_SQL]: `SELECT COUNT(*) FROM {table_name} where {column_name} = {some_value}`,
        [TemplateSupportedRuntimeGroup.SNOWFLAKE_SQL]: `SELECT COUNT(*) FROM {table_name} where {column_name} = {some_value}`,
        [TemplateSupportedRuntimeGroup.PYTHON]:
            `# each function will be wrapped inside a single class. It should have a self attribute
# The execute function must have a pandas dataframe as a parameter which will be replaced by the table you select
# For eg. the below code calculates the sum of a column in a table and multiplies it with a constant k
def execute(self, df, column, k):
    return df[column].sum()*k
`
    },
    [ActionDefinitionActionType.CHECK]: {
        [TemplateSupportedRuntimeGroup.DATABRICKS_SQL]: `SELECT COUNT(*)<1 FROM {table_name}`,
        [TemplateSupportedRuntimeGroup.POSTGRES_SQL]: `SELECT COUNT(*)<1 FROM {table_name}`,
        [TemplateSupportedRuntimeGroup.SNOWFLAKE_SQL]: `SELECT COUNT(*)<1 FROM {table_name}`,
        [TemplateSupportedRuntimeGroup.PYTHON]:
            `# each function will be wrapped inside a single class. It should have a self attribute
# The execute function must have a pandas dataframe as a parameter which will be replaced by the table you select
# For eg. the below code checks if a table is empty or not and returns a boolean value accordingly
def execute(self, df):
    return len(df.index) > 0
`
    },
    [ActionDefinitionActionType.CLEANUP_STEP]: {
        [TemplateSupportedRuntimeGroup.PYTHON]:
            `# each function will be wrapped inside a single class. It should have a self attribute
# The execute function must have a pandas dataframe as a parameter which will be replaced by the table you select
# Cleanup steps should return a pandas dataframe, which should be the transformed table after your operations
# For eg. the below code takes a table and a column as parameters and returns a new table with that column values multiplied by 2
def execute(self, df, column):
    df[column] = df[column].multiply(2)
    return df
`
    }
}


const getDefaultCode = (actionType, supportedRuntimeGroup) => {
    if (actionType in DefaultCode) {
        if (supportedRuntimeGroup in DefaultCode[actionType]) {
            return DefaultCode[actionType][supportedRuntimeGroup]
        } else {
            if (supportedRuntimeGroup === TemplateSupportedRuntimeGroup.PYTHON) {
                return `# Enter Python Code\n# Default Code Sample Not Available`
            } else {
                return `// Enter SQL Code\n// Default Code Sample Not Available`
            }
        }
    } else {
        return `Default Code Sample Not Available`
    }
}

export default getDefaultCode;