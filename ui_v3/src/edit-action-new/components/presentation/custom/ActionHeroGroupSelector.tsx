import { Autocomplete } from "@mui/material";
import ActionDefinitionActionGroups from "../../../../enums/ActionDefinitionActionGroups";
import { ActionHeaderAutoCompleteTextField } from "../styled_native/ActionHeaderTextField";

type ActionHeroGroupSelectorProps = {
    selectedGroup?: string,
    onSelectedGroupChange?: (selectedGroup?: string) => void
}

function ActionHeroGroupSelector(props: ActionHeroGroupSelectorProps) {
    return (
        <Autocomplete
            options={Object.entries(ActionDefinitionActionGroups).map(([groupKey, groupName]) => groupName)}
            renderInput={(params) => <ActionHeaderAutoCompleteTextField {...params} label="Add to Group"/>}
            filterSelectedOptions
            fullWidth
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            value={props?.selectedGroup || null}
            isOptionEqualToValue={(option, value) => option===value}
            onChange={(event, value, reason, details) => (reason==="selectOption" && value!==null) && props?.onSelectedGroupChange?.(value)}
        />
    )
}

export default ActionHeroGroupSelector;