import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import ProviderDefinitionId from "../../../enums/ProviderDefinitionId";
import { ProviderInstance } from "../../../generated/entities/Entities";
import { ReactQueryWrapper } from "../error-boundary/ReactQueryWrapper";
import LoadingIndicator from "../LoadingIndicator";
import { DATA_ROUTE } from "../route_consts/data/DataRoutesConfig";
import { useProviders } from "./useGoogleHooks";
import useImportGoogleSheet from "./useImportGoogleSheet";


function ImportGoogleSheet() {
    const history = useHistory()
    const [sheetUrl, setSheetUrl] = React.useState<string | undefined>()
    const [selectedProviderInstance, setSelectedProviderInstance] = React.useState<ProviderInstance | undefined>()
    const googleProviderQuery = useProviders({ providerDefinitionId: ProviderDefinitionId.GOOGLE_SHEETS })
    const {importGoogleSheet, uploading, error, s3Url} = useImportGoogleSheet({
        providerInstanceId: selectedProviderInstance?.Id,
    })

    const extractSpreadSheetId = () => {
        return new RegExp("/spreadsheets/d/([a-zA-Z0-9-_]+)").exec(sheetUrl || "")?.[1]
    }

    const extractWorkSheetId = () => {
        return new RegExp("[#&]gid=([0-9]+)").exec(sheetUrl || "")?.[1]
    }
    
    const importSheet = () => {
        const spreadsheetId = extractSpreadSheetId()
        const worksheetId = extractWorkSheetId()
        if(spreadsheetId && selectedProviderInstance?.Id) {
            importGoogleSheet(spreadsheetId, worksheetId)
        }
    }
    
    React.useEffect(() => {
        if(!!s3Url) {
            history.push({
                pathname: DATA_ROUTE,
                search: `?${new URLSearchParams({ s3Url: s3Url, source: "browser", name: "Upload" })}`
            })
        }
    }, [s3Url])
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box>
                <ReactQueryWrapper
                    isLoading={googleProviderQuery.isLoading}
                    error={googleProviderQuery.error}
                    data={googleProviderQuery.data}
                    children={() => (
                        <Autocomplete
                            options={googleProviderQuery.data!}
                            getOptionLabel={(providerInstance: ProviderInstance) => providerInstance.Name || "NA"}
                            filterSelectedOptions
                            fullWidth
                            selectOnFocus
                            clearOnBlur
                            handleHomeEndKeys
                            value={selectedProviderInstance || null}
                            isOptionEqualToValue={(option, value) => option?.Id===value?.Id}
                            onChange={(event, value, reason, details) => (reason==="selectOption" && value!==null) && setSelectedProviderInstance(value)}
                            renderInput={(params) => {
                                return <TextField {...params} sx={{borderRadius: '0px'}} variant="outlined" label="Select Provider"/>
                            }}
                        />
                    )}
                />
            </Box>
            <TextField placeholder="Sheet URL" value={sheetUrl} onChange={(event) => setSheetUrl(event.target.value)} fullWidth/>
            <Button onClick={importSheet} disabled={uploading}>Import</Button>
            {uploading && <LoadingIndicator/>}
            {error && <Typography>{error}</Typography>}
        </Box>
    )
}

export default ImportGoogleSheet;