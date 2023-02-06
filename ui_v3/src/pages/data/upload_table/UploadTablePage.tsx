import {
    Box, Typography
} from '@mui/material';
import React, { useContext } from 'react';
import { useMutation } from 'react-query';
import LoadingIndicator from '../../../common/components/LoadingIndicator';
import { SetModuleContextState } from "../../../common/components/main_module/context/ModuleContext";
import dataManager from '../../../data_manager/data_manager';
import ExternalStorageUploadRequestContentType from '../../../enums/ExternalStorageUploadRequestContentType';
import ConfigureTableMetadata from './components/ConfigureTableMetadata';
import RecommendedApps from './components/RecommendedApps';
import RecommendedQuestions from './components/RecommendedQuestions';
import { SetUploadTableState, SetUploadTableStateContext, UploadTableState, UploadTableStateContext } from './context/UploadTablePageContext';

const dataManagerInstance = dataManager.getInstance as { s3PresignedDownloadUrlRequest: Function, s3DownloadRequest: Function }


export type UploadTablePageProps = {
    file?: File,
    s3Url?: string,
    s3UrlProviderInstanceId?: string,
    onCancel: Function
}

export const UploadTablePage = (props: UploadTablePageProps) => {
    const setModuleContext = useContext(SetModuleContextState)
    const uploadTableStateContext = React.useContext<UploadTableState>(UploadTableStateContext)
    const setUploadTableStateContext = React.useContext<SetUploadTableState>(SetUploadTableStateContext)

    const getPresignedDownloadUrlMutation = useMutation<{requestUrl: string, headers: Object}, unknown, { path: string, s3UrlProviderInstanceId?: string }, unknown>(["Download"], 
        ({ path, s3UrlProviderInstanceId }) => {
            return dataManagerInstance.s3PresignedDownloadUrlRequest(path, 10, ExternalStorageUploadRequestContentType.PUBLISHED_OUTPUT, s3UrlProviderInstanceId)
        }
    )

    const downloadFromS3Mutation = useMutation<any, unknown, {requestUrl: string, headers: Object}, any>(
        "DownloadFromS3",
        (config) => dataManagerInstance.s3DownloadRequest(config.requestUrl, config.headers)
    )

    React.useEffect(() => {
        setUploadTableStateContext({
            type: "SetFile",
            payload: {
                file: props?.file
            }
        })
    }, [ props?.file ])


    React.useEffect(() => {
        if(props?.s3Url !== undefined) {
            getPresignedDownloadUrlMutation.mutate({ path: props?.s3Url, s3UrlProviderInstanceId: props?.s3UrlProviderInstanceId }, {
                onSuccess(data, variables, context) {
                    downloadFromS3Mutation.mutate(
                        {
                            requestUrl: data.requestUrl,
                            headers: data.headers
                        },
                        {
                            onSuccess: (s3DownloadData, s3DownloadVariables, s3DownloadContext) => {
                                const file = new File([s3DownloadData], getFileName(props?.s3Url), { type: "text/csv" })
                                setUploadTableStateContext({
                                    type: "SetFile",
                                    payload: {
                                        file: file
                                    }
                                })
                            },
                            onError(error, variables, context) {
                                console.log(error)
                            },
                        }
                    )
                },
                onError(error, variables, context) {
                },
            })
        }
    }, [props?.s3Url])

    
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


    if(getPresignedDownloadUrlMutation.isLoading || downloadFromS3Mutation.isLoading) {
        return <LoadingIndicator/>
    } else if(getPresignedDownloadUrlMutation.error || downloadFromS3Mutation.error) {
        const error = getPresignedDownloadUrlMutation.error || "" + downloadFromS3Mutation.error || ""
        return <Typography>{error}</Typography>
    } else {
        return (
            <Box px={1} py={4} sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <ConfigureTableMetadata onCancel={() => props?.onCancel?.()}/>
                {uploadTableStateContext.recommenedQuestions && <RecommendedQuestions recommenedQuestions={uploadTableStateContext.recommenedQuestions}/>}
                <RecommendedApps tableId={uploadTableStateContext?.lastUploadedTableId}/>
            </Box>
        )
    }
}

const getFileName = (s3Url?: string) => s3Url?.split("/").at(-2)+".csv"

export default UploadTablePage;