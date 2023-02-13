import { ChatIcon, DatabaseIcon, HomeIcon, PlaygroundIcon } from "@/assets/icon.theme"
import { getLocalStorage, setLocalStorage } from "@/utils";
import { v4 as uuidv4 } from 'uuid';

// retrieve chatid from localstorage
export const getChatId = () => {
    let id = getLocalStorage('chat_id')
    if(!id) {
        id = uuidv4();
        setLocalStorage('chat_id', id);
    }
    return id
}

// Constant list of the sidebar menu Items
export const SidebarItems = () => [
    { key: '1', text: 'Home', location: '/', icon: HomeIcon },
    { key: '2', text: 'Chats', location: `/chats/${getChatId()}`, icon: ChatIcon },
    { key: '3', text: 'Data', location: '/data', icon: DatabaseIcon },
    { key: '4', text: 'Playground', location: '/playground', icon: PlaygroundIcon },
]