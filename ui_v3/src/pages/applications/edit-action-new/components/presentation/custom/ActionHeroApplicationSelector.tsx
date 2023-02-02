import { Autocomplete } from "@mui/material"
import { ReactQueryWrapper } from "../../../../../../common/components/error-boundary/ReactQueryWrapper"
import { Application } from "../../../../../../generated/entities/Entities"
import useApplicationSelector from "../../../hooks/useApplicationSelector"
import { ActionHeaderAutoCompleteTextField } from "../styled_native/ActionHeaderTextField"

type ActionHeroApplicationSelectorProps = {
    selectedApplicationId?: string,
    onSelectedApplicationChange?: (selectedApplication?: Application) => void
}

function ActionHeroApplicationSelector(props: ActionHeroApplicationSelectorProps) {
    const { applicationQuery, selectedApplication, onSelectedApplicationChange } = useApplicationSelector(props)
    //TODO: Selected App not visible
    return (
        <ReactQueryWrapper
            isLoading={applicationQuery.isLoading}
            data={applicationQuery.data}
            error={applicationQuery.error}
            children={() =>
                <Autocomplete
                    options={applicationQuery.data!}
                    getOptionLabel={(application: Application) => application.Name || "Name NA"}
                    renderInput={(params) => <ActionHeaderAutoCompleteTextField {...params} label="Add to Application"/>}
                    filterSelectedOptions
                    fullWidth
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    value={selectedApplication || null}
                    isOptionEqualToValue={(option, value) => option?.Id===value?.Id}
                    onChange={(event, value, reason, details) => (reason==="selectOption" && value!==null) && onSelectedApplicationChange(value)}
                />
            }
        />
    )
}

export default ActionHeroApplicationSelector;