export interface IChatMessage {
    id: string
    message: any
    time: number
    from: 'user' | 'system'
    username?: string
    type?: 'text' | 'actions' | 'visualization'
}