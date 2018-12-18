import {Injectable} from '@angular/core';
import {HTTP} from '@ionic-native/http';
import {User} from '../../models/user';
import {Observable, BehaviorSubject, from} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public token: any;
    currentUser: User;
    authenticationState = new BehaviorSubject(false);

    constructor(public http: HTTP, public storage: Storage) {

    }

    checkAuthentication() {

        // Load token if exists
        this.storage.get('token').then((value) => {

            this.token = value;

            const headers = new Headers();
            headers.append('Authorization', this.token);

            this.http.get('https://opsbackend.herokuapp.com/api/auth/protected', {}, {headers: headers})
                .then(res => {
                    this.authenticationState.next(true);
                });

        });
    }

    isAuthenticated(): boolean {
        return this.authenticationState.value;
    }

    createAccount(details) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('https://opsbackend.herokuapp.com/api/auth/register', details, {headers: headers})
            .then((res) => {

                const data = res.data;
                this.token = data.token;
                this.storage.set('token', data.token);
                this.storage.set('currentUser', data.user);

                Promise.resolve(data);

            }).catch((err) => {
                Promise.reject(err);
            });

    }

    login(credentials) {

        const headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return new Promise((resolve, reject) => {
            return this.http.post('https://opsbackend.herokuapp.com/api/auth/login',
                JSON.stringify(credentials), {headers: headers})
                .then((res) => {
                    const data = res.data;
                    this.currentUser = <User>data.user;
                    this.token = data.token;
                    this.storage.set('currentUser', data.user);
                    this.storage.set('token', data.token);
                    resolve();
                })
                .catch(err => reject(err));
        });
    }

    logout() {
        this.storage.set('token', '');
    }

    setCurrentUser() {

        this.storage.get('currentUser').then((value) => {
            this.currentUser = <User>value;
            console.log(this.currentUser);
        });

    }

    getCurrentUser() {
        return this.currentUser;
    }
}
