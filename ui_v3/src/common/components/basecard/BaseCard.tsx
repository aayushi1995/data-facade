import {Card, CardContent, Box, Typography, Avatar, Divider, Button, Container, Stack} from '@material-ui/core';
import {alpha, useTheme} from '@material-ui/core/styles';
import React from "react";

const NA = "NA";
type BaseCardPropsType = {
    background: string,
    ActionIconButtons?: React.ReactElement,
    PrimaryActionIconButtons?: React.ReactElement,
    height?: number,
    width?: number,
    children: React.ReactElement
};
export const BaseCard = ({
                             background = '#A4CAF0',
                             ActionIconButtons = <></>,
                             PrimaryActionIconButtons = <></>,
                             height,
                             children,
                             width
                         }: BaseCardPropsType) => {
    const theme = useTheme();
    return <Card sx={{borderRadius: 1, background, height, p: 1, width, boxShadow: theme.shadows[23]}}>
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
