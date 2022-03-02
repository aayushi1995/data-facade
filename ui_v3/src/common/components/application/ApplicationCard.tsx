import { Application } from "../../../generated/entities/Entities"
import { Grid, Card, Box, Typography, IconButton } from "@material-ui/core"
import appLogo from "../../../../src/images/Segmentation_application.png"
import DataFacadeLogo from "../../../../src/images/DataFacadeLogo.png"
import UsageStatus from "../../../common/components/UsageStatus"
import ShareIcon from '@mui/icons-material/Share';
import { useHistory, useRouteMatch } from "react-router-dom"


interface ApplicationCardProps {
    application: Application
}
const ApplicationCard = (props: ApplicationCardProps) => {
    const name =  props.application.Name?.toUpperCase()
    const history = useHistory()
    const match = useRouteMatch()

    const handleApplicationSelected = () => {
        history.push(`${match.url}/${props.application.Id || "id"}`)
    }

    return (
        <Box>
            <Card onClick={handleApplicationSelected}
            sx={{boxShadow: '6.41304px 6.41304px 12.8261px 0.641304px #A6ABBD', 
            filter: 'drop-shadow(-6.41304px -6.41304px 12.8261px #E3E6F0)', minHeight: '150px', 
            minWidth: '300px', maxWidth: '400px', display: 'flex', borderRadius: '10px', overflowX: 'auto', ":hover": {cursor: 'pointer'}}}>
                <Box sx={{display: 'flex', gap: 2, minWidth: '100%', minHeight: '100%'}}>
                    <Box sx={{flex: 1, p: 1, alignItems: 'center', justifyContent: 'center'}}>
                        <img src={appLogo} alt="LOGO"/>
                    </Box>
                    <Box sx={{flex: 1, gap: 1, minHeight: '100%'}}>
                        <Box sx={{display: 'flex', flexDirection: 'column', p: 1, minHeight: '100%'}}>
                            <Box sx={{flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end'}}>
                                <img src={DataFacadeLogo} alt="Data Facade"/>
                            </Box>
                            <Box sx={{flex: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: "column"}}>
                                <Box sx={{flex: 1}}>
                                    <Typography sx={{font: 'SF Pro Text', fontStyle: 'normal', fontWeight: 600, fontSize: '18px', lineHeight: '162%', color: 'rgba(66, 82, 110, 0.86)'}}>
                                        {name || "Application Name"}
                                    </Typography>
                                </Box>
                                <Box sx={{flex: 1}}>
                                    <Typography sx={{fontFamily: 'SF Pro Display', fontStyle: 'normal', fontSize: '12px', lineHeight: '133.4%', color: "#253858"}}>
                                        1000 METRICS
                                    </Typography>
                                </Box>
                                <Box sx={{flex: 1}}>
                                    <UsageStatus status="IN USE"></UsageStatus>
                                </Box>
                            </Box>
                            <Box sx={{flex: 1, display: 'flex', flexDirection: "column"}}>
                                <Box sx={{flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end'}}>
                                    <IconButton>
                                        <ShareIcon/>
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>
            
        </Box>
    )
}

export default ApplicationCard