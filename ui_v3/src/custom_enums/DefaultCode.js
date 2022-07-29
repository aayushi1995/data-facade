import TemplateSupportedRuntimeGroup from '../enums/TemplateSupportedRuntimeGroup.js';
import ActionDefinitionActionType from './../enums/ActionDefinitionActionType.js';


const DefaultCode = {
    [ActionDefinitionActionType.PROFILING]: {
        [TemplateSupportedRuntimeGroup.DATABRICKS_SQL]: `SELECT COUNT(*) FROM {table_name} where {column_name} = {some_value}`,
        [TemplateSupportedRuntimeGroup.POSTGRES_SQL]: `SELECT COUNT(*) FROM {table_name} where {column_name} = {some_value}`,
        [TemplateSupportedRuntimeGroup.SNOWFLAKE_SQL]: `SELECT COUNT(*) FROM {table_name} where {column_name} = {some_value}`,
        [TemplateSupportedRuntimeGroup.PYTHON]:
            `
'''
each function will be wrapped inside a single class. It should have a self attribute
The execute function must have a pandas dataframe as a parameter which will be replaced by the table you select
For eg. the below code calculates the sum of a column in a table and multiplies it with a constant k
To plot charts you can use the df_plot class. The options for df_plot are:
 - df_plot.bar_chart(name, x, y, data)
 - df_plot.scatter_chart(name, x, y, data)
 - df_plot.pie_chart(name, legends, y, data)
 - df_plot.line_chart(name, x, y, data)
 - df_plot.single_value(name, value, variation=None)
 - df_plot.segment_line_chart(name, x, y, segments, data)

For eg to plot column1 against column2 as a line chart for dataframe df use:
- df_plot.line_chart("Chart Name", column1, column2, df)
'''
from dft.base_execution_handler import BaseExecutionHandler


class ExecutionHandler(BaseExecutionHandler):
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

from dft.base_execution_handler import BaseExecutionHandler


class ExecutionHandler(BaseExecutionHandler):
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

from dft.base_execution_handler import BaseExecutionHandler


class ExecutionHandler(BaseExecutionHandler):
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
                return `-- Enter SQL Code\n-- Select count(*), {column1} from {table} where {column2} = {val} group by {column1}`
            }
        }
    } else {
        return `Default Code Sample Not Available`
    }
}

export default getDefaultCode;
