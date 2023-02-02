import React from "react"
import { SetBuildActionContext } from "../../build_action_old/context/BuildActionContext"


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

    const handleOpenDependencies = () => {
        setBuildActionContext({
            type: "ToggleDisplayDependenciesAction",
            payload: {}
        })
    }

    return {
        handleOpenSettings,
        handleOpenPastRuns,
        handleOpenDependencies
    }
}

export default useActionSideMenuOptions