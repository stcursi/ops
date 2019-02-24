import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap, map} from 'rxjs/operators';
import {handleError} from '../../util';
import {Message} from '../../models/message';

@Injectable({
    providedIn: 'root'
})
export class MessageService {

    constructor(public http: HttpClient) {
    }

    public saveNewMessage(Latlng: any, sender: string, receiver: string, text: string) {

        const array = {
            longitude: Latlng.lng,
            latitude: Latlng.lat,
            photo: null,
            received: false,
            read: false,
            sender: sender,
            receiver: receiver,
            text: text,
            creationDateUtc: null,
            reception: null,
            lastUpdateDateUtc: null
        };

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/message/savemessage', JSON.stringify(array), httpOptions)
            .pipe(map(
                res => res
            ), catchError(handleError));

    }

    public updateMessage(details: any) {

        const array = {
            _id: details._id,
            longitude: details.lng,
            latitude: details.lat,
            photo: null,
            received: details.received,
            sender: details.sender,
            recipient: details.recipient,
            read: details.read,
            text: details.text,
            creationDateUtc: null,
            lastUpdateDateUtc: null
        };

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/message/updatemessage', JSON.stringify(array), httpOptions)
            .pipe(map(
            res => <Message[]>res
            ), catchError(handleError));

    }

    public getLocatedMessage(id: string, Latlng: any): Observable<Message[]> {

        const array = {
            _id: id,
            latitude: Latlng.lat,
            longitude: Latlng.lng,
        };

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/message/getlocatedmessages', JSON.stringify(array), httpOptions)
            .pipe(map(
            res => <Message[]>res
        ), catchError(handleError));

    }

    public getReceivedMessage(details): Observable<Message[]> {

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/message/getmessages', JSON.stringify(details), httpOptions)
            .pipe(map(
            res => <Message[]>res
        ), catchError(handleError));

    }

    public aggiornaMessaggi(messaggi: Message[]) {
        messaggi.forEach(element => {
            element.text += 'trovato';
            element.received = true;
            this.updateMessage(element).subscribe(response => {
                console.log(response);
            });
        });
    }


}
