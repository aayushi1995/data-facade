import { Box } from "@mui/material";
import React from "react";
import { BuildActionContext } from "../../context/BuildActionContext";
import StatWithLabel from "./StatWithLabel";

const ActionHighLevelDetails = () => {
    const buildActionContext = React.useContext(BuildActionContext)

    const templateCount = buildActionContext?.actionTemplateWithParams?.length || 0
    const parameterCount = buildActionContext?.actionTemplateWithParams?.find(at => at?.template?.Id===buildActionContext?.activeTemplateId)?.parameterWithTags?.length || 0

    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2}}>
            <Box>
                <StatWithLabel
                    label="Templates"
                    value={templateCount}
                />
            </Box>
            <Box>
                <StatWithLabel
                    label="Parameters"
                    value={parameterCount}
                />
            </Box>
        </Box>
    )
}

export default ActionHighLevelDetails;