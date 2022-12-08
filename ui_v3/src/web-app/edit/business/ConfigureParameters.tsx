import { Step, StepButton, Stepper, Box, FormControl, Select, MenuItem } from "@mui/material"
import { ReactQueryWrapper } from "../../../common/components/ReactQueryWrapper"
import { WebAppActionDefition } from "../context/EditWebAppContextProvider"
import useConfigureWebAppActionParameters from "../hooks/useConfigureWebAppActionParameters"


interface ConfigureParameterProps {
    action: WebAppActionDefition
}

const ConfigureWebActionParameters = ({action}: ConfigureParameterProps) => {
    console.log(action)

    const {parameters, changeParameterIndex, fetchActionDetailsQuery, activeParameterIndex} = useConfigureWebAppActionParameters({action: action})

    return (
        <ReactQueryWrapper {...fetchActionDetailsQuery}>
            {() => (
                <Box sx={{display: 'flex', m: 2, flexDirection: 'column', gap: 2}}>
                    <Stepper activeStep={activeParameterIndex} nonLinear>
                        {parameters.map((parameter, index) => {
                            return (
                                <Step key={parameter.DisplayName!}>
                                    <StepButton onClick={() => changeParameterIndex(index)}>
                                        {parameter.DisplayName || parameter.ParameterName || "Name NA"}
                                    </StepButton>
                                </Step>
                            )
                        } )}
                    </Stepper>
                    <Box sx={{display: 'flex', width: '100%', gap: 2, flexDirection: 'column', mt: 2}}>
                        <FormControl sx={{width: '100%', mt: 1}}>
                            <Select
                                value={"Yes"}
                                fullWidth
                                // onChange={(event?: SelectChangeEvent<string>) => handleUserInputRequiredChange?.(event?.target?.value)}
                                // disabled={params?.row?.parameter?.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST}
                                placeholder="Not Configured"
                                label="User Input Required"
                            >
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            )}
        </ReactQueryWrapper>
        
    )

}

export default ConfigureWebActionParameters