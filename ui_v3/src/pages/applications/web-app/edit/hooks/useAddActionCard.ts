import React from "react"


const useAddActionCard = () => {

    const [actionReferenceNameDialogState, setActionReferenceNameDialogState] = React.useState(false)
    const [actionReferenceName, setActionReferenceName] = React.useState<string | undefined>()

    const onChangeDialogState = () => {
        setActionReferenceNameDialogState(state => !state)
    }

    const onReferenceNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setActionReferenceName(event.target.value)
    }

    return {
        actionReferenceNameDialogState,
        onChangeDialogState,
        actionReferenceName,
        onReferenceNameChange
    }
}

export default useAddActionCard