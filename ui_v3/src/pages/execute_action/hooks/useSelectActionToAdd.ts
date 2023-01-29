import React from "react"
import { SelectActionCardProps } from "../../../common/components/workflow/create/SelectActionCard"
import { DetailViewProps } from "../../upload_table/components/RecommendedApps"
import { SelectActionToAddProps } from "../components/SelectActionToAdd"


const useSelectActionToAdd = (props: SelectActionToAddProps) => {

    const [actionSearchQuery, setActionSearchQuery] = React.useState("")

    const handleActionSearchQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActionSearchQuery(event.target.value)
    }

    const formDetailViewProps: () => DetailViewProps = () => {
        return {
            searchQuery: actionSearchQuery,
            fromAddActionView: true,
            onAddAction: props.handlers.onActionAddHandler
        }
    }

    return {
        actionSearchQuery,
        handleActionSearchQueryChange,
        detailViewProps: formDetailViewProps()
    }

}

export default useSelectActionToAdd