import {Link as RouterLink} from 'react-router-dom';
import {BaseCard} from "../../../../common/components/basecard/BaseCard";
import {Button, Divider, Stack, Typography, Box} from "@mui/material";
import {Image} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import SyncIcon from "@material-ui/icons/Sync";
import {ButtonIconWithToolTip} from "../../../../common/components/ButtonIconWithToolTip";
import {DATA_RAW_ROUTE} from "../../../../common/components/header/data/DataRoutesConfig";

const NA = 'NA';

const MainContent = ({
                         Name = NA,
                         ConnectionID = NA,
                         CreatedBy = NA,
                         LastSyncOn = NA,
                         imgSrc = NA
                     }) => <Stack direction='column' alignItems={"center"}>
    <Image/>
    <Box sx={{margin: "4px 4px 4px 4px", display: "flex", alignItems: "center"}}>
        <Divider orientation="horizontal" sx={{width: "40px", height: '100%'}}/>
    </Box>
    {/* <Divider variant={"middle"} /> */}
    <Typography  fontSize={12} fontWeight='bold' variant="heroHeader" sx={{fontSize: '14px'}}>
        {Name}
    </Typography>
    <Typography fontSize={12}  fontWeight='bold' mt={1} variant="heroHeader" sx={{fontSize: '12px'}}>
        Connection ID {ConnectionID}
    </Typography>
    <Typography  fontSize={9}>
        Created By {CreatedBy}
    </Typography>
    <Typography fontSize={9}>
        Last Sync on {LastSyncOn}
    </Typography>
</Stack>;

export type ConnectionCardType = {
    Name: string,
    ConnectionID: string,
    CreatedBy: string,
    LastSyncOn: string,
    imgSrc: string,
    onDelete: () => void,
    Actions: string,
    Tables: string,
    onSync: () => void
};
const buttonStyle = {fontSize: 8}

function ConnectionsPrimaryActionButtons(props: { Actions: string, Tables: string }) {
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

export const ConnectionCard = (props: ConnectionCardType) => <BaseCard
    height = {250}
    width = {236}
    background={"rgba(20, 255, 0, 0.17)"}
    ActionIconButtons={<Stack direction='column' gap={1}>
        <ButtonIconWithToolTip Icon={SyncIcon} onClick={props.onSync} title="sync"/>
        <ButtonIconWithToolTip Icon={DeleteIcon} onClick={props.onDelete} title="delete"/>
    </Stack>}
    PrimaryActionIconButtons={<ConnectionsPrimaryActionButtons
        Actions={props.Actions ?? NA}
        Tables={props.Tables  ?? NA}/>}
>
    <MainContent {...props}/>
</BaseCard>