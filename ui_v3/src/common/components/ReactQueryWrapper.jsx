import LoadingIndicator from "./LoadingIndicator";
import NoData from "./NoData";
import ErrorBoundry from './ErrorBoundry';
import {Box} from "@mui/material";

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
    } else if (error || !isLoading && (!data || data?.length <= 0 )) {
        El = (<Box sx={sx}><NoData /></Box>)
    } else {
        El = children();
    }
    return El;
}

export const ReactQueryWrapper = (props) => <ErrorBoundry><_ReactQueryWrapper {...props} /></ErrorBoundry>