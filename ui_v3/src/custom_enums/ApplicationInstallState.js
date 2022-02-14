import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import LoadingIndicator from '../common/components/LoadingIndicator'

const ApplicationInstallState = {
    NO_INSTALL_IN_PROGRESS: {
        messageP: "Enter Application Install Key",
        messageS: "",
        colour: "#E99497",
        icon: null
    },
    INSTALL_IN_PROGRESS: {
        messageP: "Installing Application",
        messageS: "",
        colour: "#E99497",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    INSTALL_FAILED: {
        messageP: "Application Install Failed",
        messageS: "",
        colour: "#E99497",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    INSTALL_SUCCESSFUL: {
        messageP: "Application Install Successful",
        messageS: "",
        colour: "#E99497",
        icon: <DoneOutlineOutlinedIcon style={{fontSize: 45}}/>
    }
}

export default ApplicationInstallState;