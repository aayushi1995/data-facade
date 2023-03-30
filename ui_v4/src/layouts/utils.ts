import { ChatIcon, DatabaseIcon, GridViewIcon, HomeIcon, PlaygroundIcon } from "@/assets/icon.theme"




// Constant list of the sidebar menu Items
export const SidebarItems = () => [
{ key: 'home', text: 'Home', location: '/', icon: HomeIcon },
{ key: 'chats', text: 'Chats', location: '/chats/land', icon: ChatIcon },
{ key: 'data', text: 'Data', location: '/data', icon: DatabaseIcon },
// { key: 'playground', text: 'Playground', location: '/playground/land', icon: PlaygroundIcon },
// { key: 'apps', text: 'Apps', location: '/apps', icon: GridViewIcon },
]

// clean data for charts

export const cleanData = (data:any) => {
    const preview: any = JSON.parse(data?.preview)
    const dataGridColumns = (preview?.schema?.fields || []).map((f:any) => {return {...f, field: f.name, headerName: f.name, flex: 1, minWidth: 200}}).filter((col:any) => col.field!=='datafacadeindex')
    const dataGridRows = (preview?.data || []).map((row:any, index:any) => ({...row, id: row?.Id||index}))
    return {
        columns: dataGridColumns,
        rows: dataGridRows
    }
}
