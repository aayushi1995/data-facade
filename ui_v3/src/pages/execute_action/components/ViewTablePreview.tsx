import { Dialog, DialogContent } from "@mui/material"
import React from "react"
import LoadingIndicator from "../../../common/components/LoadingIndicator"
import ActionDefinitionId from "../../../enums/ActionDefinitionId"
import ActionDefinitionPresentationFormat from "../../../enums/ActionDefinitionPresentationFormat"
import { TableProperties } from "../../../generated/entities/Entities"
import { TablePropertiesInfo } from "../../../generated/interfaces/Interfaces"
import { UseGetTableModel } from "../../table_browser/components/AllTableViewHooks"
import ViewActionExecutionOutput from "../../view_action_execution/ViewActionExecutionOutput"


interface ViewTablePrieviewProps {
    tableName?: string
    tablePreviewExecutionId?: string,
    showPreview: boolean,
    setShowPreview: (state: boolean) => void
}

const ViewTablePreview = (props: ViewTablePrieviewProps) => {
    console.log(props)
    const [tablePreviewExecutionId, setTablePreviewExecutionId] = React.useState<string | undefined>(props.tablePreviewExecutionId)

    const handleTableFetched = (data: TableProperties) => {
        const tableInfo = JSON.parse(data?.Info || "{}") as TablePropertiesInfo
        const executionId = tableInfo?.SyncOOBActionStatus?.find(oobAction => oobAction.ActionDefinitionId === ActionDefinitionId.TABLE_1000_ROWS)?.ActionExecutionId
        setTablePreviewExecutionId(executionId)
    }

    const tableModelQuery = UseGetTableModel({ options: {enabled: false, onSuccess: handleTableFetched}, tableName: props.tableName })

    const handlePreviewDialogClose = () => {
        props.setShowPreview(false)
    }

    React.useEffect(() => {
        if(!!props.tableName) {
            tableModelQuery.refetch()
        }
    }, [props.tableName])

    React.useEffect(() => {
        if(!!props.tablePreviewExecutionId) {
            setTablePreviewExecutionId(props.tablePreviewExecutionId)
        }
    }, [props.tablePreviewExecutionId])

    return (
        <Dialog open={props.showPreview} onClose={handlePreviewDialogClose} maxWidth="lg" fullWidth>
            <DialogContent>
                {tableModelQuery.isLoading || tableModelQuery.isRefetching? (
                    <LoadingIndicator/>
                ) : (<>
                    {tablePreviewExecutionId ? 
                        <ViewActionExecutionOutput 
                            ActionExecution={{Id: tablePreviewExecutionId}}
                            ActionInstance={{Name: "Table Preview"}}
                            ActionDefinition={{PresentationFormat: ActionDefinitionPresentationFormat.TABLE_VALUE}}
                        /> : <>Can't load table preview</>}
                </>)}
            </DialogContent>
        </Dialog>
    )

}

export default ViewTablePreview