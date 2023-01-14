import { Card, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { ActionCardHeader, ActionCardDescription, ActionCardButtonContainer, CursorPointer, AppCardStyle } from "./StyledComponents"
import SaveIcon from "../../../images/SaveIcon.svg"
import SettingIcon from "../../../images/editAction.svg"
import RunIcon from "../../../images/runAction.svg"
import { generatePath, Link as RouterLink, Route, Switch } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis"
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE, APPLICATION_EXECUTE_ACTION } from "../../../common/components/header/data/ApplicationRoutesConfig"

interface AppCardProps {
    Displayname: string,
    Description: string,
    ID: any
}

export const AppCard = (props: AppCardProps) => {


    return (
        <Card sx={{...AppCardStyle}}>
            <Box sx={{ p: 3, height: '12vh' }}>
                <Typography sx={{ ...ActionCardHeader }}>
                    <LinesEllipsis
                        text={props.Displayname || ""}
                        maxLine='1'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                    />
                    </Typography>
                <Typography sx={{ ...ActionCardDescription }}>
                    <LinesEllipsis
                        text={props.Description || ""}
                        maxLine='2'
                        ellipsis='...'
                        trimRight
                        basedOn='letters'
                    />
                </Typography>
            </Box>
            <Box sx={{ ...ActionCardButtonContainer }}>
                <Box sx={{...CursorPointer}} to={generatePath(`${APPLICATION_EDIT_ACTION_ROUTE_ROUTE}`, { ActionDefinitionId: props.ID || "" })} component={RouterLink}><img width='25px' height='25px' src={SettingIcon} alt="" /></Box>
                <Box sx={{...CursorPointer}} onClick={() => { window.open(generatePath(`${APPLICATION_EXECUTE_ACTION}`, { ActionDefinitionId: props.ID || "" })) }}><img width='25px' height='25px' src={RunIcon} alt="" /></Box>
                <Box sx={{...CursorPointer}}><img width='25px' height='25px' src={SaveIcon} alt="" /></Box>
            </Box>
        </Card>
    )
}

export default AppCard;