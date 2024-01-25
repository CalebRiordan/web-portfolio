export interface Message{
    id: string;
    name: string;
    emailAddress: string;
    content: string;
}

export interface CreateMessageModel{
    name: string;
    emailAddress: string;
    content: string;
}