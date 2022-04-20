import { useMutation } from "react-query";
import { Fetcher } from "../../../../generated/apis/api";
import { Chart } from "../../../../generated/entities/Entities";


const useUpdateChart = () => {
    return useMutation("UpdateChart", 
        (params: {filter: Chart, newProperties: Chart}) => {
            return Fetcher.fetchData("PATCH", "/updateChart", {filter: params.filter, newProperties: params.newProperties})
        }
    )

}

export default useUpdateChart