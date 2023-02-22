import SearchIcon from '@mui/icons-material/Search';
import { Box, IconButton, InputAdornment } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import CreateConnectionIcon from "../../../assets/images/createConnection.svg";
import UploadFileIcon from "../../../assets/images/uploadFile.svg";
import { SetModuleContextState } from "../../../common/components/main_module/context/ModuleContext";
import { DATA_CONNECTION_CHOOSE } from "../../../common/components/route_consts/data/DataRoutesConfig";
import useContextStorageFile from '../../../hooks/useContextStorage';
import { SetDataContext } from '../../../utils/DataContextProvider';
import { HeaderButtonsStyle, IconConatiner, SearchBarTextField, StyledTypographyDataHeader } from "../components/StyledComponents";
import RecommendedApps from "../upload_table/components/RecommendedApps";
import UploadTableContextProvider from "../upload_table/context/UploadTablePageContext";
import UploadTablePage from "../upload_table/UploadTablePage";


export const DataLandingPage = () => {
    const HeaderString = "Upload csv or select a table to explore"
    const location = useLocation()
    const s3Url = new URLSearchParams(location.search)?.get("s3Url") || undefined
    const s3UrlProviderInstanceId = new URLSearchParams(location.search)?.get("s3UrlProviderInstanceId") || localStorage.getItem('s3Url') || undefined
    const [searchQuery, setSearchQuery] = React.useState("")
    const [file, handleFileUpload, handleFileRetrieval]: any = useContextStorageFile('file');
    const [fileToUpload, setFileToUpload] = React.useState<File | undefined>(handleFileRetrieval())

    const setDataContext = React.useContext(SetDataContext)
    const changeHandler = (event: any) => {
        const file = event.target.files[0];
        handleFileUpload(event)
        setFileToUpload(file)
    };
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

    useEffect(() => {
        if (s3Url) {
            localStorage.setItem('s3Url', s3Url)
        }

    }, [s3Url])


    const resetContext = () => {
        setFileToUpload(undefined)
        setDataContext({
            type: 'SetFile',
            payload: {
                fileURL: null
            }
        })
        setDataContext({
            type: 'SetFileName',
            payload: {
                fileName: null
            }
        })
        setDataContext({
            type: 'SetFileUpload',
            payload: {
                isUploadSucess: false
            }
        })
    }

    return (
        (!!fileToUpload || !!s3Url) ?
            <UploadTableContextProvider><UploadTablePage s3Url={s3Url} s3UrlProviderInstanceId={s3UrlProviderInstanceId} file={fileToUpload} onCancel={() => resetContext()} /></UploadTableContextProvider>
            :
            <Box sx={{ mt: 10, mx: 6 }}>
                <Box>
                    <StyledTypographyDataHeader>
                        {HeaderString}
                    </StyledTypographyDataHeader>
                </Box>
                <Box sx={{ ...IconConatiner }}>
                    <Box sx={{ ...HeaderButtonsStyle }} to={DATA_CONNECTION_CHOOSE} component={RouterLink}><img width='100px' height='100px' src={CreateConnectionIcon} alt="" /></Box>
                    <IconButton
                        sx={{ ...HeaderButtonsStyle }}
                        component="label"
                    >
                        <input type="file" accept={".csv,.xlsx"} hidden onChange={changeHandler} />
                        <img width='100px' height='100px' src={UploadFileIcon} alt="" />
                    </IconButton>
                </Box>
                <Box sx={{ py: 2 }}>
                    <SearchBarTextField variant="standard"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        multiline={true}
                        placeholder="What insight are you looking for ?"
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ marginLeft: 1 }} />
                                </InputAdornment>
                            )
                        }} />
                </Box>
                <RecommendedApps searchQuery={searchQuery} />
            </Box>

    )
}

export default DataLandingPage;
