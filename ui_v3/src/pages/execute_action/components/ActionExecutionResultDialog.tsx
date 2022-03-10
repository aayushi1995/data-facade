import { Typography } from "@material-ui/core";
import { Box, Button } from "@mui/material";
import QueryData from "../../../common/components/QueryData";
import { ActionDefinition, ActionExecution } from "../../../generated/entities/Entities";
import useActionExecutionParsedOutput from "../hooks/useActionExecutionParsedOutput";

export interface ActionExecutionResultDialogProps {
    actionDefinition?: ActionDefinition,
    actionExecution?: ActionExecution
}

const ActionExecutionResultDialog = (props: ActionExecutionResultDialogProps) => {
    const { actionDefinition, actionExecution } = props
    const useActionExecutionParsedOutputQuery = useActionExecutionParsedOutput({ actionExecutionFilter: actionExecution, queryOptions: {}})

    const viewResult = () => {
        useActionExecutionParsedOutputQuery.refetch()
    }

    const formQueryDataComponent = () => {
        if(useActionExecutionParsedOutputQuery.isLoading) {
            return <>Loading...</>
        } else if(!!useActionExecutionParsedOutputQuery.error) {
            return <>{JSON.stringify(useActionExecutionParsedOutputQuery.error)}</>
        } else if(!!useActionExecutionParsedOutputQuery.data){
            const queryDataProps = {
                props: [useActionExecutionParsedOutputQuery.data.Output]
            }
            return <QueryData {...queryDataProps}/>
        } else {
            return <>UNKNOWN</>
        }
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box>
                <Typography>
                    Review Results in Insights using a Interactive Dashboard or Download csv  
                </Typography>
            </Box>
            <Box>
                {formQueryDataComponent()}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 4, justifyContent: "center"}}>
                <Box>
                    <Button variant="contained" onClick={viewResult}>
                        View Results
                    </Button>
                </Box>
                <Box>
                    <Button variant="contained">
                        Download File
                    </Button>
                </Box>
                <Box>
                    <Button variant="contained">
                        Export Results
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default ActionExecutionResultDialog;