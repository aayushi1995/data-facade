import React from 'react'
import {
    Box,
    Button,
    Grid,
    IconButton,
    TextField
} from '@mui/material'
import * as XLSX from 'xlsx/xlsx.mjs';

import './../../../css/table_browser/TableBrowser.css'
import S3UploadState from '../../../custom_enums/S3UploadState';
import labels from './../../../labels/labels'
import {convertToCsv} from './util'
import AddIcon from "@mui/icons-material/Add";

/*
    Parses a file to find valid tables
    [
        {
            "CsvFile": 
        }
    ]

*/

const SelectFileStep = (props) => {  
    const [selectedFile, setSelectedFile] = React.useState(props.uploadFile)
    
    React.useEffect(() => {
        if(!!props.uploadFile) {
            fileHandlers.forEach(fileHandlerConfig => {
                if(fileHandlerConfig.canProcess(props.uploadFile)) {
                    fileHandlerConfig.handler(props.uploadFile, fileParseSuccess, fileParseError)
                }
            })
        }
    }, [props.uploadFile])

    const fileHandlers = [
        {
            canProcess: (file) => file.type==="text/csv" | (getFileExtension(file)=="csv" & file.type==="application/vnd.ms-excel"),
            handler: csvFileHandler
        },
        {
            canProcess: (file) => file.type==="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            handler: xlsxFileHandler
        }
    ]

    const getFileExtension = (file) => file.name.split(".").pop()
    const fileParseSuccess = (tables) => {
        props.nextStep({Tables: tables})
    }

    const fileParseError = (errors) => {
        console.log(errors)
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Grid item xs={12}>
                {labels.UploadTableButton.DIRECTION}
                </Grid>
            </Grid>
        </Grid>
    )
}

const csvFileHandler = (file, fileParseSuccess, fileParseError) => {
    const tableObject = {
        CsvFile: file
    }
    const tables = [tableObject]
    fileParseSuccess(tables)
}

const xlsxFileHandler = async (file, fileParseSuccess, fileParseError) => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = (e) => {
        const bufferedArray = e.target.result;
        const wb = XLSX.read(bufferedArray, { type: 'buffer' });
        const parsedCsvFilesPromises = convertToCsv(wb)
        parsedCsvFilesPromises.then((results) => {
            const parsedCsvFiles = results.
            filter(settledPromise => settledPromise.status === 'fulfilled').
            map(fulfilledPromise => fulfilledPromise.value)

            const tables = parsedCsvFiles.map(file => {return { CsvFile: file}})
            fileParseSuccess(tables)
        })
    }

    fileReader.onerror = (error) => {
        fileParseError(error)
    };
}

export default SelectFileStep;