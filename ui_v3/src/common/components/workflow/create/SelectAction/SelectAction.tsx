
import React from 'react'
import { Box, Card, Chip, IconButton, InputAdornment, SvgIcon, TextField, Typography, useTheme} from '@material-ui/core';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { ReactComponent as DefaultIcon } from "../Icon.svg";
import GroupDropDown from '../GroupDropDown';
import SelectFromAllActions from '../SelectFromAllActions';

export interface ActionDefinitionToAdd {
    Id: string,
    DisplayName: string
}

export interface SelectActionProps {
    groups: {groupName: string, actionCount: number}[],
    onAddAction: (actionDefinitionDetail: ActionDefinitionToAdd) => void
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            >
            {value === index && (
                <Box>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
);
}


const SelectAction = (props: SelectActionProps) => {
    const theme = useTheme();
    const [activeTab, setActiveTab] = React.useState(0)
    console.log(theme)
    return(
            <Box>
                <Box>
                    <Tabs value={activeTab} onChange={((event, newValue) => setActiveTab(newValue))}>
                        <Tab label="Groups" value={0} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7
                        }}/>
                        <Tab label="All Actions" value={1} sx={{
                              fontFamily: "SF Pro Text",
                              fontStyle: "normal",
                              fontWeight: 600,
                              fontSize: "14px",
                              lineHeight: "24px",
                              display: "flex",
                              alignItems: "center",
                              textAlign: "center",
                              opacity: 0.7
                        }}/>
                    </Tabs>
                </Box>
                <Box sx={{pt: 2}}>
                    <TabPanel value={activeTab} index={0}>
                        {/* <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                            <Box sx={{width: "100%"}}>
                            <TextField
                                id="input-with-icon-textfield"
                                placeholder="Search action..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon/>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    width: "100%"
                                }}
                                variant="outlined"
                            />
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "column", flexWrap: "nowrap", gap: 1}}>
                                {props.groups.map(group => 
                                    <Box>
                                        <GroupDropDown {...group} actions={[]}/>
                                    </Box>
                                )}
                            </Box>
                        </Box> */}
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        <SelectFromAllActions onAddAction={props.onAddAction}/>
                    </TabPanel>
                </Box>
            </Box>
    )
}


  


export default SelectAction;