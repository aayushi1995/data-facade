import { Box } from "@material-ui/core";
import { Story } from "@storybook/react";
import TemplateLanguage from "../../../enums/TemplateLanguage";
import CodeEditor, {CodeEditorProps} from "./CodeEditor";

export default {
    title: "Workflow/Create/CodeEditor",
    component: CodeEditor
}


const Template: Story<CodeEditorProps> = (args) => <Box sx={{}}><CodeEditor {...args} /></Box>


export const DefaultView = Template.bind({});
DefaultView.args = {
    code: "def function(self, param1, param2)",
    language: TemplateLanguage.PYTHON,
    readOnly: false,
    onCodeChange: (param) => console.log(param)
}
