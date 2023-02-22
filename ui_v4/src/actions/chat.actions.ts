import globalFetch from "@/hooks/useGlobalFetch";
import { FDSEndpoint } from "@/settings/config";
import { userSettingsSingleton } from "@/settings/userSettingsSingleton";
import { v4 as uuidv4 } from "uuid";

const initiateChat = async (id?: string, user?: string) => {
    const data = {
        entityName: "Chat",
        actionProperties: {
            entityProperties: {
                Id: id,
                CreatedBy: user,
            },
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/entity`,
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
    type?: string
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
            addBotResponseToChat: true,
        },
    };

    try {
        const response = await globalFetch(
            `${FDSEndpoint}/entity?email=${userSettingsSingleton.userEmail}`,
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
            `${FDSEndpoint}/getActionDefinitionDetails`,
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
            `${FDSEndpoint}/getproxy`,
            "POST",
            data
        );
        return response;
    } catch (error) {
        return error;
    }
};

export {
    initiateChat,
    startConversation,
    getActionDefinitionDetails,
    fetchTableProperties,
};
