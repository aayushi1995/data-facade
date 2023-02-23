export interface IChatMessage {
    id: string;
    message: any;
    time: number;
    from: "user" | "system";
    username?: string;
    type?: "text" | "action_output" | "error" | any;
}

export interface IChatResponse {
    Id?: string;
    ChatId?: string;
    SentBy?: string;
    Index?: string | number;
    MessageType?: "text" | "action_output" | "action" | "error" | "action_instance" | "table_input";
    MessageContent?: any;
}
