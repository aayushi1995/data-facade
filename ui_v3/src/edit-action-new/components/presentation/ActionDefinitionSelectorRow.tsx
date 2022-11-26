import { Box, Button, Typography } from "@mui/material";
import { ActionDefinitionSelectorResponse } from "../../../generated/interfaces/Interfaces";

export type ActionDefinitionSelectorRowProps = {
    data: ActionDefinitionSelectorResponse,
    onSelect: () => void
}

function ActionDefinitionSelectorRow(props: ActionDefinitionSelectorRowProps) {
    return (
        <Box>
            <Box>
                <Typography>{props?.data?.ActionDisplayName}</Typography>
            </Box>
            <Box>
                <Button onClick={props?.onSelect}>Select</Button>
            </Box>
        </Box>
    )
}

export default ActionDefinitionSelectorRow;