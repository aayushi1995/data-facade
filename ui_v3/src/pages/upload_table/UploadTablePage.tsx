import {
    Box, Button, Grid,
} from '@mui/material';
import React from 'react';
import S3UploadState from '../../custom_enums/S3UploadState';
import ConfigureTableMetadata from './components/ConfigureTableMetadata';
import { SetModuleContextState } from "../../common/components/ModuleContext";
import { useContext , useEffect} from 'react';
import RecommendedApps from './components/RecommendedApps';
import UploadTableContextProvider, { SetUploadTableState, SetUploadTableStateContext, UploadTableState, UploadTableStateContext } from './context/UploadTablePageContext';

export type UploadTablePageProps = {
    file?: File,
    onCancel: Function
}

export const UploadTablePage = (props: UploadTablePageProps) => {
    const setModuleContext = useContext(SetModuleContextState)
    const uploadTableStateContext = React.useContext<UploadTableState>(UploadTableStateContext)
    const setUploadTableStateContext = React.useContext<SetUploadTableState>(SetUploadTableStateContext)

    React.useEffect(() => {
        setUploadTableStateContext({
            type: "SetFile",
            payload: {
                file: props?.file
            }
        })
    }, [ props?.file ])

    
    React.useEffect(() => {
        setModuleContext({
            type: "SetHeader",
            payload: {
                newHeader: {
                    Title: "Upload Wizard",
                    SubTitle: "Upload your CSV, Excel files from here"
                }
            }
        })
    }, [])


    return (
        <Box px={1} py={4}>
            <ConfigureTableMetadata onCancel={() => props?.onCancel?.()}/>
            <RecommendedApps tableId={uploadTableStateContext?.lastUploadedTableId}/>
        </Box>
    )
}

export default UploadTablePage;