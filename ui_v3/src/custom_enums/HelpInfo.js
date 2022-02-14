const HelpInfo = {
    ACTION_DEFINITION_FORM_SELECT_LANGUAGE: {
        PRIMARY:
            `Select desired language to configure Action in

Currently we support:
1. Python3
2. SQL
`,
        SECONDARY: "Language of the Action"
    },
    ACTION_DEFINITION_FORM_SELECT_INPUT_TYPE: {
        PRIMARY:
            `Configure appropriate type for selected parameter

Currently we support:
1. Pandas Dataframe
2. SQL
`,
        SECONDARY: "Type of this Parameter"
    },
    ACTION_DEFINITION_FORM_SELECT_ACTION_TYPE: {
        PRIMARY:
            `Different kind of Actions that can be configured:

1. Profiling:

Action's Resultant Value is parsed for meaningful insight.        
Return Type determines parsing behaviour.


2. Check:

Action returns a Boolean upon completion.
This Boolean determines Check's success.
If check fails, an Alert is sent


3. Cleanup Step (Only Python3):

Action returns a Pandas Dataframe which contains cleaned table.
This cleaned table is synced back into the system.
Original table is not modified
`,
        SECONDARY: "Type of Action"
    },
    ACTION_DEFINITION_FORM_SELECT_PRESENTATION_FORMAT: {
        PRIMARY:
            `Return Type is used to parse the output of the Action

Different kind of Return Type's that can be configured:

1. Single Value:

Action returns a single Numeric Value

2. Frequency:

Action returns a Map
{
    "key1": frequency1,
    "key2": frequency2,
    "key3": frequency3
}

3. Table

Action returns a Table.
`,
        SECONDARY: "Return format of this Action?"
    },
    ACTION_DEFINITION_FORM_SELECT_DEFAULT_SCOPE: {
        PRIMARY:
            `Different kind of Default Scopes:

1. All Tables
Newly Synced Tables have this Action run automatically

2. All Columns
Each Column of newly synced Table has this Action run automatically

How to use?

Include 1 Parameter with Type: Column Name

For each column in the table 
If its datatype satifies 'Column Scope' Field
This Action is run on it with the parameter replaced by its name
`,
        SECONDARY: "If default then scope?"
    },
    ACTION_DEFINITION_FORM_SELECT_COLUMN_DEFAULT_SCOPE: {
        PRIMARY:
            `Column Groups on which Actions can be run

1. Any Datatype
The Action will run on all columns of the table

2. Only Boolean
The Action will run on only Boolean columns of the table

3. Only String
The Action will run on only String columns of the table

2. Numeric(Integer, Number, Float)
The Action will run on Integer or Float columns of the table
`,
        SECONDARY: "Which columns to include?"
    },

    ACTION_DEFINITION_FORM_SELECT_PARAMETER: {
        PRIMARY:
            `Search for desired Parameter and Configure Type

Available Types:

1. String:
Datatype of the parameter is a String

2. Boolean:
Datatype of the parameter is a Boolean

3. Integer:
Datatype of the parameter is a Integer

4. Decimal:
Datatype of the parameter is a Decimal

5. Column Name:
Parameter carries Name of a Column
Autofilled to carry Column's name.
Used in Default Actions.

Value limited to column's of a table.

6. Table Name:
Parameter carries Name of a Table
Autofilled to carry Table's name.
Used in Default Actions.

Value limited to synced Tables

7. Pandas Dataframe(Only Python):
Parameter carries entire table
Autofilled to carry Table as a Pandas Dataframe.
Used in Default Actions.

Value limited to synced Tables
`,
        SECONDARY: "Search and Configure Parameter"
    },
    ACTION_INSTANCE_CREATE_HEADING: {
        PRIMARY: "Select any action defintion and the table you want to run it on along with the required parameters and let us take care of the rest. See it's results on the quick stats of the table",
        SECONDARY: "Run Action Definition on any table "
    },
    ADD_RUNTIME_GROUP: {
        PRIMARY:
            `
What is a Runtime Group?

A collection of similar execution environments is a runtime group.
For example:

Different Data Sources may expose the same SQL version for data querying.
Such Data Sources can be clubbed under a single Runtime Group.

Moreover, Each Action Definition can be configured to have multiple Runtime Group Support.
For example:

Data Source 1 exposes SQL as its querying language
Data Source 2 exposes Python as its querying language

An Action Definition which has configured Runtime Groups for both can decide which Code to use while querying.

SELECT COUNT(*) FROM {table}

is similar to

def execute(self, df):
    return len(df.index())
`,
        SECONDARY: "Add Runtime Group"
    },
    ADD_ACTION_DEFINITION: {
        PRIMARY_DISABLED: true,
        SECONDARY: "Add another Action Definition "
    },
    CREATE_TAG_FORM_NAME: {
        PRIMARY_DISABLED: true,
        SECONDARY: "Name of the Tag "
    },
    CREATE_TAG_FORM_GROUP: {
        PRIMARY_DISABLED: true,
        SECONDARY: "Group of the Tag "
    },
    CREATE_TAG_FORM_SCOPE: {
        PRIMARY_DISABLED: true,
        SECONDARY: "Scope of the Tag "
    },
    CREATE_TAG_FORM_PARENT_TAG: {
        PRIMARY_DISABLED: true,
        SECONDARY: "Name of the Parent of the Tag "
    },
    CREATE_TAG_FORM_DESCRIPTION: {
        PRIMARY_DISABLED: true,
        SECONDARY: "Add a small description"
    }
}

export default HelpInfo;