import { Box, TextField } from "@mui/material";
import { ConfigureParentParameter } from "../../../build_action_old/components/common-components/EditActionParameter";
import DefaultValueInput from "../../../build_action_old/components/common-components/parameter_input/DefaultValueInput";
import { OptionSetSelector, TagEditorView } from "../../../build_action_old/components/common-components/ViewActionParameters";
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
        handleDefaultValueChange,
        enableSettingsIcon
    } = useActionActiveParameterConfigurator({})
    
    const widthofip = '18vw'

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parameter Name : </ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width: widthofip}}>
                    <TextField size="small" fullWidth value={activeParamDef?.ParameterName || ""} onChange={(event) => handleParameterNameChange(event.target.value)}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parameter Display Name :</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width:  widthofip}}>
                    <TextField size="small" fullWidth value={activeParamDef?.DisplayName || ""} onChange={(event) => handleParameterDisplayNameChange(event.target.value)}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Input Type :</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width: widthofip}}>
                    <ActionParameterInputTypeSelector
                        parameter={activeParamDef}
                        templateLanguage={templateLanguage}
                        handleParameterInputTypeChange={handleParameterInputTypeChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Default Value :</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width: widthofip}}>
                    <DefaultValueInput
                        actionParameterDefinition={activeParamDef}
                        actionParameterDefinitionAdditionalConfig={activeParamAdditionalConfig}
                        onDefaultValueChange={handleDefaultValueChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Option Set :</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width:widthofip}}>
                    <ActionParameterOptionSet 
                        parameter={activeParamDef}
                        handleParameterChange={handleParameterChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parent Parameter :</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width:widthofip}}>
                    <ConfigureParentParameter
                        allParamDefs={allParamDefs}
                        currentParamDef={activeParamDef}
                        onParameterEdit={handleParameterChange}
                    />
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Parmeter Description :</ActiveParameterConfiguratorLabelTypography>
                </Box>
                <Box sx={{width:widthofip}}>
                    <TextField size="small" fullWidth value={activeParamDef?.Description || ""} onChange={(event) => handleParameterDescriptionChange(event.target.value)}/>
                </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box>
                    <ActiveParameterConfiguratorLabelTypography>Tags :</ActiveParameterConfiguratorLabelTypography>
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
            <Box sx={{display: 'flex', flexDirection: "row"}}>
                <ActiveParameterConfiguratorLabelTypography>Settings: </ActiveParameterConfiguratorLabelTypography>
                <OptionSetSelector parameter={activeParamDef || {}} onParameterEdit={handleParameterChange} 
                    optionSetEnabled={enableSettingsIcon()}/>
            </Box>
        </Box>
    )
}

export default ActionActiveParameterConfigurator;