import {Link as RouterLink} from 'react-router-dom';
import {BaseCard} from "../../../../common/components/basecard/BaseCard";
import {Button, Divider, Stack, Typography, Box, alpha} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";
import {ButtonIconWithToolTip} from "../../../../common/components/ButtonIconWithToolTip";
import {DATA_RAW_ROUTE} from "../../../../common/components/header/data/DataRoutesConfig";
import {ProviderInstance} from "../../../../generated/entities/Entities";
import {useDeleteSelectedConnection} from "../../../configurations/hooks/useDeleteSelectedConnection";
import {useTheme} from "@mui/styles";
import {lightGreen} from "@mui/material/colors";
import useSyncProviderInstance from '../../../configurations/components/hooks/useSyncProviderInstance';
import React from 'react';
import {ReactElement} from "react";

const NA = 'NA';

const MainContent = ({
                         Name = NA,
                         ConnectionID = NA,
                         CreatedBy = NA,
                         LastSyncOn = NA,
                         Icon
                     }: ConnectionCardType) => <Stack direction='column' alignItems={"center"}
                                                      justifyContent={"space-between"} flex={1} py={1}>
    <Box p={1}>
        {Icon}
    </Box>
    <Divider orientation="horizontal" sx={{width: "40px"}}/>
    {/* <Divider variant={"middle"} /> */}
    <Typography fontSize={12} fontWeight='bold' variant="heroHeader">
        {Name}
    </Typography>
    <Typography fontSize={12} fontWeight='bold' mt={1} variant="heroHeader">
        Connection ID {ConnectionID}
    </Typography>
    <Typography fontSize={9}>
        Created By {CreatedBy}
    </Typography>
    <Typography fontSize={9}>
        Last Sync on {LastSyncOn}
    </Typography>
</Stack>;

export type ConnectionCardType = Partial<ProviderInstance> & {
    Id?: string,
    Name?: string,
    ConnectionID: string,
    CreatedBy?: string,
    LastSyncOn?: string,
    Icon?: ReactElement,
    Actions?: number,
    Tables?: number,
    onClick: (ConnectionID: string) => void,
    isSelected?: boolean
};
const buttonStyle = {fontSize: 7}

function ConnectionsPrimaryActionButtons(props: { Actions?: number, Tables?: number }) {
    return <Stack direction={"column"} gap={1} alignItems="center">
        <Stack direction={"row"} gap={1}>
            <Button variant="outlined" sx={buttonStyle}>
                {props.Actions} Actions Executed
            </Button>
            <Button variant="outlined" sx={buttonStyle}>
                {props.Tables} Tables Connected
            </Button>
        </Stack>
        <Stack direction={"row"} gap={1}>
            <Button variant="outlined" sx={buttonStyle}>
                View Details
            </Button>
            <Button variant={"contained"} sx={buttonStyle} component={RouterLink} to={DATA_RAW_ROUTE}>
                View Tables
            </Button>
        </Stack>
    </Stack>;
}


export const ConnectionCard = (props: ConnectionCardType) => {
    const [syncing, setSyncing] = React.useState(false)
    const syncyProviderMutation = useSyncProviderInstance({ mutationOptions: {
        onMutate: () => setSyncing(true),
        onSettled: () => setSyncing(false)
    } })
    const deleteSelectedConnection = useDeleteSelectedConnection();
    const syncSelectedConnection = (connectionId?: string) => {
        console.log(connectionId)
        syncyProviderMutation.mutate({
            providerInstanceId: connectionId,
            syncDepthConfig: {
                providerSyncAction: true,
                SyncDepth: "TablesAndColumns"
            },
            recurrenceConfig: {}
        })
    }
    const theme = useTheme();
    return <Box onClick={() => props.onClick(props.ConnectionID)} sx={{cursor: "pointer"}}>
        <BaseCard
            height={250}
            width={236}
            background={ syncing ? "F3F3F3" : alpha(lightGreen.A400, 0.17) }
            ActionIconButtons={<Stack direction='column' gap={1}>
                <ButtonIconWithToolTip Icon={SyncIcon} onClick={()=>syncSelectedConnection(props.ConnectionID)} title="sync"/>
                <ButtonIconWithToolTip Icon={DeleteIcon} onClick={()=>deleteSelectedConnection(props.ConnectionID)} title="delete"/>
            </Stack>}
            PrimaryActionIconButtons={<ConnectionsPrimaryActionButtons
                Actions={props.Actions}
                Tables={props.Tables}/>}
        >
            <MainContent {...props}/>
        </BaseCard>
    </Box>
}