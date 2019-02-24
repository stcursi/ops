import {Injectable} from '@angular/core';
import { Storage } from '@ionic/storage';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import { handleError } from '../../util';
import { JwtHelperService } from '@auth0/angular-jwt';
import {User} from '../../models/user';
import {Observable, BehaviorSubject, throwError} from 'rxjs';
import {catchError, tap, map} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public token: any;
    _currentUser: User;
    authenticationState = new BehaviorSubject(false);

    constructor(private http: HttpClient, public storage: Storage,public navCtrl: NavController, public jwtHelper: JwtHelperService) {
    }

    public async checkAuthentication() {

        // Load token if exists
        await this.storage.get('token').then((value) => {

            this.token = value;
            const httpOptions = {
                headers: new HttpHeaders({'Authorization': this.token})
            };

            return this.http.get('https://opsbackend.herokuapp.com/api/auth/protected', httpOptions)
                .pipe(map(() => this.authenticationState.next(true)), catchError(handleError));

        });
    }

    public isAuthenticated(): Promise<any> {
        return this.storage.get('token').then((token) => {
            return Promise.resolve(!this.jwtHelper.isTokenExpired(token));
        })
            .catch((err) => {
                return Promise.reject(err);
            });

    }

    createAccount(details): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/auth/register', details, httpOptions)
            .pipe(
                map((res: any) => {
                    if (res.data && res.data.token && res.data.user) {
                        this.token = res.data.token;
                        this.storage.set('token', res.data.token);
                        this.storage.set('currentUser', res.data.user);

                        return res.data;
                    }
                }), catchError(handleError));

    }

    login(credentials): Observable<any> {

        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        };

        return this.http.post('https://opsbackend.herokuapp.com/api/auth/login',
            JSON.stringify(credentials), httpOptions)
            .pipe(map((res: any) => {
                if (res) {
                    const data = res;
                    this._currentUser = <User>data.user;
                    this.token = data.token;
                    this.storage.set('currentUser', data.user);
                    this.storage.set('token', data.token);
                } else {
                    return throwError('[Login] - Server response with empty data.');
                }
            }), catchError(handleError));
    }

    logout() {
        this.storage.remove('token');
        this.storage.remove('currentUser');
        this.navCtrl.navigateForward('/login');
    }

    setCurrentUser() {

        this.storage.get('currentUser').then((value) => {
                this._currentUser = <User>value;
                console.log(this._currentUser);
                this.navCtrl.navigateForward('/tabs');
        });

    }

    get currentUser() {
        return this._currentUser;
    }

}
