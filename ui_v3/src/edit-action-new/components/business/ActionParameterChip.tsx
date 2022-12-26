import { Box, Chip } from "@mui/material";
import React from "react";
import { ActionParameterDefinition } from "../../../generated/entities/Entities";
import { BuildActionContext, SetBuildActionContext } from "../../../pages/build_action/context/BuildActionContext";

function ActionParameterChip() {
    const buildActionContext = React.useContext(BuildActionContext)
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const activeTemplateWithParams = buildActionContext.actionTemplateWithParams.find(at => at.template.Id===buildActionContext.activeTemplateId)
    const parameters = activeTemplateWithParams?.parameterWithTags?.map(apwt => apwt?.parameter)

    const openParameterConfigurator = (paramId?: string) => {
        setBuildActionContext({
            type: "SetActiveParameterId",
            payload: {
                newActiveParameterId: paramId
            }
        })
    }
    
    const getParamName = (param?: ActionParameterDefinition) => {
        if((param?.DisplayName?.length || -1) > 0) {
            return param?.DisplayName
        } else if((param?.ParameterName?.length || -1) > 0) {
            return param?.ParameterName
        } else {
            return ""
        }
    }

    const allParameterCountChip = < Chip
                                        label={`Parameters  ( ${parameters?.length || 0} )`}
                                        variant="filled"
                                        onClick={() => openParameterConfigurator(parameters?.[0]?.Id)}
                                        color='primary'
                                    />
    
    const parameterChips = parameters?.map(param => <Chip
                                                        label={getParamName(param)}
                                                        variant="outlined"
                                                        onClick={() => openParameterConfigurator(param?.Id)}
                                                    />)
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
            {allParameterCountChip}
            {parameterChips}
        </Box>
    )
}

export default ActionParameterChip;