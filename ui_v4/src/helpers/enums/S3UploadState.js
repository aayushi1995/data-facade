

const S3UploadState = {
    UPLOADING: {
        message: "Uploading...",
        colour: "#F3C583",
        icon: <></>
    },
    UPLOAD_COMPLETED_SUCCESSFULLY: {
        message: "Uploaded Successfully",
        colour: "#F3C583",
        icon: <></>
    },
    CREATING_TABLE_IN_SYSTEM_SUCCESS: {
        message: "Table Synced into System",
        colour: "#F3C583",
        icon: <></>
    },
    CREATING_TABLE_IN_SYSTEM_FAILURE: {
        message: "Error while syncing Table into System",
        colour: "#F3C583",
        icon: <></>
    },
    GENERATING_QUESTIONS_SUCCESS: {
        message: "Questions generated for table",
        colour: "#F3C583",
        icon: <></>
    },
    GENERATING_QUESTIONS_ERROR: {
        message: "Questions could not be generated for this table",
        colour: "#F3C583",
        icon: <></>
    },
    GENERATING_QUESTIONS: {
        message: "Finding some insights for this table",
        colour: "#F3C583",
        icon: <></>
    },
    CREATING_TABLE_IN_SYSTEM: {
        message: "Table Sync in Progress",
        colour: "#F3C583",
        icon: <></>
    },
    BUIDING_FILE_FOR_UPLOAD: {
        message: "Preparing File",
        colour: "#F3C583",
        icon: <></>
    },
    FILE_BUILT_FOR_UPLOAD: {
        message: "File Prepared",
        colour: "#B3E283",
        icon: <></>
    },
    NO_FILE_SELECTED: {
        message: "No File Selected",
        colour: "#E99497",
        icon: <></>
    },
    PRESIGNED_URL_FETCH_LOADING: {
        message: "Authorising Upload",
        colour: "#F3C583",
        icon: <></>
    },
    PRESIGNED_URL_FETCH_SUCCESS: {
        message: "Authorisation Successful",
        colour: "#B3E283",
        icon: <></>
    },
    PRESIGNED_URL_FETCH_ERROR: {
        message: "Authorisation Failed",
        colour: "#E99497",
        icon: <></>
    },
    S3_UPLOAD_LOADING: {
        message: "Uploading File",
        colour: "#F3C583",
        icon: <></>
    },
    S3_UPLOAD_SUCCESS: {
        message: "Upload Successful",
        colour: "#B3E283",
        icon: <></>
    },
    S3_UPLOAD_ERROR: {
        message: "Upload Failed",
        colour: "#E99497",
        icon: <></>
    },
    FDS_TABLE_FETCH_LOADING: {
        message: "Loading Table into System",
        colour: "#F3C583",
        icon: <></>
    },
    FDS_TABLE_FETCH_ERROR: {
        message: "Loading Table into System Failed",
        colour: "#E99497",
        icon: <></>
    },
    FDS_TABLE_FETCH_SUCCESS: {
        message: "Loading Table into System Success",
        colour: "#B3E283",
        icon: <></>
    },
    APPLICATION_UPLOADED: {
        message: "Application ready for parsing",
        colour: "#F3C583",
        icon: <></>
    },
    APPLICATION_PARSED: {
        message: "Application Parsed Successfuly",
        colour: "#B3E283",
        icon: <></>
    },
    PARSING_APPLICATION: {
        message: "Parsing Application",
        colour: "#F3C583",
        icon: <></>
    },
    FETCHING_TABLE_QUESTIONS: {
        message: "Fetching Table Questions",
        colour: '#F3C583',
        icon: <></>
    },
    APPLICATION_PARSING_FAILED: (errorBody) => {
        const formMessage = () => {
            return JSON.stringify(errorBody, null, 4)
        }
        return {
            message: formMessage(),
            colour: "#E99497",
            icon: <></>
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
            icon: <></>
        }
    },
    SELECTED_FILE_TOO_LARGE: {
        message: "Selected File Size exceeds 200 MB",
        colour: "#E99497",
        icon: <></>
    },
    SELECTED_FILE_NOT_CORRECT_FORMAT: (fileType) => {
        return {
            message: `Selected File not of type CSV. Selected File type: ${fileType}`,
            colour: "#E99497",
            icon: <></>
        }
    }
}

export default S3UploadState;
