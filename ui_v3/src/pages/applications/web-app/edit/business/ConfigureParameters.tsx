import { Box, FormControl, MenuItem, Select, Step, StepButton, Stepper } from "@mui/material"
import { ReactQueryWrapper } from "../../../../../common/components/error-boundary/ReactQueryWrapper"
import ParameterDefinitionsConfigPlane from "../../../../../common/components/parameters/ParameterDefinitionsConfigPlane"
import ActionParameterDefinitionDatatype from "../../../../../enums/ActionParameterDefinitionDatatype"
import useConfigureWebAppActionParameters from "../hooks/useConfigureWebAppActionParameters"
import WebAppGlobalParameterHandler from "./WebAppGlobalParameterHandler"


interface ConfigureParameterProps {
    actionReference: string
}

const ConfigureWebActionParameters = ({actionReference}: ConfigureParameterProps) => {

    const {
        parameters, 
        changeParameterIndex, 
        fetchActionDetailsQuery, 
        activeParameterIndex, 
        findParameterReferenceInAction, 
        handleUserInputRequiredChange, 
        getUpstreamWebAppActions,
        handleDefaultValueChange} = useConfigureWebAppActionParameters({actionReference: actionReference})

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
                                value={findParameterReferenceInAction(parameters[activeParameterIndex])?.UserInputRequired}
                                fullWidth
                                onChange={handleUserInputRequiredChange}
                                disabled={parameters[activeParameterIndex]?.Datatype === ActionParameterDefinitionDatatype.COLUMN_NAMES_LIST}
                                label="User Input Required"
                            >
                                <MenuItem value={"Yes"}>Yes</MenuItem>
                                <MenuItem value={"No"}>No</MenuItem>
                            </Select>
                        </FormControl>
                        {findParameterReferenceInAction(parameters[activeParameterIndex])?.UserInputRequired === "No" ? (
                            <ParameterDefinitionsConfigPlane 
                                parameterDefinitions={[parameters[activeParameterIndex]]} 
                                parameterInstances={[{...findParameterReferenceInAction(parameters[activeParameterIndex]), ActionParameterDefinitionId: parameters[activeParameterIndex].Id} || {}]}
                                handleChange={handleDefaultValueChange}
                                fromWebAppDefaultValue={true}
                                upstreamWebAppActions={getUpstreamWebAppActions()}
                            />
                        ) : (
                            <WebAppGlobalParameterHandler actionReference={actionReference} currentParameter={parameters[activeParameterIndex]} currentParameterInstance={findParameterReferenceInAction(parameters[activeParameterIndex]) || {}} />
                        )}
                    </Box>
                </Box>
            )}
        </ReactQueryWrapper>
        
    )

}

export default ConfigureWebActionParameters