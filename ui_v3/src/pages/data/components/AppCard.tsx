import { Card, Typography } from "@mui/material"
import { Box } from "@mui/system"
import LinesEllipsis from "react-lines-ellipsis"
import { generatePath, Link as RouterLink, useHistory } from "react-router-dom"
import { APPLICATION_EDIT_ACTION_ROUTE_ROUTE, APPLICATION_EXECUTE_ACTION } from "../../../common/components/header/data/ApplicationRoutesConfig"
import SettingIcon from "../../../images/editAction.svg"
import RunIcon from "../../../images/runAction.svg"
import SaveIcon from "../../../images/SaveIcon.svg"
import { ActionCardButtonContainer, ActionCardDescription, ActionCardHeader, AppCardStyle, CursorPointer } from "./StyledComponents"

interface AppCardProps {
    Displayname: string,
    Description: string,
    ID: any,
    tableId?: string
}

export const AppCard = (props: AppCardProps) => {
    const history = useHistory()
    const getExecuteUrl = () => {
        const url  = generatePath(`${APPLICATION_EXECUTE_ACTION}`, { ActionDefinitionId: props.ID || "" })
        const tabOpenQueryParams = `source=browser&name=${props?.Displayname}`
        return props?.tableId ? `${url}?tableId=${props?.tableId}&${tabOpenQueryParams}` : `${url}?${tabOpenQueryParams}`
    }

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
                <Box sx={{...CursorPointer}} onClick={() => { 
                    history.push(getExecuteUrl()) 
                }}>
                    <img width='25px' height='25px' src={RunIcon} alt="" />
                </Box>
                <Box sx={{...CursorPointer}}><img width='25px' height='25px' src={SaveIcon} alt="" /></Box>
            </Box>
        </Card>
    )
}

export default AppCard;