import { useQuery, UseQueryResult } from "react-query";
import { Fetcher } from "../../../../../generated/apis/api";
import { TableProperties } from "../../../../../generated/entities/Entities";
import { PossibleAutoFlows } from "../../../../../generated/interfaces/Interfaces";
import labels from "../../../../../labels/labels";



const useGetPossibleAutoFlows = (props: {filter: TableProperties}): UseQueryResult<PossibleAutoFlows[], unknown> => {

    const queryDetail = useQuery([labels.entities.TableProperties, "PossibleAutoFlow", props.filter],
        () => Fetcher.fetchData("GET", "/getPossibleAutoFlowsList", props.filter)
    )

    return queryDetail
}

export default useGetPossibleAutoFlows