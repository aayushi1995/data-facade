import { Autocomplete, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import useAddTrainingDataSetForm from "../hooks/useAddTrainingDataSetFrom"
import AddReference from "./AddReference"
import ParameterValues from "./ParameterValues"

export interface AddTrainingDataSetFormProps {
    onRecordAdded: Function
}

const AddTrainingDataSetForm = (props: AddTrainingDataSetFormProps) => {

    const {
        trainingDataSetState, 
        handleQuestionChange, 
        handleAnswerTypeChange, 
        handleReferenceValueChange, 
        setSelectedActionId, 
        selectedActionDefinitionId,
        onParameterValueChange,
        onTargetUserChange,
        handleAddRecord,
        onApplicationIdChange
    } = useAddTrainingDataSetForm(props)

    return (
        <Grid container direction="column" spacing={1}>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 3}}>
                <Typography sx={{width: '30%'}}>
                    Question
                </Typography>
                <TextField label="question" value={trainingDataSetState?.question} fullWidth multiline onChange={handleQuestionChange}/>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3}}>
                <Typography sx={{width: '30%'}}>
                    Answer Type
                </Typography>
                <FormControl fullWidth>
                    <InputLabel id="Answer Type">Answer Type</InputLabel>
                    <Select label="Answer Type" fullWidth labelId="Answer Type" value={trainingDataSetState?.answerType} onChange={handleAnswerTypeChange}>
                        <MenuItem value={"SQL"}>SQL</MenuItem>
                        <MenuItem value={"Python"}>Python</MenuItem>
                        <MenuItem value={"Action"}>Action</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3}}>
                <Typography sx={{width: '30%'}}>
                    Reference
                </Typography>
                <AddReference onApplicationIdChange={onApplicationIdChange} trainingData={trainingDataSetState} onActionReferenceValueChange={handleReferenceValueChange} setSelectedActionId={setSelectedActionId}/>
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3}}>
                <Typography sx={{width: '30%'}}>
                    Parameter Values
                </Typography>
                {selectedActionDefinitionId && <ParameterValues parameterValue={trainingDataSetState?.parameterValues} actionDefinitionId={selectedActionDefinitionId} onParameterValueChange={onParameterValueChange}/>}
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 3}}>
                <Typography sx={{width: '30%'}}>
                    Target Users
                </Typography>
                <Autocomplete 
                    options={["Sales", "Marketing", "All"]}
                    multiple
                    filterSelectedOptions
                    disableCloseOnSelect
                    fullWidth
                    onChange={(event, value, reason) => {
                        if(value !== null) {
                            onTargetUserChange(value)
                        }
                    }}
                    value={trainingDataSetState?.targetUser}
                    renderInput={(params) => (<TextField {...params} label="Target Users" />)}
                />
            </Grid>
            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={handleAddRecord}>
                    Add Record
                </Button>
            </Grid>
        </Grid>
    )

}

export default AddTrainingDataSetForm