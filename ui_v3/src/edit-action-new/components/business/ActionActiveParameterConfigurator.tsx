import { Box, TextField } from "@mui/material";
import { ConfigureParentParameter } from "../../../pages/build_action/components/common-components/EditActionParameter";
import DefaultValueInput from "../../../pages/build_action/components/common-components/parameter_input/DefaultValueInput";
import { TagEditorView } from "../../../pages/build_action/components/common-components/ViewActionParameters";
import useActionActiveParameterConfigurator from "../../hooks/useActionActiveParameterConfigurator";
import ActionParameterInputTypeSelector from "../presentation/custom/ActionParameterInputTypeSelector";
import { ActiveParameterConfiguratorLabelTypography } from "../presentation/styled_native/ActiveParameterConfiguratorTypography";
import ActionParameterOptionSet from "./ActionParameterOptionSet";


function ActionActiveParameterConfigurator() {
    const {
        templateLanguage,
        activeParamDef,
        allParamDefs,
        activeParamAdditionalConfig,
        activeParamTagNames,
        availableActiveParamTagNames,
        deleteActiveParamTag,
        addActiveParamTag,
        createAndAddActiveParamTag,
        handleParameterNameChange,
        handleParameterDisplayNameChange,
        handleParameterDescriptionChange,
        handleParameterInputTypeChange,
        handleParameterTagsChange,
        handleParameterChange,
        handleDefaultValueChange
    } = useActionActiveParameterConfigurator({})
    

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parameter Name: </ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <TextField value={activeParamDef?.ParameterName || ""} onChange={(event) => handleParameterNameChange(event.target.value)}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parameter Display Name:</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <TextField value={activeParamDef?.DisplayName || ""} onChange={(event) => handleParameterDisplayNameChange(event.target.value)}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Input Type:</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <ActionParameterInputTypeSelector
                        parameter={activeParamDef}
                        templateLanguage={templateLanguage}
                        handleParameterInputTypeChange={handleParameterInputTypeChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Default Value:</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <DefaultValueInput
                        actionParameterDefinition={activeParamDef}
                        actionParameterDefinitionAdditionalConfig={activeParamAdditionalConfig}
                        onDefaultValueChange={handleDefaultValueChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Option Set:</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <ActionParameterOptionSet 
                        parameter={activeParamDef}
                        handleParameterChange={handleParameterChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parent Parameter:</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <ConfigureParentParameter
                        allParamDefs={allParamDefs}
                        currentParamDef={activeParamDef}
                        onParameterEdit={handleParameterChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parmeter Description:</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <TextField value={activeParamDef?.Description || ""} onChange={(event) => handleParameterDescriptionChange(event.target.value)}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Tags</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box>
                    <TagEditorView
                    availableTagNames={availableActiveParamTagNames}
                    selectedTagNames={activeParamTagNames}
                    deleteTag={deleteActiveParamTag}
                    createAndAddTag={createAndAddActiveParamTag}
                    addTag={addActiveParamTag}/>
                </Box>
            </Box>
        </Box>
    )
}

export default ActionActiveParameterConfigurator;