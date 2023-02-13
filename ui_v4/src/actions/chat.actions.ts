import globalFetch from "@/hooks/useGlobalFetch";
import { FDSEndpoint } from "@/settings/config";
import { v4 as uuidv4 } from 'uuid';

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
    const response = await globalFetch(`${FDSEndpoint}/entity`, "POST", data);
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Oops, something went wrong");
    }
  } catch (error) {
    return error;
  }
};

const startConversation = async (id?: string,user?: string, message?: string) => {
  const data = {
    entityName: "Message",
    actionProperties: {
      entityProperties: {
        Id:uuidv4(),
        ChatId: id,
        SentBy: user,
        MessageType: "text",
        MessageContent: JSON.stringify({ text: message }),
      },
      addBotResponseToChat: true,
    },
  };

  try {
    const response = await globalFetch(`${FDSEndpoint}/entity`, "POST", data);
    return response;
    
  } catch (error) {
    return error;
  }
};

export { initiateChat, startConversation };
