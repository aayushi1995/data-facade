import globalFetch from "@/hooks/useGlobalFetch";
import { FDSEndpoint } from "@/settings/config";
import { getDefaultRequestQuery } from "@/utils/getDefaultRequestQuery";
import { v4 as uuidv4 } from "uuid";

const initiateChat = async (id?: string, user?: string, name?:any) => {
    const data = {
        entityName: "Chat",
        actionProperties: {
            entityProperties: {
                Id: id,
                CreatedBy: user,
                Name: name
            },
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/entity${getDefaultRequestQuery()}`,
            "POST",
            data
        );
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Oops, something went wrong");
        }
    } catch (error) {
        return error;
    }
};

const startConversation = async (
    id?: string,
    user?: string,
    message?: string,
    type?: string,
    getResponseFromBot?: boolean
) => {
    const data = {
        entityName: "Message",
        actionProperties: {
            entityProperties: {
                Id: uuidv4(),
                ChatId: id,
                SentBy: user,
                MessageType: type ? type : "text",
                MessageContent: JSON.stringify(message),
            },
            addBotResponseToChat: getResponseFromBot === undefined ? true : getResponseFromBot,
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/entity${getDefaultRequestQuery()}`,
            "POST",
            data
        );
        return response;
    } catch (error) {
        return error;
    }
};

const getActionDefinitionDetails = async (id?: string) => {
    const data = {
        Id: id,
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/getActionDefinitionDetails${getDefaultRequestQuery()}`,
            "POST",
            data
        );
        return response;
    } catch (error) {
        return error;
    }
};

const fetchTableProperties = async (id?: string) => {
    const data = {
        entityName: "TableProperties",
        actionProperties: {
            filter: {},
            FilterForParameterTags: true,
            withParameterId: id,
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/getproxy${getDefaultRequestQuery()}`,
            "POST",
            data
        );
        return response;
    } catch (error) {
        return error;
    }
};


const fetchChats = async (chatId?:string) => {
    const data = {
        entityName: "Message",
        filter: {
            ChatId: chatId,
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/getproxy${getDefaultRequestQuery()}`,
            "POST",
            data
        );
        return response;
    } catch (error) {
        return error;
    }
}


const updateChatName = async (chatId?:string, Name?:string) => {
    const data = {
        entityName: "Message",
        filter: {
            ChatId: chatId,
            name: Name
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/getproxy${getDefaultRequestQuery()}`,
            "POST",
            data
        );
        return response;
    } catch (error) {
        return error;
    }
}


export {
    initiateChat,
    startConversation,
    getActionDefinitionDetails,
    fetchTableProperties,
    fetchChats,
    updateChatName
};
