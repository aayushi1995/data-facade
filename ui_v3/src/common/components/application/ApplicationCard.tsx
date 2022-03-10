import { Application } from "../../../generated/entities/Entities"
import { Grid, Card, Box, Typography, IconButton } from "@material-ui/core"
import appLogo from "../../../../src/images/Segmentation_application.png"
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png"
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PeopleIcon from '@mui/icons-material/People';
import UsageStatus from "../../../common/components/UsageStatus"
import ShareIcon from '@mui/icons-material/Share';
import { useHistory, useRouteMatch } from "react-router-dom"
import { ApplicationCardViewResponse } from "../../../generated/interfaces/Interfaces"


interface ApplicationCardProps {
    application: ApplicationCardViewResponse
}
const ApplicationCard = (props: ApplicationCardProps) => {
    const {application} = props
    const name =  props.application.ApplicationName?.toUpperCase()
    const history = useHistory()
    const match = useRouteMatch()

    const formInfoString = () => {
        return `${(application.NumberOfFlows===undefined||"0")} Flows  |  ${(application.NumberOfActions||"0")} Actions | ${(application.NumberOfDashboards||"0")} Dashboards`
    }

    const formCreatedByString = () => {
        return `${application.ApplicationCreatedBy||"No Author"}`
    }

    const formCreatedOnString = () => {
        const createdOnTimestamp = application.ApplicationCreatedOn||Date.now()

        return `Created On ${new Date(createdOnTimestamp).toDateString()}`
    }

    const onApplicationSelect = () => {
        history.push(`${match.url}/${props.application.ApplicationId || "id"}`)
    }


    return (
        <Box>
            <Card onClick={onApplicationSelect} sx={{
                width: "350px", 
                borderRadius: 2, 
                p: 2, 
                boxSizing: "content-box",
                background: "#A4CAF0",
                border: "0.439891px solid #FFFFFF",
                boxShadow: "0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)",
                cursor: 'pointer'
            }}>
                <Box sx={{display: "flex", flexDirection: "row", height: "100%"}}>
                    <Box sx={{display: "flex", flexDirection: "column", width: "100%", pt: 2}}>
                        <Box>
                            <Typography sx={{
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: 600,
                                fontSize: "12px",
                                lineHeight: "266%",
                                letterSpacing: "0.5px",
                                textTransform: "uppercase"
                            }}>
                                {application.ApplicationName}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography sx={{
                                fontFamily: "SF Pro Display",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "11px",
                                lineHeight: "133.4%",
                                display: "flex",
                                alignItems: "center"
                            }}>
                                {application.ApplicationDescription}
                            </Typography>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between", flexGrow: 1, mr: 3}}>
                            <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 1}}>
                                <Box>
                                    <Typography sx={{
                                        fontFamily: "SF Pro Display",
                                        fontStyle: "normal",
                                        fontWeight: 600,
                                        fontSize: "12px",
                                        lineHeight: "133.4%",
                                        color: "#5B5B5B"
                                    }}>
                                        {formInfoString()}
                                    </Typography>
                                </Box>
                                <Box sx={{display: "flex", flexDirection: "column"}}>
                                    <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 1, alignContent: "center"}}>
                                        <Box sx={{
                                            display: "flex", 
                                            alignContent: "center", 
                                            width: "30px",
                                            height: "30px",
                                            background: "#A4CAF0",
                                            boxShadow: "inset 8px 8px 8px rgba(0, 0, 0, 0.25), inset -8px -8px 8px #B8DBFF",
                                            borderRadius: "50%",
                                            p: "3px"
                                        }}>
                                            <img src={DataFacadeLogo} alt="Data Facade"/>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <PeopleIcon/>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <Typography sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "12px",
                                                lineHeight: "14px",
                                                display: "flex",
                                                alignItems: "center",
                                                fontFeatureSettings: "'liga' off",
                                                color: "#AA9BBE"
                                            }}>{application.NumberOfUsers||"-"}</Typography>
                                        </Box>
                                        <Box sx={{display: "flex", alignContent: "center"}}>
                                            <UsageStatus status={application.Status||"NA"}/>
                                        </Box>
                                    </Box>
                                    <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: 500,
                                                fontSize: "10px",
                                                lineHeight: "157%",
                                                letterSpacing: "0.1px",
                                                color: "#253858"
                                            }}>
                                                {formCreatedByString()}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography sx={{
                                                fontFamily: "SF Pro Text",
                                                fontStyle: "normal",
                                                fontWeight: "normal",
                                                fontSize: "9px",
                                                lineHeight: "166%",
                                                letterSpacing: "0.4px",
                                                color: "rgba(66, 82, 110, 0.86)"
                                            }}>
                                                {formCreatedOnString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{display: "flex", alignItems: "flex-end"}}>
                                <Box sx={{
                                        width: "60px",
                                        height: "60px",
                                        borderRadius: "50%",
                                        background: "#A4CAF0",
                                        boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}>
                                    <IconButton sx={{
                                            height: "42px",
                                            width: "42px",
                                            background: "#A4CAF0",
                                            boxShadow: "1px 1px 1px rgba(0, 0, 0, 0.25), -1px -1px 1px #C8EEFF"
                                        }}>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection:"column", gap: 2, mt: "4%", mb: "4%"}}>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                background: "#A4CAF0",
                                boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)"
                            }}>
                                <FavoriteIcon/>
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                background: "#A4CAF0",
                                boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)"
                            }}>
                                <PlaylistAddIcon/>
                            </IconButton>
                        </Box>
                        <Box>
                            <IconButton sx={{
                                height: "42px",
                                width: "42px",
                                background: "#A4CAF0",
                                boxShadow: "-2px -4px 6px rgba(233, 242, 251, 0.5), 2px 4px 10px rgba(80, 153, 226, 0.5)"
                            }}>
                                <ShareIcon/>
                            </IconButton>
                        </Box>
                    </Box>
                </Box>
            </Card>
            
        </Box>
    )
}

export default ApplicationCard