import AddIcon from "@mui/icons-material/Add";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { Box, Button, IconButton, Typography } from "@mui/material";
import useActionParameterOperationsBottom from "../../hooks/useActionParameterOperationsBottom";
import { ActiveParameterConfiguratorFieldNameBox } from "../presentation/styled_native/ActiveParameterConfiguratorBox";

export type ActionParameterOperationsBottomProps = {
    addParam: () => void
}

function ActionParameterOperationsBottom(props: ActionParameterOperationsBottomProps) {
    const { stepText, nextParam, prevParam } = useActionParameterOperationsBottom({})
    return (
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 2, alignItems: "center" }}>
                <ActiveParameterConfiguratorFieldNameBox>
                    <Box>
                        <Typography>
                            {stepText}
                        </Typography>
                    </Box>
                </ActiveParameterConfiguratorFieldNameBox>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <Box>
                        <IconButton onClick={() => prevParam?.()} disabled={!prevParam}>
                            <ArrowLeftIcon/>
                        </IconButton>
                    </Box>
                    <Box>
                        <IconButton onClick={() => nextParam?.()} disabled={!nextParam}>
                            <ArrowRightIcon/>
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ActionParameterOperationsBottom;