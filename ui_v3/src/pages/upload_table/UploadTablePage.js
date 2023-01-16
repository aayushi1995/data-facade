import {
    Box, Button, Grid,
} from '@mui/material';
import React from 'react';
import S3UploadState from './../../custom_enums/S3UploadState';
import ConfigureTableMetadata from './components/ConfigureTableMetadata';
import SelectFileStep from './components/SelectFileStep';
import SelectTableStep from './components/SelectTableStep';
import { SetModuleContextState } from "../../../src/common/components/ModuleContext";
import { useContext , useEffect} from 'react';
import RecommendedApps from './components/RecommendedApps';


export const UploadTablePage = (props) => {
    const [lastUploadedTableId, setLastUploadedTableId] = React.useState()
    const [uploadState, setUploadState] = React.useState(S3UploadState.NO_FILE_SELECTED)
    const [activeStep, setActiveStep] = React.useState({
        stepIndex: 0,
        stepProps: {}
    })

    React.useEffect(() => {
        if(!!props?.file) {
            changeHandler(props?.file)
        }
    }, [ props?.file ])

    const setModuleContext = useContext(SetModuleContextState)
    useEffect(() => {
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

    const nextStep = (nextStepProps, nextStepIndex) => {
        setActiveStep(oldActiveStep => {
            const getNewStepIndex = () => {
                if(nextStepIndex === undefined){
                    return oldActiveStep.stepIndex + 1;
                } else {
                    return nextStepIndex
                }
            }

            return {
                stepIndex: getNewStepIndex(),
                stepProps: nextStepProps
            }
        })
    }
    const prevStep = () => {}

    const changeHandler = (file) => {
        if (file !== undefined) {
            if (file.size > 200000000) {
                setUploadState(S3UploadState.SELECTED_FILE_TOO_LARGE);
            } else if(!(file.type === "text/csv" | file.type === "application/vnd.ms-excel" | file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                setUploadState(S3UploadState.SELECTED_FILE_NOT_CORRECT_FORMAT(file.type));
            } else {
                setActiveStep({
                    stepIndex: 0,
                    stepProps: {
                        uploadFile: file
                    }
                })
                setUploadState(S3UploadState.SELECTED_FILE_OK(file.name, file.size));
            }
        }
    };


    return (
        <Box px={1} py={4}>
            <Grid container spacing={5}>
                { (activeStep.stepIndex===0) &&<Grid item xs={12}>
                    <SelectFileStep nextStep={nextStep} prevStep={prevStep} setUploadState={setUploadState} {...activeStep.stepProps}/>
                </Grid> }
                { (activeStep.stepIndex===1) &&<Grid item xs={12}>
                    <SelectTableStep nextStep={nextStep} prevStep={prevStep} setUploadState={setUploadState} {...activeStep.stepProps}/>
                </Grid> }
                { (activeStep.stepIndex===2) &&<Grid item xs={12}>
                    <ConfigureTableMetadata nextStep={nextStep} prevStep={prevStep} stateData={uploadState.message} setUploadState={setUploadState} setLastUploadedTableId={setLastUploadedTableId} onCancel={() => props?.onCancel?.()}{...activeStep.stepProps}/>
                    <RecommendedApps tableId={lastUploadedTableId}/>
                </Grid> }
                
            </Grid>
        </Box>
    )
}

export default UploadTablePage;