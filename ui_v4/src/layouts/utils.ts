import { ChatIcon, DatabaseIcon, HomeIcon, PlaygroundIcon } from "@/assets/icon.theme"




// Constant list of the sidebar menu Items
export const SidebarItems = () => [
    { key: 'home', text: 'Home', location: '/', icon: HomeIcon },
    { key: 'chats', text: 'Chats', location: `/chats`, icon: ChatIcon },
    { key: 'data', text: 'Data', location: '/data', icon: DatabaseIcon },
    { key: 'playground', text: 'Playground', location: '/playground', icon: PlaygroundIcon },
]