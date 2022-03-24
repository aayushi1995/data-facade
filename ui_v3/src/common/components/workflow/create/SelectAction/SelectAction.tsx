
import React from 'react'
import { Box, Card, Chip, IconButton, InputAdornment, SvgIcon, TextField, Typography, useTheme} from '@mui/material';
import {Tabs, Tab} from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import { ReactComponent as DefaultIcon } from "../Icon.svg";
import GroupDropDown from '../GroupDropDown';
import SelectFromAllActions from '../SelectFromAllActions';

export interface ActionDefinitionToAdd {
    Id: string,
    DisplayName: string
    DefaultTemplateId: string
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

export function TabPanel(props: TabPanelProps) {
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
    const [actionDefinitionNameSearchQuery, setActionDefinitionNameSearchQuery] = React.useState<string>("")

    return(
            <Box sx={{display: "flex", gap: 1, flexDirection: "column"}}>
                <Box>
                    <Tabs value={activeTab} onChange={((event, newValue) => setActiveTab(newValue))}>
                        <Tab label="All Actions" value={0} sx={{
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
                        <Tab label="Groups" value={1} sx={{
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
                <Box>
                    <TextField
                        id="input-with-icon-textfield"
                        placeholder="Search action..."
                        value={actionDefinitionNameSearchQuery}
                        onChange={(event) => {setActionDefinitionNameSearchQuery(event.target.value)}}
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
                <Box sx={{}}>
                    <TabPanel value={activeTab} index={0}>
                        <SelectFromAllActions onAddAction={props.onAddAction} actionDefinitionNameSearchQuery={actionDefinitionNameSearchQuery}/>
                    </TabPanel>
                    <TabPanel value={activeTab} index={1}>
                        
                    </TabPanel>
                </Box>
            </Box>
    )
}


  


export default SelectAction;