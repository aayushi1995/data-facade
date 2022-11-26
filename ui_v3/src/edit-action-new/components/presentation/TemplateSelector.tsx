import { Box, Typography } from "@mui/material";
import { TemplateSelectorParentBox } from "./styled_native/ActionMainBox";

export type TemplateLanguageBoxProps = {
    name?: string,
    description?: string,
    onClick?: () => void
}

function TemplateSelector(props: TemplateLanguageBoxProps) {
    const { name, description, onClick } = props
    return (
        <TemplateSelectorParentBox sx={{ display: "flex", flexDirection: "column", gap: 2 , alignItems: "center"}} onClick={props?.onClick}>
            <Box>
                <Typography>{name}</Typography>
            </Box>
            <Box>
                <Typography>{description}</Typography>
            </Box>
        </TemplateSelectorParentBox>
    )
}

export default TemplateSelector;