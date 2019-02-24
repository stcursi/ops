import { Injectable } from '@angular/core';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap, map} from 'rxjs/operators';
import {User} from '../../models/user';
import {Friendship} from '../../models/friendship';
import {handleError} from '../../util';

@Injectable({
  providedIn: 'root'
})
export class FriendshipService {

  constructor(private http: HttpClient) { }

    public getAllUsers(): Observable<User[]> {

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };


        return this.http.get('https://opsbackend.herokuapp.com/api/friendship/getallusers', httpOptions)
            .pipe(map(
            res => <User[]>res
        ), catchError(handleError));

    }

    public getAllFriends(details): Observable<Friendship[]> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/friendship/getallfriends', JSON.stringify(details), httpOptions)
            .pipe(map(
            res => <Friendship[]>res
        ), catchError(handleError));

    }

    public getPendingRequests(details): Observable<Friendship[]> {

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/friendship/getpendingfriends', JSON.stringify(details), httpOptions)
            .pipe(map(
            res => <Friendship[]>res
        ), catchError(handleError));

    }

    public getUsersFromFriends(details): Observable<User[]> {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/friendship/getusersfromfriends', JSON.stringify(details), httpOptions)
            .pipe(map(
            res => <User[]>res
        ), catchError(handleError));

    }

    public acceptFriendRequest(details: any) {

        const friendship = {
            id: '',
            friend_id: details.friend_id,
            request_to: details.request_to,
            accepted: true
        };
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/friendship/acceptfriendrequest', JSON.stringify(details), httpOptions)
            .pipe(map(
            res => <User[]>res
        ), catchError(handleError));


    }


    public sendFriendRequest(details): Observable<Friendship> {

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/friendship/sendfriendrequest', JSON.stringify(details), httpOptions)
            .pipe(map(
            res => <Friendship>res
        ), catchError(handleError));

    }
}
