import {
    Box,
    Button, Card, Divider,
    FormControl, Grid, InputLabel,
    List,
    ListItem, MenuItem,
    Select, TextField,
    IconButton,
    InputAdornment
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DataGrid } from "@mui/x-data-grid";
import Papa from 'papaparse';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { useHistory } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { DATA_ALL_TABLES_ROUTE } from '../../../common/components/header/data/DataRoutesConfig';
import VirtualTagHandler from '../../../common/components/tag-handler/VirtualTagHandler';
import SelectTags from './../../../common/components/SelectTags.js';
import './../../../css/table_browser/TableBrowser.css';
import S3UploadState from './../../../custom_enums/S3UploadState';
import dataManagerInstance from './../../../data_manager/data_manager';
import ColumnDataType from './../../../enums/ColumnDataType';
import ExternalStorageUploadRequestContentType from './../../../enums/ExternalStorageUploadRequestContentType';
import TagGroups from './../../../enums/TagGroups';
import TagScope from './../../../enums/TagScope';
import SelectHeaderRowsButton from './SelectHeaderRowsButton';
import { findHeaderRows } from './util';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CollapsibleDrawer from "../../../../src/pages/build_action/components/form-components/CollapsibleDrawer"
import DoubeLeftIcon from '../../../../src/images/Group 691.svg';
import {Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search'; 
import TableIcon from '../../../../src/images/table_2.svg'
const useStyles = makeStyles(() => ({
    requiredTags: {
        width: "100%",
        height: 200,
        overflow: 'auto',
    },
    displayFileDetail: {
        height: 200,
        overflow: 'auto',
        width: "100%"
    },
    dialog: {
        display: 'flex',
        justifyContent: 'space-between',
        borderBottom: '1px solid'
    },
    dialogPaper: {
        minWidth: 1200,
        height: "auto",
        overflowY: "hidden"
    },
    columnSchemaDefault: {
        // background: "#DBFCFE"
    },
    selectEmpty: {},
    disabledButton: {
        background: "#classes"
    },
    formControl: {
        width: "100%"
    },
    TablePreview: {
        width: "100%",
    },
    TablePreviewBox: {
        height: 600,
        overflow: 'auto',
        width: '100%'
    }
}))


export const ConfigureTableMetadata = (props) => {
    const classes = useStyles();
    let history = useHistory();
    // States
    const selectedFile = props.file
    const [selectedFileSchema, setSelectedFileSchema] = React.useState({ requiredTableTags: [] });
    const [uploadButtonState, setUploadButtonState] = React.useState({
        currentEnabled: 5,
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
                props.setUploadState(S3UploadState.PRESIGNED_URL_FETCH_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const uploadToS3Mutation = useMutation(
        "UploadToS3",
        (config) => dataManagerInstance.getInstance.s3UploadRequest(config.requestUrl, config.headers, config.file),
        {
            onMutate: variables => {
                props.setUploadState(S3UploadState.S3_UPLOAD_LOADING);
                disableUploadButton(4);
            }
        }
    );

    const loadTableFromS3Action = useMutation(
        "LoadTableFromS3",
        (config) => dataManagerInstance.getInstance.saveData(config.entityName, config.actionProperties),
        {
            onMutate: () => {
                props.setUploadState(S3UploadState.FDS_TABLE_FETCH_LOADING);
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

    const setSelectedFileDataStartsFromRow = React.useCallback((dataStartsFromRow) => {
        setSelectedFileSchema(old => {
            return { ...old, "dataStartsFromRow": dataStartsFromRow };
        });
    });

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

    const uploadSelectedFiles = () => {
        props.setUploadState(S3UploadState.BUIDING_FILE_FOR_UPLOAD);
        Papa.parse(selectedFile,
            {
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (result) => {
                    const newCsvFileJson = {
                        data: result.data.slice(selectedFileSchema.dataStartsFromRow),
                        fields: selectedFileSchema.columnSchema.map(col => col.columnName)
                    }
                    const fileName = selectedFileSchema.tableName + ".csv";
                    const newCsvFileContent = Papa.unparse(newCsvFileJson)
                    const newCsvFile = new File([newCsvFileContent], fileName, {type: selectedFile.type})
                    props.setUploadState(S3UploadState.FILE_BUILT_FOR_UPLOAD);
                    uploadGivenFile(newCsvFile)
                },
                error: (errors, file) => {
                    console.log(errors)
                }
            })
    }
    const uploadGivenFile = (newFile) => {
        // const fileName = selectedFileSchema.tableName + ".csv";
        // const newFile = new File([selectedFile], fileName, { type: selectedFile.type });

        fetchPresignedUrlMutation.mutate(
            { file: newFile, expirationDurationInMinutes: 5 },
            {
                onSuccess: (data, variables, context) => {
                    props.setUploadState(S3UploadState.PRESIGNED_URL_FETCH_SUCCESS);
                    disableUploadButton(4);
                    uploadToS3Mutation.mutate(
                        { requestUrl: data.requestUrl, headers: data.headers, file: variables.file },
                        {
                            onSuccess: () => {
                                props.setUploadState(S3UploadState.S3_UPLOAD_SUCCESS);
                                disableUploadButton(4);
                                loadTableFromS3Action.mutate(
                                    {
                                        entityName: "ActionInstance",
                                        actionProperties: formActionPropertiesForLoadTableIntoLocal(data, variables.file, selectedFileSchema)
                                    },
                                    {
                                        onSuccess: () => {
                                            props.setUploadState(S3UploadState.FDS_TABLE_FETCH_SUCCESS);
                                            enableUploadButton(4);
                                            history.push(DATA_ALL_TABLES_ROUTE)
                                        },
                                        onError: (err, variables, context) => {
                                            console.log(err, variables, context)
                                            props.setUploadState(S3UploadState.FDS_TABLE_FETCH_ERROR);
                                            enableUploadButton(4);
                                        }
                                    }
                                );
                            },
                            onError: (data, variables, context) => {
                                props.setUploadState(S3UploadState.S3_UPLOAD_ERROR);
                                enableUploadButton(4);
                            }
                        }
                    );
                },
                onError: (data, variables, context) => {
                    props.setUploadState(S3UploadState.PRESIGNED_URL_FETCH_ERROR);
                    enableUploadButton(4);
                }
            }
        );
    };



    // TODO: Apply colour to disbaled Upload Button
    return (
        <Grid sx={{m:-4 , mt:-5}}>
            {props.isApplication &&
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
                <Grid container item xs={12} direction="row">
                        <Box  sx={{width:'100%',mx:1,px:2,pb:2, display:'flex' , flexDirection:'row', justifyContent:'flex-end'}}>
                            <Link to="/data/connections" style={{textDecoration: 'none'}}>
                            <Button  sx={{borderRadius:'5px',width:'115px',mr:2,textDecoration:'none'}} variant="outlined" color="error">
                                Cancel
                            </Button>
                            </Link>

                            <Button color="success" variant="contained" sx={{borderRadius:'5px', width:'115px'}} component="label" onClick={uploadSelectedFiles}
                                // classes={{ root: "select-all", disabled: classes.disabledButton }}
                                disabled={uploadButtonState.currentEnabled !== uploadButtonState.requiredEnabled}>
                                Save
                            </Button>
                        </Box>
                </Grid>
            <Grid container item xs={12}>
                <TableSchemaSelection selectedFile={selectedFile}
                    setSelectedFileColumnSchema={setSelectedFileColumnSchema}
                    setSelectedFileTableName={setSelectedFileTableName}
                    enableUploadButton={enableUploadButton} disableUploadButton={disableUploadButton}
                    setSelectedFileTablTags={setSelectedFileTableTags}
                    setSelectedFileDataStartsFromRow={setSelectedFileDataStartsFromRow} 
                    statusMSG = {props.stateData}/>
            </Grid>
            <p></p>
        </Grid>
    );
};

const TableSchemaSelection = (props) => {
    const classes = useStyles()
    /**
     * parsedFileResult
     *      columnNames
     *      headerRows
     *      dataStartsFromRow
     *      data
     */
    const [parsedFileResult, setParsedFileResult] = React.useState({})
    const [columnProperties, setColumnProperties] = React.useState()
    const [displayColumnProperties, setDisplayColumnProperties] = React.useState()
    const [columnSearchQuery, setColumnSearchQuery] = React.useState("")
    const [tableProperties, setTableProperties] = React.useState({
        tableName: "",
        tags: [],
        isValid: true
    })

    const setColumnAndDataCallback = (columnNames, dataStartsFromRow, data, headerRows) => {
        props.setSelectedFileDataStartsFromRow(dataStartsFromRow)
        setParsedFileResult(oldResult => {
            return {
                ...oldResult,
                columnNames: columnNames,
                dataStartsFromRow: dataStartsFromRow,
                data: data,
                headerRows: headerRows
            }
        })
    }
    /**
     * Responsible for
     *      1. Assigning the TableName
     *      2. Assigning the ColumnNames and DataStartsFromRow to parsedFileResult
     */
    React.useEffect(() => {
        if(!!props.selectedFile) {
            findHeaderRows(props.selectedFile, setColumnAndDataCallback)
            setTableName(formCloseValidObjectName(props.selectedFile.name.split('.').slice(0, -1).join('')))
        }
    }, [props.selectedFile])

    // Responsible for populating columnProperties from parsedFileResult
    React.useEffect(() => {
        if (!!parsedFileResult && !!parsedFileResult?.columnNames && !!parsedFileResult?.data) {
            const colProps = parsedFileResult.columnNames.map((columnName, columnIndex) => {
                const calculatedDataType = getTypeOfValue(parsedFileResult.data.map(x => x[columnIndex]))
                return {
                    columnName: formCloseValidObjectName(columnName),
                    columnDatatype: calculatedDataType,
                    columnIndex: columnIndex,
                    columnTags: [],
                    isValid: true,
                    isDuplicate: false,
                    duplicateColor: undefined
                }
            })
            setColumnProperties(colProps)
        
        } else {
            setColumnProperties([])
        }
    }, [parsedFileResult])

    const fetchTags = useMutation(
        "FetchTags",
        (config) => dataManagerInstance.getInstance.getTableAndColumnTags(config),
        {
            onMutate: variables => {
            }
        }
    )

    const setTableName = (tableName) => {
        setTableProperties(old => {
            return {...old, tableName: tableName}
        })
    }

    const handleTableTagChange = (newTags) => {
        setTableProperties((oldProps) => {
            return {
                ...oldProps,
                tags: newTags
            }
        })
    }

    // Responsible for checking if the TableName is a valid String
    React.useEffect(() => {
        setTableProperties(old => {
            isValidObjectName(old.tableName) ? props.enableUploadButton(2) : props.disableUploadButton(2)
            return {
                ...old,
                isValid: isValidObjectName(old.tableName)
            }
        })

    }, [tableProperties.tableName])

    // Responsible for filterting which columnProperties are shown on screen
    React.useEffect(() => {
        setDisplayColumnProperties((columnProperties || []).filter(column => column.columnName.search(columnSearchQuery) >= 0))
    }, [columnSearchQuery, JSON.stringify(columnProperties)])


    const finalColumnProperties = (columnProperties) => {
        if (columnProperties !== undefined) {
            const newColumnPropertiesConfig = {}
            for (var i = 0; i < columnProperties.length; i++) {
                var columnName = columnProperties[i].columnName
                if (columnName in newColumnPropertiesConfig) {
                    newColumnPropertiesConfig[columnName] = {
                        ...newColumnPropertiesConfig[columnName],
                        isDuplicate: true,
                        duplicateColor: getColor(i)
                    }
                } else {
                    newColumnPropertiesConfig[columnName] = {
                        isDuplicate: false,
                        duplicateColor: undefined
                    }
                }
            }

            const newColumnProperties = columnProperties.map(columnProperty => {
                return {
                    ...columnProperty,
                    ...newColumnPropertiesConfig[columnProperty.columnName],
                    isValid: isValidObjectName(columnProperty.columnName)
                }
            })

            return newColumnProperties
        }
    }

    /**
     * Responsible for
     *      1. Checking if all columnNames are Valid.
     *      2. Checking if all columnNames are Distinct.
     */
    React.useEffect(() => {
        if (columnProperties !== undefined) {
            const columnNames = columnProperties.map(columnProperty => columnProperty.columnName)
            const allColumnNamesValid = columnProperties.map(columnProperty => columnProperty.isValid).every(x => x === true)
            const allColumnNamesDistinct = !((new Set(columnNames)).size !== columnNames.length)

            if (allColumnNamesValid & allColumnNamesDistinct) {
                props.enableUploadButton(8)
            } else {
                props.disableUploadButton(8)
            }
            setColumnProperties(finalColumnProperties(columnProperties))
        }
        props.setSelectedFileColumnSchema(columnProperties)
    }, [JSON.stringify(columnProperties)])


    React.useEffect(() => {
        if (tableProperties.isValid) {
            props.setSelectedFileTableName(tableProperties.tableName)
        }
        props.setSelectedFileTablTags(tableProperties.tags)
    }, [JSON.stringify(tableProperties)])

    // Responsible for fetching Tags from Prediction Service
    React.useEffect(() => {
        if (!!parsedFileResult && !!columnProperties && !fetchTags.data) {
            const tagRequest = {
                name: tableProperties.tableName,
                column_names: parsedFileResult.columnNames,
                data: parsedFileResult.data
            }

            fetchTags.mutate(JSON.stringify(tagRequest),
                {
                    onSuccess: (parsedData, variables, context) => {
                        setColumnProperties(oldProp => {
                            let column_tags = parsedData["column_tags"]
                            if (column_tags === undefined || column_tags.length == 0) return oldProp
                            
                            let newProp = [...oldProp]
                            column_tags.forEach(columnTagProp => {
                                const columnName = columnTagProp.column_name
                                let tags_len = columnTagProp["column_tags"].length
                                let tags = []
                                for (var i=0; i < tags_len; i++){
                                    let column_tag = columnTagProp["column_tags"][i]
                                    tags.push({Name: column_tag})
                                }
                                
                                newProp = newProp.map(col => {
                                    if (col["columnName"] === columnName) {
                                        return {
                                            ...col,
                                            columnTags: [...col.columnTags, ...tags]
                                        }
                                    } else {
                                        return col
                                    }
                                })
                            })

                            return newProp
                        })

                        setTableProperties(oldProp => {
                            let table_tags = parsedData["table_tags"]
                            if (table_tags === undefined 
                                || table_tags.length == 0)
                                return oldProp
                            let tags_len = table_tags.length
                            let tags = []
                            for (var i=0; i < tags_len; i++){
                                let table_tag = table_tags[i]
                                tags.push({Name: table_tag})
                            }
                            const newProp = {
                                ...oldProp,
                                tags: [...oldProp.tags, ...tags]
                            }
                            return newProp
                        })
                    },
                    onSettled: () => {
                    },
                    onError: (data, variables, context) => {
                    }
                })
        }

    }, [parsedFileResult])



    const setColumnProperty = React.useCallback(
        (columnIndex, newProperty) => {
            setColumnProperties(old => {
                return [
                    ...old.slice(0, columnIndex),
                    {
                        ...old[columnIndex],
                        ...newProperty
                    },
                    ...old.slice(columnIndex + 1)
                ]
            })
        }, [])

    const schemaDataSelector = (displayColumnProperties || []).map((columnProperty, columnIndex) =>
        <>
            <ListItem sx={{px:1}}
                style={((columnProperty.duplicateColor !== undefined) ? {background: columnProperty.duplicateColor} : {})} key={`ColumnIndex-${columnIndex}`}>
                <MemoizedColumnPropertiesSelector columnIndex={columnIndex} columnProperty={columnProperty}
                                                  setColumnProperty={setColumnProperty} key={columnIndex}/>
            </ListItem>
            
        </>
    )

    const whyTableNameNotValid = () => {
        if (tableProperties.isValid) {
            return "Table Name Valid"
        } else {
            return `Non Empty except '"'`
        }
    }
    const [opener , setopener] = useState();
    
    const drawerOpenHandler = (mp)=>{
        setopener(mp)
    }
    return (
        <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 0 }}>
                <CollapsibleDrawer
                open={opener || false}
                openWidth="400px"
                closedWidth="50px"
                openDrawer={() => {drawerOpenHandler(true)}}
                >
                    <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", flex: 1 }}>
                            <IconButton onClick={() => drawerOpenHandler(false)}>
                                <img src={DoubeLeftIcon} alt="NA"/>
                            </IconButton>
                        </Box>
                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 0 ,px:1, borderRadius:'10px' }}>
                    <Box sx={{ display: "flex", flexDirection: "row", width: "100%", gap: 1,pr:2 }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", width: "300px" }}>
                            <TextField
                                fullWidth
                                sx={{
                                    backgroundColor: 'allTableTextfieldbgColor1.main',
                                    boxSizing: 'border-box', 
                                    boxShadow: 'inset -4px -6px 16px rgba(255, 255, 255, 0.5), inset 4px 6px 16px rgba(163, 177, 198, 0.5)',
                                    borderRadius: '15px'
                                }}
                                placeholder="Search Column"
                                value={columnSearchQuery}
                                onChange={(event) => {
                                    setColumnSearchQuery(event.target.value)
                                }}
                                InputProps={{
                                    disableUnderline: true,
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{marginLeft: 0}}/>
                                        </InputAdornment>
                                    )
                            }}
                            />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "flex-start", alignItems: "center", flex: 1 , width:'100px' }}>
                            <SelectHeaderRowsButton selectedFile={props.selectedFile} callback={setColumnAndDataCallback} headerRows={parsedFileResult?.headerRows}/>
                        </Box>
                    </Box>
                    <Box sx={{}}>
                        <List sx={{ height: 700, overflow: 'auto', width: "100%" ,p:0}}>
                            {schemaDataSelector}
                        </List>
                    </Box>
                </Box>
                </CollapsibleDrawer>
            <Box sx={{  display: "flex",
                        flexDirection: "column", 
                        width: "100%", 
                        gap: 1 ,
                        }}>
                <Box sx={{ display: "flex", 
                            flexDirection: "row", 
                            gap: 1, 
                            backgroundColor: 'ActionDefinationHeroCardBgColor.main',
                            boxShadow: '0px 17.5956px 26.3934px rgba(54, 48, 116, 0.3)',
                            borderRadius: "10px",
                            padding: "10px",
                            mx:3
                            // boxShadow: '-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF' 
                        }}>
                    <Box sx={{ width: "50%",p:2, display:'flex', flexDirection:'column'}}>
                        <TextField
                            variant="standard"
                            fullWidth
                            value={tableProperties.tableName}
                            error={tableProperties.tableName && !tableProperties.isValid}
                            // label={tableProperties.tableName && whyTableNameNotValid()}
                            onChange={(event) => {
                                setTableName(event.target.value)
                            }}
                            InputProps={{
                                sx: {
                                    fontFamily: "SF Pro Display",
                                    fontStyle: "normal",
                                    fontWeight: 600,
                                    fontSize: "36px",
                                    lineHeight: "116.7%",
                                    color: "ActionDefinationHeroTextColor1.main",
                                    borderStyle: "solid",
                                    borderColor: "transparent",
                                    borderRadius: "5px",
                                    boxShadow: '-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF',
                                    backgroundColor: "ActionCardBgColor.main",
                                    padding:'10px', 
                                    ":hover": {
                                        ...(props.mode==="READONLY" ? {
                                            
                                        } : {
                                            backgroundColor: "ActionDefinationTextPanelBgHoverColor.main"
                                        })
                                    }
                                },
                                disableUnderline: true,
                                startAdornment: (
                                    <InputAdornment position="end">
                                        <CheckCircleIcon sx={{ color: "syncStatusColor1.main" ,fontSize:'40px', m:2}}/>
                                    </InputAdornment>
                                )
                            }}
                            
                        />
                            <Box  sx={{mt:2, display:'flex', flexDirection:'row'}}>
                                <img src={TableIcon} alt="table" sx={{width:'40px' , height:'40px'}}/>
                                <Box sx={{px:2,ml:2, borderLeft:'3px solid black'}}>
                                    <Box sx={{display:'inline',fontWeight:'600' , color:'gray'}}>Status : </Box>{props.statusMSG}
                                </Box>
                            </Box>
                    </Box>
                    <Box sx={{ flex: 1 , my:1,px:2}}>
                            
                            <Box sx={{
                                borderRadius: "5px",
                                boxShadow: '-10px -10px 15px #FFFFFF, 10px 10px 10px rgba(0, 0, 0, 0.05), inset 10px 10px 10px rgba(0, 0, 0, 0.05), inset -10px -10px 20px #FFFFFF',
                                backgroundColor: "ActionCardBgColor.main",
                                p:1,
                                mt:2,
                                height:'130px',
                                overflow:'scroll'

                                
                            }}>
                            <VirtualTagHandler
                                selectedTags={tableProperties.tags}
                                onSelectedTagsChange={handleTableTagChange}
                                tagFilter={{Scope: TagScope.TABLE}}
                                allowAdd={true}
                                allowDelete={true}
                                inputFieldLocation="BOTTOM"
                                />
                            </Box>
                        
                    </Box>
                </Box>

                <Box>
                    <TablePreview 
                        selectedFile={props.selectedFile}
                        dataStartsFromRow={parsedFileResult.dataStartsFromRow}
                        columns={columnProperties}
                        tableName={tableProperties?.tableName}
                        data={parsedFileResult.data}
                    />
                </Box>
            </Box>
        </Box>
    )
}

/* 
 * props:
 * selectedFile: 
 *      File()
 *      CsvFile that is to be uploaded
 * dataStartsFromRow:
 *      Integer
 *      Row rom which data starts in the file
 * data
 *      Array[]
 *      The data to be shown
 * columns
 *      Array[Object]
 *      Definition of the columns
 * tableName
 *      String
 *      Name of the Table
*/
const TablePreview = (props) => {
    const classes = useStyles()

    const {selectedFile, dataStartsFromRow, columns, tableName, data} = props
    const [dataGridProps, setDataGridProps] = React.useState({rows: [], columns: [], title: "", options: {}})

    React.useEffect(() => {
        if(!!selectedFile && !!dataStartsFromRow && !!columns && !!tableName && !!data) {
            const rows = data.map((dataRow, index) => {
                const rowObject = {id: index}
                for(let i=0; i<columns.length; i+=1) {
                    rowObject[columns[i].columnName] = dataRow[i]
                }
                return rowObject
            })
            
            const columnProps = columns.map(column => {
                const headerName = `${column.columnName} (${column.columnDatatype})`
                return {
                    field: column.columnName,
                    width: headerName.length * 12,
                    headerName: headerName
                }
            })
            
            setDataGridProps(oldProps => {
                return {
                    ...oldProps,
                    columns: columnProps,
                    isRowSelectable: () => false,
                    rows: rows,
                    rowsPerPageOptions: [10, 25, 50, 100]
                }
            })
        }
    }, [selectedFile, dataStartsFromRow, columns, tableName, data])

    return (
        <Box className={classes.TablePreviewBox} sx={{p:4}} fullWidth>
            <DataGrid
                sx={{
                    "& .MuiDataGrid-columnHeaders": { backgroundColor: "ActionDefinationTextPanelBgColor.main"},    backgroundColor: 'ActionCardBgColor.main',
                    backgroundBlendMode: "soft-light, normal",
                    border: "2px solid rgba(255, 255, 255, 0.4)",
                    boxShadow: "-10px -10px 20px #E3E6F0, 10px 10px 20px #A6ABBD",
                    borderRadius: "10px",
                    
                }}
                {...dataGridProps}
            />
        </Box>
    )
}

const ColumnPropertiesSelector = (props) => {
    const classes = useStyles()

    const handleColumnNameChange = (event) => {
        const newName = event.target.value
        props.setColumnProperty(props.columnIndex, {columnName: newName})
    }

    const handleColumnDataTypeChange = (event) => {
        const newDataType = event.target.value;
        props.setColumnProperty(props.columnIndex, {columnDatatype: newDataType})
    }

    const handleColumnTagChange = (tags) => {
        const newTags = tags
        props.setColumnProperty(props.columnIndex, {columnTags: newTags})
    }

    const isColumnFieldValid = () => {
        return props.columnProperty.isValid & (!props.columnProperty.isDuplicate)
    }

    const whyColumnFieldNotValid = () => {
        if (props.columnProperty.isValid === true & props.columnProperty.isDuplicate === true) {
            return "Duplicate Name"
        } else if (props.columnProperty.isValid === true & props.columnProperty.isDuplicate === false) {
            return "Column Name Valid"
        } else if (props.columnProperty.isValid === false & props.columnProperty.isDuplicate === true) {
            return `Duplicate. Non Empty except '"'`
        } else {
            return `Non Empty except '"'`
        }
    }

    return (
        <Card sx={{
            borderRadius: '10px', 
            px: 1,
            py: 2, 
            boxSizing: "content-box",
            border: "0.439891px solid #FFFFFF",
            width: "100%",
            boxShadow: "-5px -5px 10px #E3E6F0, 5px 5px 10px #A6ABBD",
            backgroundColor:'ButtonHighlight'
             }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1}}>
                <Box sx={{ display: "flex", flexDirection: "row", gap: 1, width: "100%" }}>
                    <Box sx={{ width: "300px" }}>
                        <TextField sx={{borderRadius:'0px'}} value={props.columnProperty.columnName} error={!isColumnFieldValid()}
                                label={whyColumnFieldNotValid()} onChange={handleColumnNameChange} fullWidth/>
                    </Box>
                    <Box sx={{ display: "flex", flex: 1 }}>
                        <FormControl className={classes.formControl}>
                            <InputLabel>Datatype</InputLabel>
                            <Select
                                labelId="demo-simple-select-helper-label"
                                id="demo-simple-select-helper"
                                label="Datatype"
                                value={props.columnProperty.columnDatatype}
                                onChange={handleColumnDataTypeChange}
                            >
                                <MenuItem value={ColumnDataType.INT}>Integer</MenuItem>
                                <MenuItem value={ColumnDataType.STRING}>String</MenuItem>
                                <MenuItem value={ColumnDataType.BOOLEAN}>Boolean</MenuItem>
                                <MenuItem value={ColumnDataType.FLOAT}>Float</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
                <Box sx={{m:-1}}>
                    <VirtualTagHandler
                        selectedTags={props.columnProperty.columnTags}
                        onSelectedTagsChange={handleColumnTagChange}
                        tagFilter={{Scope: TagScope.COLUMN}}
                        allowAdd={true}
                        allowDelete={true}
                        inputFieldLocation="TOP"
                    />
                </Box>
            </Box>
        </Card>
    )
}

const MemoizedColumnPropertiesSelector = (props) => {
    return React.useMemo(() => {
        return <ColumnPropertiesSelector
            columnProperty={props.columnProperty}
            columnIndex={props.columnIndex}
            setColumnProperty={props.setColumnProperty}
        />
    }, [props.columnProperty, props.columnIndex])
}

const formActionPropertiesForLoadTableIntoLocal = (fdsResponse, selectedFile, fileSchema) => {
    return {
        entityProperties: {
            Id: uuidv4(),
            DefinitionId: "12",
            Name: `Load Table(${selectedFile.name}) from S3`,
            DisplayName: `Load Table(${selectedFile.name}) from S3`,
            IsRecurring: false,
            RenderTemplate: false,
            ProviderInstanceId: "8"
        },
        tableSchema: fileSchema,
        SynchronousActionExecution: true,
        otherConfig: {
            filePath: fdsResponse.key
        }
    }
}

const isValidObjectName = (name) => {
    if (name !== undefined) {
        return !(name.includes(`"`) || name.length === 0)
    } else {
        return false;
    }
}

const getColor = (x) => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(i * x + i * x * x + i * x * x * x) % 16];
    }
    return color;
}

const getTypeOfValue = (dataPoints) => {
    const dataTypeList = dataPoints.map(dataPoint => {
        if (dataPoint === null || dataPoint === undefined) {
            return null;
        } else {
            if (typeof dataPoint === "number") {
                // if (Number(dataPoint) === dataPoint && dataPoint % 1 === 0) {
                //     return ColumnDataType.INT
                // } else {
                    return ColumnDataType.FLOAT
                // }
            } else if (typeof dataPoint === "boolean") {
                return ColumnDataType.BOOLEAN
            } else {
                return ColumnDataType.STRING
            }
        }
    }).filter(x => x !== null)

    if (dataTypeList.length === 0) {
        return ColumnDataType.STRING
    } else if (dataTypeList.every(dataType => dataType === ColumnDataType.BOOLEAN)) {
        return ColumnDataType.BOOLEAN
    } else if (dataTypeList.every(dataType => dataType === ColumnDataType.INT)) {
        return ColumnDataType.INT
    } else if (dataTypeList.every(dataType => dataType === ColumnDataType.INT || dataType === ColumnDataType.FLOAT)) {
        return ColumnDataType.FLOAT
    } else {
        return ColumnDataType.STRING
    }
}

const formCloseValidObjectName = (name) => {
    return name
}

export default ConfigureTableMetadata;
