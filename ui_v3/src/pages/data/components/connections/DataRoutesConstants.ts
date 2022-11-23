export const CHOOSE_CONNECTOR_ROUTE = '/data/connections/choose';
export const CHOOSE_CONNECTOR_SELECTED_ROUTE = '/data/connections/choose/:ProviderDefinitionId';
export const connectionsRoutes: {href: string, label: string, labelCreator?: (...args: any[])=>string}[] = [
    {
        href: '',
        label: "Data"
    },
    {
        href: CHOOSE_CONNECTOR_ROUTE,
        label: `Choose connector`
    },
    {
        href: CHOOSE_CONNECTOR_SELECTED_ROUTE,
        label: '',
        labelCreator: (ProviderType: string, UniqueName: string) => `${ProviderType} | ${UniqueName}`
    }
];
