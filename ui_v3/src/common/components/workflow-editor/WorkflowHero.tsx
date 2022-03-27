import { Box, Card, Divider, Typography, Button, Avatar, TextField, Grid, IconButton } from "@mui/material";
import { lightShadows } from "../../../css/theme/shadows";
import UsageStatus from "../UsageStatus";
import LikeIcon from "../../../../src/images/Like.png"
import ShareIcon from "../../../../src/images/Save.png"
import EditIcon from "../../../../src/images/Edit.png"

export interface WorkflowHeroProps {
    readonly: boolean,
    Name?: string,
    Description?: string,
    Author?: string,
    onNameChange?: (newName: string) => void
    onDescriptionChange?: (newDescription: string) => void
}

const WorkflowHero = (props: WorkflowHeroProps) => {
    return (
        <Card
            sx={{
            backgroundColor: '#F5F9FF',
            boxSizing: "border-box",
            boxShadow: '0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)',
            borderRadius: "26.3934px",
            border: '0.439891px solid #FFFFFF',
            minWidth: '100%'
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
                                    onChange={(event) => props.onNameChange?.(event.target.value)} 
                                    placeholder="Enter Workflow Name Here"
                                    InputProps ={{
                                        sx: {
                                            fontFamily: "SF Pro Display",
                                            fontStyle: "normal",
                                            fontWeight: 600,
                                            fontSize: "36px",
                                            lineHeight: "116.7%",
                                            color: "#253858",
                                        },
                                        disableUnderline: true
                                    }}
                                />
                            </Box>
                            <Box className="meta">
                                <Typography variant="heroMeta">
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
                                    <Button variant="contained" size="small" disabled>ADD TO GROUP</Button>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{display: 'flex', flexDirection: 'row'}}>
                        <Box sx={{display: "flex", flexDirection: "row", flex: 8}} className="master">
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
                                            <Typography variant="heroMeta" sx={{
                                                fontSize: '16px',
                                                color: "#253858"
                                            }}>Description</Typography>
                                        </Box>
                                        <Box className="meta">
                                            <Typography variant="heroMeta">
                                                <span>By <b>{props.Author}</b></span>
                                                <span> | </span>
                                                <span>Updated </span>
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <Box sx={{ml: 3, mb: 2, mt: 1}} className="description">
                                    <TextField value={props.Description} 
                                        variant="standard" 
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        maxRows={6}
                                        placeholder="Enter Description Here"
                                        onChange={(event) => props.onDescriptionChange?.(event.target.value)} 
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
                        <Box sx={{display: 'flex', flex: 1}}>
                            <Grid container direction="column" justifyContent="center" alignContent="center" sx={{flex: 1}}>
                                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconButton>
                                        <img src={LikeIcon} alt="like"/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconButton>
                                        <img src={ShareIcon} alt=""/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                    <IconButton>
                                        <img src={EditIcon} alt=""/>
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    )
}

export default WorkflowHero;