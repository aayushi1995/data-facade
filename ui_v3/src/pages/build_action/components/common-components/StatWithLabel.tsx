import { Box, Typography, TypographyProps } from "@mui/material";

export interface StatWithLabelProps {
    valueProps?: TypographyProps,
    labelProps?: TypographyProps,
    value: number | string| boolean,
    label: string,
}

const StatWithLabel = (props: StatWithLabelProps) => {
    return(
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box sx={{ display: "flex", justifyContent: "center"}}>
                <Typography variant="actionDefinitionSummaryStatValue" {...props.valueProps}>
                    {props.value}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center"}}>
                <Typography variant="actionDefinitionSummaryStatLabel" {...props.labelProps}>
                    {props.label}
                </Typography>
            </Box>
        </Box>
    )
}

export default StatWithLabel;