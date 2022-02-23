import { Box } from "@material-ui/core";
import { Story } from "@storybook/react";
import ActionParameterDefinitionList, {ActionParameterDefinitionListProps} from "./ActionParameterDefinitionList";

export default {
    title: "Workflow/Create/ActionParameterDefinitionList",
    component: ActionParameterDefinitionList
}


const Template: Story<ActionParameterDefinitionListProps> = (args) => <Box sx={{}}><ActionParameterDefinitionList {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    parameters: [
        {
            Id: "Id1",
            ActionDefinitionId: "ActionDefinitionId",
            TemplateId: "TemplateId",
            ParameterName: "ParameterName 1",
            Datatype: "Datatype",
            Type: "Type",
            Tag: "Tag",
            DefaultParameterValue: "DefaultParameterValue"
        },
        {
            Id: "Id2",
            ActionDefinitionId: "ActionDefinitionId",
            TemplateId: "TemplateId",
            ParameterName: "ParameterName 2",
            Datatype: "Datatype",
            Type: "Type",
            Tag: "Tag",
            DefaultParameterValue: "DefaultParameterValue"
        },
        {
            Id: "Id3",
            ActionDefinitionId: "ActionDefinitionId",
            TemplateId: "TemplateId",
            ParameterName: "ParameterName 3",
            Datatype: "Datatype",
            Type: "Type",
            Tag: "Tag",
            DefaultParameterValue: "DefaultParameterValue"
        }
    ],
    onParameterSelectForEdit: (param) => console.log(param),
    deleteParametersWithIds: (param) => console.log(param)
}
