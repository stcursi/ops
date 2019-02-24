import {Message} from './message';

export interface User {
    _id: string;
    name: string;
    email: string;
    surname: string;
    img: string;
    password: string;
    friends: User[];
    inbox: Message[];
    outbox: Message[];
}
