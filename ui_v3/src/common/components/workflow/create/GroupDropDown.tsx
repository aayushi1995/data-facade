
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary, Box, Grid, SvgIcon, Typography, useTheme } from '@mui/material';
import React from 'react';
import { ReactComponent as DefaultIcon } from "./Icon.svg";
import SelectActionCard, { SelectActionCardProps } from './SelectActionCard';

export interface GroupDropDownProps {
    groupName: string,
    actionCount: number,
    actions: SelectActionCardProps[]
}


const GroupDropDown = (props: GroupDropDownProps) => {
    const theme = useTheme();
    return(
            <Accordion
                sx={{
                    backgroundColor: theme.palette.background.paper,
                '&:hover': {
                    backgroundColor: theme.palette.background.default
                },
                borderRadius: 6,
                borderLeft: "7px solid rgba(219, 140, 40, 1)",
                }}
                variant={'outlined'}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, alignItems: "center"}}>
                        <Box>
                            <SvgIcon sx={{backgroundColor: theme.palette.primary.main, borderRadius: "50%"}}>
                                <DefaultIcon/>
                            </SvgIcon>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Box>
                                <Typography variant="body1" sx={{
                                    fontFamily: "SF Pro Text",
                                    fontStyle: "normal",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    lineHeight: "157%",
                                    letterSpacing: "0.1px",
                                    color: "#253858"
                                }}>
                                    {props.groupName}
                                </Typography>
                            </Box>
                            <Box>
                            <Typography variant="body1" sx={{
                                position: "static",
                                width: "116px",
                                height: "17px",
                                left: "0px",
                                top: "28px",
                                fontFamily: "SF Pro Text",
                                fontStyle: "normal",
                                fontWeight: "normal",
                                fontSize: "12px",
                                lineHeight: "143%",
                                letterSpacing: "0.15px",
                                color: "rgba(66, 82, 110, 0.86)"
                            }}>
                                {props.actionCount} actions
                            </Typography>
                            </Box>
                        </Box>
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={1}>
                        {props.actions.map(action => <Grid item xs={12} md={4}><SelectActionCard {...action}/></Grid>)}
                    </Grid>
                </AccordionDetails>
            </Accordion>
    )
}

export default GroupDropDown;