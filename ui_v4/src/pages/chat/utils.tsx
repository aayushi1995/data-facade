import { ActionDefinitionDetail } from "@/generated/interfaces/Interfaces"
import { IChatMessage } from "./ChatBlock/ChatBlock.type"
import { ReactComponent as CommentChatIcon } from '@assets/icons/commentChat.svg'
import { ReactComponent as TerminalIcon } from '@assets/icons/terminal.svg'
import { ReactComponent as ChatHistory } from '@assets/icons/history.svg'


// finding an element that might appear more than once in an array
export const findAll = (inputArray:any[], key:string) => {
    let output:any[]= []
    inputArray?.forEach((obj:any) => {
        if(obj?.ProviderDefinitionId === key) {
            output.push({
                label: obj?.Name, 
                value: obj?.Id,
                ...obj
            })
        }
    })
    return output
}

export const createProviderInstanceSelectData = (parentNodes:any, childNodes:any) => {
    let newArray:any[] = []
    parentNodes?.forEach((obj:any) => {
        let objs = findAll(childNodes,obj?.Id)
        objs.length > 0 && newArray?.push({
                label: obj?.UniqueName,
                options: [...objs]
        })
    })
    return newArray
}

export const getData = (rows:any, value:any) => {
    const newArray:any = []
    rows?.forEach((obj:any) => {
        if(obj?.[value]){
            newArray.push(obj[value])
        }
    })
    return newArray
}

export const postProcessingFetchingMessage = (messages:any) => {
    let executionId = {}
    let table_input = {}
    let actionDefinition = {}
    let messagesArray =  messages?.map((obj:any, index:number) => {
        let retreiveMessage:string = ''
        if(obj?.MessageType === 'text' || obj?.MessageType === "fileInput") {
            retreiveMessage = JSON.parse(obj?.MessageContent)?.text
        } else if (obj?.MessageType === 'action_output') {
            executionId =  {
                ...executionId,
                [obj?.Id]: JSON.parse(obj?.MessageContent)?.['executionId']
            }
        } else if (obj?.MessageType === "action_instance"){
            actionDefinition = {
                ...actionDefinition,
                [obj?.Id]: JSON.parse(obj?.MessageContent)
            }
        } else if (obj?.MessageType === "table_input"){
            table_input = {
                ...table_input,
                [obj?.Id]: JSON.parse(obj?.MessageContent)
            }
        } 
        return {
            id: obj?.Id,
            message: retreiveMessage || obj?.MessageContent,
            // if we dont get a sentBy then add previoous message time
            time: obj?.SentOn ? parseInt(obj?.SentOn) : index > 1 ? parseInt(messages?.[index-1]?.sentOn): new Date().getTime(),
            from: obj?.MessageType === "table_input" || obj?.SentBy === "Bot" ? "system" : 'user',
            username: obj?.SentBy === "Bot" ? "Data Facade" : obj?.SentBy,
            type: obj?.MessageType,
            index: obj?.Index
        }
    })

    // sort all chats according to Index Id
    let sortedMessageArray = sortAndMap(messagesArray)
    

    return { messagesArray:sortedMessageArray , executionId, table_input, actionDefinition}
}

const sortAndMap = (arr:any[]) => {
    const copy = arr.slice();

    const sorter = (a:any, b:any) => {
       return a['index'] - b['index'];
    };

    copy.sort(sorter);

    const res = copy.map((obj) => {
       return obj;
    });
    return res;
 };

 export const defaultBotMessage = (username: string): IChatMessage => {
   
    return {
        id: 'defaultFirstBOTMessage',
        message: `Welcome ${username.split(' ')[0]} ! What insight do you need ?` ,
        time: new Date().getTime(),
        from: 'system',
        username: 'DataFacade',
        type: 'text'
    }
}

export const getRandomItems = (arr: any[], numItems: number): any[] => {
    const result = new Array(numItems);
    let len = arr.length;
    const taken = new Array(len);
    if (numItems > len) {
      throw new RangeError("getRandomItems: more elements taken than available");
    }
    while (numItems--) {
      const randomIndex = Math.floor(Math.random() * len);
      result[numItems] = arr[randomIndex in taken ? taken[randomIndex] : randomIndex];
      taken[randomIndex] = --len in taken ? taken[len] : len;
    }
    return result;
}

export const defaultActions = (allActionDefinitionsData: ActionDefinitionDetail[]): IChatMessage => {
    return {
        id: new Date().toTimeString(),
        message: allActionDefinitionsData,
        time: new Date().getTime(),
        from: 'system',
        username: 'DataFacade',
        type: 'recommended_actions'
    }
}

export const IconStack = (handleClick:any) => [
    {
        id: new Date().getTime().toString(),
        value: 'chat',
        icon:<CommentChatIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'deepdive',
        icon:<TerminalIcon/>,
        onClick: handleClick,
    },
    {
        id: new Date().getTime().toString(),
        value: 'history',
        icon:<ChatHistory/>,
        onClick: handleClick,
    }
]

export const detectDefaultMessage = (messages:IChatMessage[], messageToFind:string) => {
    let defaultMessages = messages?.filter((message:IChatMessage) => message?.id === messageToFind)
    return defaultMessages.length > 1
}

