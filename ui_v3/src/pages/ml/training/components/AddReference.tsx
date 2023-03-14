import { Autocomplete, Box, TextField } from "@mui/material"
import CodeEditor from "../../../../common/components/CodeEditor"
import { ReactQueryWrapper } from "../../../../common/components/error-boundary/ReactQueryWrapper"
import TemplateLanguage from "../../../../enums/TemplateLanguage"
import useAddReference from "../hooks/useAddReference"
import { TrainingDataRow } from "../TrainingDataSetHomePage"


export interface AddReferenceProps {
    trainingData?: TrainingDataRow,
    onActionReferenceValueChange: (value: string) => void,
    setSelectedActionId: (value?: string) => void,
    onApplicationIdChange: (value?: string) => void
}

const AddReference = (props: AddReferenceProps) => {

    const {fetchAllActionsNameAndId, fetchAllApplications, getActionValue, onActionSelect} = useAddReference(props)

    const ActionComponent = (
        <ReactQueryWrapper 
            isLoading={fetchAllActionsNameAndId.isLoading || fetchAllApplications.isLoading} 
            error={fetchAllActionsNameAndId.error} 
            data={fetchAllActionsNameAndId.data}>
                {() => 
                        <Autocomplete
                            value={getActionValue()}
                            fullWidth
                            filterSelectedOptions
                            options={fetchAllActionsNameAndId.data || []}
                            renderInput={(params) => <TextField {...params} fullWidth label="Select Action"/>}
                            getOptionLabel={(option) => option.DisplayName || option.UniqueName || "Name NA"}
                            onChange={(event, value, reason) => {
                                if(value !== null) {
                                    onActionSelect(value)
                                }
                                
                            }}
                    />
                }
        </ReactQueryWrapper>
    )

    const SqlComponent = (
        <Box sx={{width: '100%'}}>
            <CodeEditor language={TemplateLanguage.SQL} onCodeChange={props.onActionReferenceValueChange}/>
        </Box>
    )

    const PythonComponent = (
        <Box sx={{width: '100%'}}>
            <CodeEditor language={TemplateLanguage.PYTHON} onCodeChange={props.onActionReferenceValueChange}/>
        </Box>
    )

    switch(props.trainingData?.answerType) {
        case "Action": return ActionComponent
        case "SQL": return SqlComponent
        case "Python": return PythonComponent
        default: return <>Unkown Answer Type</>
    }

    return <></>
    
}

export default AddReference