import LoadingIndicator from "./LoadingIndicator";
import NoData from "./NoData";
import ErrorBoundry from './ErrorBoundry';

const _TableWrapper = ({
    isLoading,
    error,
    data,
    children = () => <></>
}) => {
    if (isLoading) {
        return <LoadingIndicator />
    } else if (error || (!data || data?.length <= 0 )) {
        return (<NoData />)
    } else {
        return children();
    }
}

export const TableWrapper = (props) => <ErrorBoundry><_TableWrapper {...props} /></ErrorBoundry>