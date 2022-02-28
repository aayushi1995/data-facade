import { Box, Card, Divider, Typography, Button, Avatar, TextField, Grid} from "@material-ui/core";
import UsageStatus from "../UsageStatus";

export interface WorkflowHeroProps {
    readonly: boolean,
    Name?: string,
    Description?: string,
    Author?: string,
    onNameChange: (newName: string) => void
    onDescriptionChange: (newDescription: string) => void
}

const WorkflowHero = (props: WorkflowHeroProps) => {
    return (
        <Card
            sx={{
                backgroundColor: 'background.paper',
            '&:hover': {
                backgroundColor: 'background.default'
            },
            background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0.4) 100%), #EBECF0",
            backgroundBlendMode: "soft-light, normal",
            border: "2px solid rgba(255, 255, 255, 0.4)",
            boxSizing: "border-box",
            boxShadow: "-10px -10px 20px #FAFBFF, 10px 10px 20px #A6ABBD",
            borderRadius: "10px"
            }}
            variant={'outlined'}
        >
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Box sx={{ display: "flex", flexDirection: "column", pl: 2, pt: 1, gap: 2}}>
                        <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start"}} className="header">
                            <Box className="name">
                                <TextField value={props.Name} 
                                    variant="standard" 
                                    fullWidth
                                    onChange={(event) => props.onNameChange(event.target.value)} 
                                    InputProps ={{
                                        sx: {
                                            fontFamily: "SF Pro Display",
                                            fontStyle: "normal",
                                            fontWeight: 600,
                                            fontSize: "36px",
                                            lineHeight: "116.7%",
                                            color: "#253858"
                                        },
                                        disableUnderline: true
                                    }}
                                />
                            </Box>
                            <Box className="meta">
                                <Typography sx={{
                                    fontFamily: "SF Pro Text",
                                    fontStyle: "normal",
                                    fontWeight: "normal",
                                    fontSize: "12px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.0961957px",
                                    color: "rgba(66, 82, 110, 0.86)"
                                }}>
                                    <span>Created By</span>
                                    <span><b>{props.Author}</b></span>
                                    <span> | </span>
                                    <span>Last Sync on</span>
                                    {/* <span>{formTimestampHumanReadable(props.lastSyncTimestamp)}</span> */}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "row", gap: 4}}>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 2}} className="info">
                                <Box className="createdBy">
                                    <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.Author}/>
                                </Box>
                                    <Divider orientation="vertical" flexItem/>
                                <Box className="status">
                                    <UsageStatus status="IN DEVELOPMENT"/>
                                </Box>
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "center", gap: 2}} className="info">
                                <Box className="createdBy">
                                    <Button variant="contained" size="small">ADD TO GROUP</Button>
                                </Box>
                                <Box className="status">
                                    <Button variant="contained" size="small">ADD TO ADD</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{display: "flex", flexDirection: "row"}} className="master">
                        <Box sx={{pl: 1, pt: 1, display: "flex", flexDirection: "column", justifyContent: "flex-start", flexGrow: 1}} className="data">
                            <Box sx={{display: "flex", flexDirection: "row"}} className="data-author">
                                <Box sx={{mr: 1, display: "flex", alignItems: "center", justifyContent: "center"}}className="data-author-avatar">
                                    <Button sx={{m:0, p:0}}>
                                        <Avatar sx={{ cursor: "pointer", height: 40, width: 40 }} alt={props.Author}>

                                        </Avatar>
                                    </Button>
                                </Box>
                                <Box sx={{display: "flex", flexDirection: "column", justifyContent: "space-around"}} className="data-author-info">
                                    <Box className="header">
                                        <Typography variant="h6" sx={{
                                            fontFamily: "SF Pro Text",
                                            fontStyle: "normal",
                                            fontWeight: "normal",
                                            fontSize: "16px",
                                            lineHeight: "175%",
                                            letterSpacing: "0.15px",
                                            color: "#253858"
                                        }}>Workflow Description</Typography>
                                    </Box>
                                    <Box className="meta">
                                        <Typography variant="body1" sx={{
                                            fontFamily: "SF Pro Text",
                                            fontStyle: "normal",
                                            fontWeight: "normal",
                                            fontSize: "14px",
                                            lineHeight: "143%",
                                            letterSpacing: "0.15px",
                                            color: "rgba(66, 82, 110, 0.86)"
                                        }}>
                                            <span>By <b>{props.Author}</b></span>
                                            <span> | </span>
                                            <span>Updated </span>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={{ml: 3, mb: 2, mt: 1}} className="description">
                                {/* <Typography variant="body1" noWrap={false} suppressContentEditableWarning={true} contentEditable={true} onChange={(event) => console.log(event)} sx={{
                                    fontFamily: "SF Pro Text",
                                    fontStyle: "normal",
                                    fontWeight: "normal",
                                    fontSize: "14px",
                                    lineHeight: "143%",
                                    letterSpacing: "0.15px",
                                    color: "rgba(66, 82, 110, 0.86)"
                                }}>
                                    {props.Description}
                                </Typography> */}
                                <TextField value={props.Description} 
                                    variant="standard" 
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    maxRows={6}
                                    onChange={(event) => props.onDescriptionChange(event.target.value)} 
                                    InputProps ={{
                                        sx: {
                                            fontFamily: "SF Pro Text",
                                            fontStyle: "normal",
                                            fontWeight: "normal",
                                            fontSize: "14px",
                                            lineHeight: "143%",
                                            letterSpacing: "0.15px",
                                            color: "rgba(66, 82, 110, 0.86)"
                                        },
                                        disableUnderline: true
                                    }}
                                />
                            </Box>
                        </Box>
                        {/* <Box sx={{display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end", flexShrink: 1, flexGrow: 0, pt: 1, pb: 1}} className="buttons">
                            {props.buttons?.map((button) => <Box>{button}</Box>)}
                        </Box> */}
                    </Box>
                </Grid>
            </Grid>
        </Card>
    )
}

export default WorkflowHero;