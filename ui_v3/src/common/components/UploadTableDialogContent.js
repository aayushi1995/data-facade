import React from 'react';
import {Link as RouterLink, Redirect, Route} from 'react-router-dom';
import {
    Box,
    Button, Grid, Tab, Tabs, TextField
} from '@material-ui/core';
import dataManagerInstance from './../../data_manager/data_manager';
import S3UploadState from './../../custom_enums/S3UploadState';
import TagGroups from './../../enums/TagGroups';
import { useMutation } from 'react-query';
import labels from '../../labels/labels';
import ExternalStorageUploadRequestContentType from './../../enums/ExternalStorageUploadRequestContentType'
import SelectTags from './SelectTags.js';
import * as XLSX from 'xlsx';
import { useStyles, formActionPropertiesForLoadTableIntoLocal, TableSchemaSelection } from './UploadTableButton';
import DisplaySelectedFilesDetail from './DisplaySelectedFilesDetail'
import {DATA_CONNECTIONS_UPLOAD_ROUTE} from "./header/data/DataRoutesConfig";
import {Divider, Stack, Typography} from "@mui/material";

export const UploadTableDialogContent = (props) => {
    const classes = useStyles();
    // States
    const [selectedFile, setSelectedFile] = React.useState();
    const [uploadState, setUploadState] = React.useState(S3UploadState.NO_FILE_SELECTED);
    const [selectedFileSchema, setSelectedFileSchema] = React.useState({ requiredTableTags: [] });
    const [uploadButtonState, setUploadButtonState] = React.useState({
        currentEnabled: 4,
        requiredEnabled: 15
    });
    // Upload Button is enabled if all bits are set
    // 2^0: File type/size valid
    // 2^1: File name valid
    // 2^2: No Upload already in progress
    // 2^3: All Column Names are Valid and Distinct
    // 2^4: All Required Table Tags Configured
    const enableUploadButton = (value) => {
        setUploadButtonState(old => {
            return {
                ...old,
                currentEnabled: old.currentEnabled | value
            };
        });
    };

    const disableUploadButton = (value) => {
        setUploadButtonState(old => {
            return {
                ...old,
                currentEnabled: (old.requiredEnabled ^ value) & old.currentEnabled
            };
        });
    };

    const fetchPresignedUrlMutation = useMutation(
        "GetS3PreSignedUrl",
        (config) => dataManagerInstance.getInstance.s3PresignedUploadUrlRequest(config.file, config.expirationDurationInMinutes, ExternalStorageUploadRequestContentType.TABLE),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.PRESIGNED_URL_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const uploadToS3Mutation = useMutation(
        "UploadToS3",
        (config) => dataManagerInstance.getInstance.s3UploadRequest(config.requestUrl, config.headers, config.file),
        {
            onMutate: variables => {
                setUploadState(S3UploadState.S3_UPLOAD_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const loadTableFromS3Action = useMutation(
        "LoadTableFromS3",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                setUploadState(S3UploadState.FDS_TABLE_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const setSelectedFileColumnSchema = React.useCallback((columnSchema) => {
        setSelectedFileSchema(old => {
            return { ...old, "columnSchema": columnSchema };
        });
    });

    const setSelectedFileTableName = React.useCallback((tableName) => {
        setSelectedFileSchema(old => {
            return { ...old, "tableName": tableName };
        });
    });

    const setSelectedFileTableTags = React.useCallback((tableTags) => {
        setSelectedFileSchema(old => {
            return { ...old, "tableTags": tableTags };
        });
    });

    const cleanData = (data) => {
        const dataRows = data.split("\n");
        var cleanedRows = [];
        var cleanedData = "";
        var foundHeader = false;
        for (var i = 0, j = 0; i < dataRows.length; i++) {
            const row = dataRows[i];
            if (foundHeader) {
                cleanedRows[j++] = row;
            } else {
                const values = row.split(",");
                if (!(values.some(v => (v === "")))) {
                    foundHeader = true;
                    cleanedRows[j++] = row;
                }
            }
        }
        for (var i = 0; i < cleanedRows.length; i++) {
            if (i === 0) {
                cleanedData = cleanedData + cleanedRows[i];
            } else {
                cleanedData = cleanedData + "\n" + cleanedRows[i];
            }
        }
        return cleanedData;
    };

    const readExcelAsCSV = (file) => {
        const fileReader = new FileReader();
        const fileName = file.name.split('.').slice(0, -1).join('') + ".csv";
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = (e) => {
            const bufferedArray = e.target.result;
            const wb = XLSX.read(bufferedArray, { type: 'buffer' });

            // TODO: Instead of taking the SheetNames[0], let user choose that.
            const wsName = wb.SheetNames[0];
            const ws = wb.Sheets[wsName];
            const data = XLSX.utils.sheet_to_csv(ws);
            const cleanedData = cleanData(data);
            console.log("[Data Read as CSV]: " + data);
            console.log("[Clean Data]: " + cleanedData);
            const newFile = new File([cleanedData], fileName, { type: "text/csv" });
            setUploadState(S3UploadState.SELECTED_FILE_OK);
            setSelectedFile(newFile);
            enableUploadButton(1);
        };
        fileReader.onerror = (error) => {
            setUploadState(S3UploadState.SELECTED_FILE_NOT_CORRECT_FORMAT(file.type));
            setSelectedFile(undefined);
            disableUploadButton(1);
        };
    };

    const setTag = (tagModel) => {
        setSelectedFileSchema(oldSchema => {
            const oldRequiredTableTags = (oldSchema?.requiredTableTags || []);
            const newRequiredTableTags = oldRequiredTableTags.some(oldTag => oldTag.TagGroup === tagModel.TagGroup) ?
                oldRequiredTableTags.map(oldTag => oldTag.TagGroup === tagModel.TagGroup ?
                    { ...oldTag, ...tagModel }
                    :
                    oldTag
                )
                :
                [...oldRequiredTableTags, tagModel];

            return {
                ...oldSchema,
                requiredTableTags: newRequiredTableTags
            };
        });
    };

    const getTag = (tagGroupName) => {
        return ((selectedFileSchema?.requiredTableTags || []).filter(tagModel => tagModel.TagGroup === tagGroupName)[0]) || { Name: "" };
    };

    const changeHandler = (event) => {
        const file = event.target.files[0];
        if (file !== undefined) {
            if (!(file.type === "text/csv" | file.type === "application/vnd.ms-excel" | file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                setUploadState(S3UploadState.SELECTED_FILE_NOT_CORRECT_FORMAT(file.type));
                setSelectedFile(undefined);
                disableUploadButton(1);
            } else if (file.size < 40000000 & (file.type === "text/csv" | file.type === "application/vnd.ms-excel")) {
                setUploadState(S3UploadState.SELECTED_FILE_OK);
                setSelectedFile(file);
                enableUploadButton(1);
            } else if (file.size < 40000000 & file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                readExcelAsCSV(file);
            } else {
                setUploadState(S3UploadState.SELECTED_FILE_TOO_LARGE);
                setSelectedFile(undefined);
                disableUploadButton(1);
            }
        }
    };

    const uploadSelectedFiles = () => {
        const fileName = selectedFileSchema.tableName + ".csv";
        const redirect_path = '/tableBrowser/'+selectedFileSchema.tableName
        const newFile = new File([selectedFile], fileName, { type: selectedFile.type });
        fetchPresignedUrlMutation.mutate(
            { file: newFile, expirationDurationInMinutes: 5 },
            {
                onSuccess: (data, variables, context) => {
                    setUploadState(S3UploadState.PRESIGNED_URL_FETCH_SUCCESS);
                    disableUploadButton(4);
                    uploadToS3Mutation.mutate(
                        { requestUrl: data.requestUrl, headers: data.headers, file: variables.file },
                        {
                            onSuccess: () => {
                                setUploadState(S3UploadState.S3_UPLOAD_SUCCESS);
                                disableUploadButton(4);
                                loadTableFromS3Action.mutate(
                                    {
                                        entityName: "ActionInstance",
                                        actionProperties: formActionPropertiesForLoadTableIntoLocal(data, variables.file, selectedFileSchema)
                                    },
                                    {
                                        onSuccess: () => {
                                            setUploadState(S3UploadState.FDS_TABLE_FETCH_SUCCESS);
                                            return <Redirect to={redirect_path} />
                                             
                                            // enableUploadButton(4);
                                            // props.closeDialogFunction();
                                        },
                                        onError: (err, variables, context) => {
                                            console.log(err, variables, context)
                                            setUploadState(S3UploadState.FDS_TABLE_FETCH_ERROR);
                                            enableUploadButton(4);
                                        }
                                    }
                                );
                            },
                            onError: (data, variables, context) => {
                                setUploadState(S3UploadState.S3_UPLOAD_ERROR);
                                enableUploadButton(4);
                            }
                        }
                    );
                },
                onError: (data, variables, context) => {
                    setUploadState(S3UploadState.PRESIGNED_URL_FETCH_ERROR);
                    enableUploadButton(4);
                }
            }
        );
    };
    // TODO: Apply colour to disbaled Upload Button
    return (
        <Grid container spacing={2}>
            {!selectedFile && !props.isApplication &&
                <Grid item xs={12}>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                    <TextField
                        id="outlined-multiline-static"
                        label="Note"
                        multiline
                        rows={4}
                        defaultValue={labels.UploadTableButton.DIRECTION}
                        variant="outlined"
                        InputProps={{ readOnly: true }}
                        fullWidth
                        rowsMax="10" />
                </Grid>}
            {!selectedFile && props.isApplication &&
                <Grid item xs={12}>
                    <Box m={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.CUSTOMER_NAME }}
                                    tagSelectionMode="single"
                                    label="Customer Name"
                                    allowNewTagCreation={false}
                                ></SelectTags>
                            </Grid>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.SUBSIDIARY, ParentTagName: getTag(TagGroups.CUSTOMER_NAME)?.Name }}
                                    readOnly={getTag(TagGroups.CUSTOMER_NAME)?.Name === ""}
                                    tagSelectionMode="single"
                                    label="Subsidiary"
                                ></SelectTags>
                            </Grid>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.YEAR }}
                                    tagSelectionMode="single"
                                    label="FY Year"
                                ></SelectTags>
                            </Grid>
                            <Grid item xs={3}>
                                <SelectTags
                                    setTags={setTag}
                                    maxHeight={120}
                                    tagOptionFilter={{ TagGroup: TagGroups.FILE_TYPE }}
                                    tagSelectionMode="single"
                                    label="File Type"
                                ></SelectTags>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>}
            {selectedFile &&
                <Stack direction="column" flex={1} spacing={2} px={2}>
                    <Divider sx={{p: 3}}/>
                    <DisplaySelectedFilesDetail selectedFile={selectedFile} />
                </Stack>}
            {/* {selectedFile &&
            <Grid container item xs={6}>
                <TableRequiredTagSelection enableUploadButton={enableUploadButton}
                                           disableUploadButton={disableUploadButton}
                                           selectedFileSchema={selectedFileSchema}
                                           setSelectedFileSchema={setSelectedFileSchema}/>
            </Grid>
            } */}
            {selectedFile &&
                <Grid container item xs={12}>
                    <TableSchemaSelection uploadState={uploadState} selectedFile={selectedFile}
                        setSelectedFileColumnSchema={setSelectedFileColumnSchema}
                        setSelectedFileTableName={setSelectedFileTableName}
                        enableUploadButton={enableUploadButton} disableUploadButton={disableUploadButton}
                        setSelectedFileTablTags={setSelectedFileTableTags} />
                </Grid>}
            <Grid container item xs={12}>
                <Grid item xs={3}>
                    <Button variant="contained" component="label" classes={{ root: "select-all" }}>
                        Select File
                        <input type="file" accept={".csv,.xlsx"} hidden onChange={changeHandler} />
                    </Button>
                </Grid>
                <Grid item xs={2}>
                    {selectedFile && <Button variant="contained" component="label" onClick={uploadSelectedFiles}
                        classes={{ root: "select-all", disabled: classes.disabledButton }}
                        disabled={uploadButtonState.currentEnabled !== uploadButtonState.requiredEnabled}>
                        Upload
                    </Button>}
                </Grid>
                <Grid container item xs={2}>
                    {selectedFile && <Grid item xs={6} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>{uploadState.icon}</Grid>}
                </Grid>
                <Grid item xs={5}>
                    {selectedFile && <TextField
                        disabled
                        multiline
                        rows={1}
                        fullWidth
                        id="outlined-disabled"
                        label="Status"
                        rowsMax="4"
                        value={uploadState.message} />}
                </Grid>
            </Grid>
            <p></p>
        </Grid>
    );
};
export default UploadTableDialogContent;
