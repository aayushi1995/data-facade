import ChatLoader from "@/pages/chat/Chat/ChatLoader";
import ErrorBoundary from "antd/es/alert/ErrorBoundary";


const REACT_QUERY_WRAPPER = ({
    isLoading,
    error,
    data,
    children
}: any) => {
    let El = children;
    if (isLoading) {
        El = <div ><ChatLoader/></div>
    } else if (error || (!isLoading && (!data))) {
        El = (<div></div>);
    } else {
        El = children;
    }
    return El;
}

export const ReactQueryWrapper = (props: any) => <ErrorBoundary><REACT_QUERY_WRAPPER {...props} /></ErrorBoundary>