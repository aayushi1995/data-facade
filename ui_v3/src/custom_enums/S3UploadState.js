import CheckOutlinedIcon from '@material-ui/icons/CheckOutlined';
import DoneAllOutlinedIcon from '@material-ui/icons/DoneAllOutlined';
import DoneOutlineOutlinedIcon from '@material-ui/icons/DoneOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import WarningOutlinedIcon from '@material-ui/icons/WarningOutlined';
import ThumbUpAltOutlinedIcon from '@material-ui/icons/ThumbUpAltOutlined';
import LoadingIndicator from '../common/components/LoadingIndicator'

const S3UploadState = {
    BUIDING_FILE_FOR_UPLOAD: {
        message: "Preparing File",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    FILE_BUILT_FOR_UPLOAD: {
        message: "File Prepared",
        colour: "#B3E283",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    NO_FILE_SELECTED: {
        message: "No File Selected",
        colour: "#E99497",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    PRESIGNED_URL_FETCH_LOADING: {
        message: "Authorising Upload",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    PRESIGNED_URL_FETCH_SUCCESS: {
        message: "Authorisation Successful",
        colour: "#B3E283",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    PRESIGNED_URL_FETCH_ERROR: {
        message: "Authorisation Failed",
        colour: "#E99497",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    S3_UPLOAD_LOADING: {
        message: "Uploading File",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 35, height: 35}}/>
    },
    S3_UPLOAD_SUCCESS: {
        message: "Upload Successful",
        colour: "#B3E283",
        icon: <DoneAllOutlinedIcon style={{fontSize: 45}}/>
    },
    S3_UPLOAD_ERROR: {
        message: "Upload Failed",
        colour: "#E99497",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    FDS_TABLE_FETCH_LOADING: {
        message: "Creating Load Table into System Action",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    FDS_TABLE_FETCH_ERROR: {
        message: "Load Table into System Action Creation Failed",
        colour: "#E99497",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    FDS_TABLE_FETCH_SUCCESS: {
        message: "Loading table into System",
        colour: "#B3E283",
        icon: <DoneOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    APPLICATION_UPLOADED: {
        message: "Application ready for parsing",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    APPLICATION_PARSED: {
        message: "Application Parsed Successfuly",
        colour: "#B3E283",
        icon: <DoneOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    PARSING_APPLICATION: {
        message: "Parsing Application",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    APPLICATION_PARSING_FAILED: (errorBody) => {
        const formMessage = () => {
            return JSON.stringify(errorBody, null, 4)
        }
        return {
            message: formMessage(),
            colour: "#E99497",
            icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
        }
        
    },
    SELECTED_FILE_OK: {
        message: "File Selected",
        colour: "#B3E283",
        icon: <ThumbUpAltOutlinedIcon style={{fontSize: 45}}/>
    },
    SELECTED_FILE_TOO_LARGE: {
        message: "Selected File Size exceeds 40 MB",
        colour: "#E99497",
        icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
    },
    SELECTED_FILE_NOT_CORRECT_FORMAT: (fileType) => {
        return {
            message: `Selected File not of type CSV. Selected File type: ${fileType}`,
            colour: "#E99497",
            icon: <WarningOutlinedIcon style={{fontSize: 45}}/>
        }
    }
}

export default S3UploadState;