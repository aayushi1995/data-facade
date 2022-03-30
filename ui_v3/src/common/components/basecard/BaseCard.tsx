import {Card, CardContent, Box, Typography, Avatar, Divider, Button, Container, Stack} from '@mui/material';
import {useTheme} from "@mui/material";
import React from "react";

const NA = "NA";
type BaseCardPropsType = {
    background: string,
    boxShadow?: string,
    ActionIconButtons?: React.ReactElement,
    PrimaryActionIconButtons?: React.ReactElement,
    height?: number,
    width?: number,
    children: React.ReactElement
};
export const BaseCard = ({
                             background,
                             ActionIconButtons = <></>,
                             PrimaryActionIconButtons = <></>,
                             height,
                             children,
                             width,
                             boxShadow
                         }: BaseCardPropsType) => {
    const theme = useTheme();
    return <Card sx={{borderRadius: 1, background, height, p: 1, width, boxShadow: boxShadow || theme.shadows[23]}}>
        <CardContent sx={{position: 'relative', display: 'flex', p: 1}}>
            <Stack direction="column" gap={1}>
                {children}
                {PrimaryActionIconButtons}
            </Stack>
            <Stack direction="column" sx={{position: 'absolute', right: -3, top: -1}}>
                {ActionIconButtons}
            </Stack>
        </CardContent>
    </Card>;
};
