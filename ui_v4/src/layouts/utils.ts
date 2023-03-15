import { ChatIcon, DatabaseIcon, GridViewIcon, HomeIcon, PlaygroundIcon } from "@/assets/icon.theme"




// Constant list of the sidebar menu Items
export const SidebarItems = () => [
{ key: 'home', text: 'Home', location: '/', icon: HomeIcon },
{ key: 'chatland', text: 'Chats', location: '/chatland', icon: ChatIcon },
{ key: 'data', text: 'Data', location: '/data', icon: DatabaseIcon },
{ key: 'PlayGroundLand', text: 'Playground', location: '/PlayGroundLand', icon: PlaygroundIcon },
{ key: 'apps', text: 'Apps', location: '/apps', icon: GridViewIcon },
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
