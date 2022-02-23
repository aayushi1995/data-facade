import { Box } from "@material-ui/core";
import { Story } from "@storybook/react";
import ActionParameterDefinitionDatatype from "../../../../../../enums/ActionParameterDefinitionDatatype";
import ActionParameterDefinitionTag from "../../../../../../enums/ActionParameterDefinitionTag";
import ActionParameterDefinitionType from "../../../../../../enums/ActionParameterDefinitionType";
import TemplateLanguage from "../../../../../../enums/TemplateLanguage";
import EditActionParameterDefinition, {EditActionParameterDefinitionProps} from "./EditActionParameterDefinition";

export default {
    title: "Workflow/Create/EditActionParameterDefinition",
    component: EditActionParameterDefinition
}


const Template: Story<EditActionParameterDefinitionProps> = (args) => <Box sx={{}}><EditActionParameterDefinition {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    template: {
        Id: "TemplateId",  
        DefinitionId: "DefinitionId", 
        Text: "Text", 
        Language: TemplateLanguage.PYTHON, 
        SupportedRuntimeGroup: "SupportedRuntimeGroup"
    }, 
    parameterDefinition: {
        Id: "Parameterid", 
        ActionDefinitionId: "DefinitionId", 
        TemplateId: "TemplateId", 
        ParameterName: "Param1", 
        Datatype: ActionParameterDefinitionDatatype.PANDAS_DATAFRAME, 
        Type: ActionParameterDefinitionType.COMPILE_TIME, 
        Tag: ActionParameterDefinitionTag.DATA, 
        DefaultParameterValue: "DefaultParameterValue"
    }
}
