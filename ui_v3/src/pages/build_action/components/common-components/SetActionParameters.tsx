import { Grid } from "@mui/material";
import React, { useContext } from "react";
import { ActionParameterDefinition, Tag } from "../../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../context/BuildActionContext";
import EditActionParameter, { EditActionParameterProps } from "./EditActionParameter";
import ViewActionParameters, { ViewActionParametersProps } from "./ViewActionParameters";

const SetActionParameters = () => {
    const buildActionContext = useContext(BuildActionContext)
    const setBuildActionContext = useContext(SetBuildActionContext)
    const [activeParameter, setActiveParameter] = React.useState<{parameter: ActionParameterDefinition, tags: Tag[]}|undefined>()
    
    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)

    const addParam = () => setBuildActionContext({
        type: "AddActionParameterDefinition",
        payload: {
            templateId: buildActionContext.activeTemplateId
        }
    })

    const viewActionParameterProps: ViewActionParametersProps = {
        template: activeTemplateWithParams?.template,
        paramsWithTag: activeTemplateWithParams?.parameterWithTags,
        onSelectParameterForEdit: (selectedParam: {parameter: ActionParameterDefinition, tags: Tag[]}) => setActiveParameter(selectedParam),
        onDeleteParameters: (deletedParams: ActionParameterDefinition[]) => setBuildActionContext({
            type: "RemoveActionParameterDefinitions",
            payload: {
                actionParameterDefinitions: deletedParams
            }
        }),
        onParameterReset: () => setBuildActionContext({
            type: "ResetActionParameterDefinitionsAction",
            payload: {
                templateId: activeTemplateWithParams?.template?.Id
            }
        }),
        onCreateNewParameter: addParam
    }

    const editActionParameterProps: EditActionParameterProps = {
        template: activeTemplateWithParams?.template!,
        paramWithTag: activeTemplateWithParams?.parameterWithTags.find(param => param.parameter.Id===activeParameter?.parameter?.Id),
        additionalConfig: activeTemplateWithParams?.parameterAdditionalConfig?.find?.(addConf => addConf.parameterDefinitionId === activeParameter?.parameter?.Id),
        allParamsWithTags: activeTemplateWithParams?.parameterWithTags,
        onParameterEdit: (newParameter: ActionParameterDefinition) => setBuildActionContext({
            type: "SetParameterDetails",
            payload: {
                newParamConfig: newParameter
            }
        }),
        onTagsChange: (newTags: Tag[]) => setBuildActionContext({
            type: "SetActionParameterDefintionTags",
            payload: {
                parameterId: activeParameter?.parameter.Id!,
                newTags: newTags
            }
        }),
        onParameterTypeEdit: (newParameter: ActionParameterDefinition) => setBuildActionContext({
            type: "SetParameterType",
            payload: {
                newParamConfig: newParameter
            }
        }),
    }
    
    return (
        <Grid container>
            <Grid item xs={12}>
                <EditActionParameter {...editActionParameterProps}/>
            </Grid>
            {!!activeParameter ? <Grid item xs={12} sx={{my: 2}}/> : <></>}
            <Grid item xs={12}>
                <ViewActionParameters {...viewActionParameterProps}/>
            </Grid>
        </Grid>
    )
}

export default SetActionParameters;
