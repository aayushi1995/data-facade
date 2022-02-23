import { Box } from "@material-ui/core";
import { Story } from "@storybook/react";
import ActionParameterDefinitionDatatype from "../../../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../../../enums/ActionParameterDefinitionTag";
import ActionParameterDefinitionType from "../../../../../enums/ActionParameterDefinitionType";
import TemplateLanguage from "../../../../../enums/TemplateLanguage";
import ViewSelectedAction, {ViewSelectedActionProps} from "./ViewSelectedAction";

export default {
    title: "Workflow/Create/ViewSelectedAction",
    component: ViewSelectedAction
}


const Template: Story<ViewSelectedActionProps> = (args) => <Box sx={{}}><ViewSelectedAction {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    actionParameterDefinitions: [
        {
            Id: "Id1",
            ActionDefinitionId: "ActionDefinitionId",
            TemplateId: "TemplateId",
            ParameterName: "df",
            Datatype: ActionParameterDefinitionDatatype.PANDAS_DATAFRAME,
            Type: ActionParameterDefinitionType.COMPILE_TIME,
            Tag: ActionParameterDefinitionTag.DATA,
            DefaultParameterValue: "DefaultParameterValue"
        },
        {
            Id: "Id2",
            ActionDefinitionId: "ActionDefinitionId",
            TemplateId: "TemplateId",
            ParameterName: "col",
            Datatype: ActionParameterDefinitionDatatype.STRING,
            Type: ActionParameterDefinitionType.COMPILE_TIME,
            Tag: ActionParameterDefinitionTag.COLUMN_NAME,
            DefaultParameterValue: "DefaultParameterValue"
        },
        {
            Id: "Id3",
            ActionDefinitionId: "ActionDefinitionId",
            TemplateId: "TemplateId",
            ParameterName: "limit",
            Datatype: ActionParameterDefinitionDatatype.INT,
            Type: ActionParameterDefinitionType.COMPILE_TIME,
            Tag: ActionParameterDefinitionTag.OTHER,
            DefaultParameterValue: "DefaultParameterValue"
        }
    ],
    actionTemplate: {
        Language: TemplateLanguage.PYTHON, 
        Text: `
def execute(self, df, col, limit):
    # We write code
    a=0
    b=1
    c=a+b
    for i in range(100):
        a=b
        b=c
        c=a+b
    print(a,b,c)
    while True:
        # whatever
        print("OK")
    return df[col]
`
    }
}
