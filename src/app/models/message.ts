export interface Message {
    [name: string]: any;
    _id: string;
    sender: string;
    recipient: string;
    longitude: number;
    received: Boolean;
    read: Boolean;
    latitude: number;
    text: string;
    creationDateUtc: Date;
    content: string; // come fare per contenuti multimediali?
}
