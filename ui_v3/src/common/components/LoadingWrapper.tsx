import LoadingIndicator from "./LoadingIndicator";
import NoData from "./NoData";

export interface LoadingWrapperProps {
    isLoading: boolean,
    error: unknown,
    data: undefined|any,
    children: React.ReactNode
}
const LoadingWrapper = (props: LoadingWrapperProps) => {
    if(props.isLoading) {
        return <LoadingIndicator/>
    } else if(!!props.error) {
        return <NoData/>
    } else if(!!props.data) {
        return (<>{props.children}</>)
    } else {
        return <LoadingIndicator/>
    }
}

export default LoadingWrapper;