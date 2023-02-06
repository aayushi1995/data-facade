import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import DoneOutlineOutlinedIcon from '@mui/icons-material/DoneOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import LoadingIndicator from '../common/components/LoadingIndicator';

const S3UploadState = {
    CREATING_TABLE_IN_SYSTEM_SUCCESS: {
        message: "Table Synced into System",
        colour: "#F3C583",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    CREATING_TABLE_IN_SYSTEM_FAILURE: {
        message: "Error while syncing Table into System",
        colour: "#F3C583",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    GENERATING_QUESTIONS_SUCCESS: {
        message: "Questions generated for table",
        colour: "#F3C583",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    GENERATING_QUESTIONS_ERROR: {
        message: "Questions could not be generated for this table",
        colour: "#F3C583",
        icon: <CheckOutlinedIcon style={{fontSize: 45}}/>
    },
    CREATING_TABLE_IN_SYSTEM: {
        message: "Table Sync in Progress",
        colour: "#F3C583",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
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
        message: "Loading Table into System",
        colour: "#F3C583",
        icon: <LoadingIndicator style={{width: 40, height: 40}}/>
    },
    FDS_TABLE_FETCH_ERROR: {
        message: "Loading Table into System Failed",
        colour: "#E99497",
        icon: <ErrorOutlineOutlinedIcon style={{fontSize: 45}}/>
    },
    FDS_TABLE_FETCH_SUCCESS: {
        message: "Loading Table into System Success",
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
    FETCHING_TABLE_QUESTIONS: {
        message: "Fetching Table Questions",
        colour: '#F3C583',
        icon: <LoadingIndicator style={{width: 35, height: 35}}/>
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
    SELECTED_FILE_OK: (fileName, fileSize) => {
        function formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
        
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        
            const i = Math.floor(Math.log(bytes) / Math.log(k));
        
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        }
        
        const formattedFileSize = formatBytes(fileSize)
        return {
            message: `${fileName}  ( ${formattedFileSize} )  Selected`,
            colour: "#B3E283",
            icon: <ThumbUpAltOutlinedIcon style={{fontSize: 45}}/>
        }
    },
    SELECTED_FILE_TOO_LARGE: {
        message: "Selected File Size exceeds 200 MB",
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