import { Autocomplete, Box, Button, TextField } from "@mui/material";
import React from "react";
import { useHistory } from "react-router";
import ProviderDefinitionId from "../../../enums/ProviderDefinitionId";
import { ProviderInstance } from "../../../generated/entities/Entities";
import { ReactQueryWrapper } from "../error-boundary/ReactQueryWrapper";
import { DATA_ROUTE } from "../route_consts/data/DataRoutesConfig";
import { useProviders } from "./useGoogleHooks";


function ImportS3File() {
    const history = useHistory()
    const [s3Value, setS3Value] = React.useState<string | undefined>()
    const [selectedProviderInstance, setSelectedProviderInstance] = React.useState<ProviderInstance | undefined>()
    const s3ProviderQuery = useProviders({ providerDefinitionId: ProviderDefinitionId.S3 })

    const onClick = () => {
        if(!!s3Value && !!selectedProviderInstance?.Id) {
            history.push({
                pathname: DATA_ROUTE,
                search: `?${new URLSearchParams({ s3Url: s3Value, source: "browser", name: "Upload", s3UrlProviderInstanceId: selectedProviderInstance?.Id })}`
            })
        }
    }
    
    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box>
                <ReactQueryWrapper
                    isLoading={s3ProviderQuery.isLoading}
                    error={s3ProviderQuery.error}
                    data={s3ProviderQuery.data}
                    children={() => (
                        <Autocomplete
                            options={s3ProviderQuery.data!}
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
            <TextField placeholder="S3 Key" value={s3Value} onChange={(event) => setS3Value(event.target.value)} fullWidth/>
            <Button onClick={onClick}>Import</Button>
        </Box>
    )
}

export default ImportS3File;