import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import LoadingIndicator from '../common/components/LoadingIndicator'
import SyncIcon from '@mui/icons-material/Sync';

const S3DownloadState = {
    TABLE_EXISTENCE_LOADING: {
        messageP: "Fetching Table Availability",
        messageS: "Checking if Table has been prepped and is available for download",
        colour: "#E99497",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    TABLE_NOT_EXISTS_SUCCESS: {
        messageP: "Table Not Available",
        messageS: "Please Prep the Table. Once it is prepped for download, it will be available here",
        colour: "#E99497",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    TABLE_EXISTS_SUCCESS: {
        messageP: "Table Available",
        messageS: "Download should start soon.",
        colour: "#E99497",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    TABLE_EXISTENCE_ERROR: {
        messageP: "Table Check Failed",
        messageS: "Please Retry",
        colour: "#E99497",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    NO_ACTION: {
        messageP: "Try to Download",
        messageS: "If table is prepped, download should initiate",
        colour: "#E99497",
        icon: <SyncIcon style={{fontSize: 45}}/>
    },
    FILE_DOWNLOAD_LOADING: {
        messageP: "Downloading Table",
        messageS: "The table is being downloaded",
        colour: "#E99497",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    FILE_DOWNLOAD_ERROR: {
        messageP: "Table Download Failed",
        messageS: "Table download failed due to some reason. Check your connectivity and try again.",
        colour: "#E99497",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    FILE_DOWNLOAD_SUCCESSFUL: {
        messageP: "Table Download Successful",
        messageS: "Table has been downloaded successfully",
        colour: "#E99497",
        icon: <DoneOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    PRESIGNED_URL_FETCH_LOADING: {
        messageP: "Authorising Download",
        messageS: "",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    PRESIGNED_URL_FETCH_SUCCESS: {
        messageP: "Authorisation Successful",
        messageS: "",
        colour: "#B3E283",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    PRESIGNED_URL_FETCH_ERROR: {
        messageP: "Authorisation Failed",
        messageS: "",
        colour: "#E99497",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    UPLOADING_TO_STORAGE_SERVER_ACTION_CREATION_LOADING: {
        messageP: "Creating Table Prep Action",
        messageS: "Creating an Action to Prep the Table for Downlaod Availability",
        colour: "#E99497",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    UPLOADING_TO_STORAGE_SERVER_ACTION_CREATION_SUCCESS: {
        messageP: "Prep Action Created",
        messageS: "The Table is being prepped and should be available for download shortly",
        colour: "#E99497",
        icon: <DoneAllOutlinedIcon style={{fontSize: 45}}/>
    },
    UPLOADING_TO_STORAGE_SERVER_ACTION_CREATION_ERROR: {
        messageP: "Prep Action Creation Failed",
        messageS: "Prep Action Creation failed due to some reason. Check your connectivity and try again.",
        colour: "#E99497",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    TABLE_PREP_IN_PROGRESS: {
        messageP: "Table is being Prepped",
        messageS: "Downlaod actions have been disabled until the Table is prepped.",
        colour: "#E99497",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    }
}

export default S3DownloadState;