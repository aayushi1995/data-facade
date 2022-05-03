import {
    Box, Button, Grid,
    TextField
} from '@mui/material';
import React from 'react';
import S3UploadState from './../../custom_enums/S3UploadState';
import ConfigureTableMetadata from './components/ConfigureTableMetadata';
import SelectFileStep from './components/SelectFileStep';
import SelectTableStep from './components/SelectTableStep';







export const UploadTablePage = (props) => {
    const uploadButtonRef = React.useRef(null)
    const [uploadState, setUploadState] = React.useState(S3UploadState.NO_FILE_SELECTED)
    const [selectedFile, setSelectedFile] = React.useState()
    const [activeStep, setActiveStep] = React.useState({
        stepIndex: 0,
        stepProps: {}
    })


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

    const prevStep = () => {

    }

    const changeHandler = (event) => {
        const file = event.target.files[0];
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
                setUploadState(S3UploadState.SELECTED_FILE_OK);
            }
        }
    };

    React.useEffect(() => {
        console.log(uploadButtonRef)
        uploadButtonRef.current.click()
    }, [])

    return (
        <Box px={1} py={2}>
            <Grid container spacing={5}>
                { (activeStep.stepIndex===0) &&<Grid item xs={12}>
                    <SelectFileStep nextStep={nextStep} prevStep={prevStep} setUploadState={setUploadState} {...activeStep.stepProps}/>
                </Grid> }
                { (activeStep.stepIndex===1) &&<Grid item xs={12}>
                    <SelectTableStep nextStep={nextStep} prevStep={prevStep} setUploadState={setUploadState} {...activeStep.stepProps}/>
                </Grid> }
                { (activeStep.stepIndex===2) &&<Grid item xs={12}>
                    <ConfigureTableMetadata nextStep={nextStep} prevStep={prevStep} setUploadState={setUploadState} {...activeStep.stepProps}/>
                </Grid> }
                <Grid container item xs={12}>
                    <Grid item xs={5}>
                        <Button variant="contained" component="label" classes={{ root: "select-all" }}>
                            Select File
                            <input ref={uploadButtonRef} type="file" accept={".csv,.xlsx"} hidden onChange={changeHandler} onClick={(event) => {event.target.value=''}}/>
                        </Button>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            disabled
                            multiline
                            rows={1}
                            fullWidth
                            id="outlined-disabled"
                            label="Status"
                            rowsMax="4"
                            value={uploadState.message}
                        />
                    </Grid>
                    <Grid container item xs={2} justifyContent="center">
                        <Grid item xs={6} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>{uploadState.icon}</Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    )
}

export default UploadTablePage;