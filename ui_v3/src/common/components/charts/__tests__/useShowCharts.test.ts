import data from './mockData/chartData.json';
import {act, renderHook} from '@testing-library/react-hooks'
import {useShowCharts} from "../hooks/useShowCharts";


describe("Modify test metadata", () => {
    const chartId = "c68113ae-c93f-4dfa-be2e-329b0fc59f6f";
    const newName = "newName";
    const newDashboard = "newDashboard";
    const newType = "newType";
    test('to modify charts Name and dashboard Id', () => {
        const {result} = renderHook(() => useShowCharts({chartWithData: data}));
        const getModel = () => result.current?.chartDataOptions?.find((option) => option?.model.Id === chartId)?.model;
        act(() => {
            result.current.onChartNameChange(chartId, newName);
        })
        expect(getModel()?.Name).toBe(newName);
        act(() => {
            result.current.onChartDashboardChange(chartId, newDashboard);
        })
        expect(getModel()?.DashboardId).toBe(newDashboard);
    });
    test('to modify charts Type', () => {
        const {result} = renderHook(() => useShowCharts({chartWithData: data}));
        const getModel = () => result.current?.chartDataOptions?.find((option) => option?.model.Id === chartId)?.model;
        act(() => {
            result.current.onChartTypeChange(chartId, newType);
        })
        expect(getModel()?.Type).toBe(undefined);
    })
});
