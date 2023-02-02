/*
Business logic for ui_v3/src/edit-action-new/components/presentation/custom/ActionHeroApplicationSelector.tsx
*/

import { Application } from "../../../../generated/entities/Entities"
import useGetApplications from "../../workflow/hooks/useGetApplications"

type UseApplicationSelectorParams = {
    selectedApplicationId?: string,
    onSelectedApplicationChange?: (selectedApplication?: Application) => void
}

function useApplicationSelector(params: UseApplicationSelectorParams) {
    const applicationQuery = useGetApplications({ options: { }, filter: {} })
    const selectedApplication = applicationQuery?.data?.find(application => application?.Id === params?.selectedApplicationId)
    const onSelectedApplicationChange = (newApplication?: Application) => {
        params?.onSelectedApplicationChange?.(newApplication)
    }

    return { applicationQuery, selectedApplication, onSelectedApplicationChange }
}

export default useApplicationSelector;