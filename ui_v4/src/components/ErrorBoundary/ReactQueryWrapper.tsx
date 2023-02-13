// @ts-ignore
import ErrorBoundary from ".";

const _ReactQueryWrapper = ({
    isLoading,
    error,
    data,
    sx,
    children = () => <></>
}: any) => {
    let El;
    if (isLoading) {
        El =  <div style={sx}>Loading...</div>
    } else if (error || (!isLoading && (!data) )) {
        El =  (<div style={sx}>No data</div>);
    } else {
        El = children();
    }
    return El;
}

export const ReactQueryWrapper = (props: any) => <ErrorBoundary><_ReactQueryWrapper {...props} /></ErrorBoundary>