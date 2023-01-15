import { Box, InputAdornment } from "@mui/material";
import { HeaderButtonsStyle, IconConatiner, SearchBarTextField, StyledTypographyDataHeader } from "./StyledComponents";
import UploadFileIcon from "../../../images/uploadFile.svg"
import CreateConnectionIcon from "../../../images/createConnection.svg"
import SearchIcon from '@mui/icons-material/Search';
import React, { useContext, useEffect } from "react";
import { DATA_CONNECTIONS_UPLOAD_ROUTE, DATA_CONNECTION_CHOOSE } from "../../../common/components/header/data/DataRoutesConfig";
import { Link as RouterLink } from "react-router-dom";
import { SetModuleContextState } from "../../../common/components/ModuleContext";
import RecommendedApps from "../../upload_table/components/RecommendedApps";



export const DataLandingPage = () => {
    const HeaderString = "Upload csv or select a table to explore"
    const [searchQuery, setSearchQuery] = React.useState("")
    
    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "",
                    SubTitle: ""
                }
            }
        })
    }, [])

    return (
        <Box sx={{ mt: 10,mx:6 }}>
            <Box>
                <StyledTypographyDataHeader>
                    {HeaderString}
                </StyledTypographyDataHeader>
            </Box>
            <Box sx={{ ...IconConatiner }}>
                <Box sx={{...HeaderButtonsStyle }} to={DATA_CONNECTION_CHOOSE} component={RouterLink}><img width='100px' height='100px' src={CreateConnectionIcon} alt="" /></Box>
                <Box sx={{...HeaderButtonsStyle }} to={DATA_CONNECTIONS_UPLOAD_ROUTE} component={RouterLink}><img width='100px' height='100px' src={UploadFileIcon} alt="" /></Box>
            </Box>
            <Box sx={{ py: 2 }}>
                <SearchBarTextField variant="standard"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    multiline={true}
                    InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ marginLeft: 1 }} />
                            </InputAdornment>
                        )
                    }} />
            </Box>
            <RecommendedApps searchQuery={searchQuery}/>
        </Box>
    )

}

export default DataLandingPage;
