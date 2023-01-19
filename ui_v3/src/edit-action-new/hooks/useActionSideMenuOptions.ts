import React from "react"
import { SetBuildActionContext } from "../../pages/build_action/context/BuildActionContext"


const useActionSideMenuOptions = () => {
    const setBuildActionContext = React.useContext(SetBuildActionContext)

    const handleOpenSettings = () => {
        setBuildActionContext({
            type: "ToggleSideSettings",
            payload: {}
        })
    }

    const handleOpenPastRuns = () => {
        setBuildActionContext({
            type: "ToggleDisplayPastRuns",
            payload: {}
        })
    }

    return {
        handleOpenSettings,
        handleOpenPastRuns
    }
}

export default useActionSideMenuOptions