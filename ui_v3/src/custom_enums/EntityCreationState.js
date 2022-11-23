import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import LoadingIndicator from '../common/components/LoadingIndicator'
import EntityCreationRequestState from './RequestState.js'

const EntityCreationState = {
    [EntityCreationRequestState.LOADING]: {
        messageP: "Sending Request",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    [EntityCreationRequestState.SUCCESS]: {
        messageP: "Request sent Successully",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    [EntityCreationRequestState.ERROR]: {
        messageP: "Request Error",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    [EntityCreationRequestState.NO_OP]: {
        messageP: "",
        icon: <></>
    }
}

export default EntityCreationState;