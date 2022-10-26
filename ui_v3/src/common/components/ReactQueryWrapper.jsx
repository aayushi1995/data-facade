import { Box } from "@mui/material";
import ErrorBoundry from './ErrorBoundry';
import LoadingIndicator from "./LoadingIndicator";
import NoData from "./NoData";

const _ReactQueryWrapper = ({
    isLoading,
    error,
    data,
    sx,
    children = () => <></>
}) => {
    let El;
    if (isLoading) {
        El =  <Box sx={sx}><LoadingIndicator /></Box>
    } else if (error || (!isLoading && (!data || data?.length <= 0) )) {
        El = children();
    } else {
        El = children();
    }
    return El;
}

export const ReactQueryWrapper = (props) => <ErrorBoundry><_ReactQueryWrapper {...props} /></ErrorBoundry>