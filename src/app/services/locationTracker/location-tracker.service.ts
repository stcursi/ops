import {Injectable, NgZone} from '@angular/core';
import {User} from '../../models/user';
import { AlertController } from '@ionic/angular';
import {AuthService} from '../auth/auth.service';
import {MessageService} from '../message/message.service';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';
import {Geolocation, Geoposition} from '@ionic-native/geolocation/ngx';
import {Observable, BehaviorSubject, throwError} from 'rxjs';



@Injectable({
    providedIn: 'root'
})
export class LocationTrackerService {

    public watch: any;
    public currentUser: User;
    public _currentGeoposition: Geoposition;
    public _positionChange: BehaviorSubject<Geoposition>;

    constructor(public zone: NgZone,
                public backgroundGeolocation: BackgroundGeolocation,
                public geolocation: Geolocation,
                public alertCtrl: AlertController,
                private authService: AuthService,
                public messageService: MessageService) {
        this._positionChange = new BehaviorSubject<Geoposition>(this._currentGeoposition);
    }

    startTracking() {
        const config = {
            desiredAccuracy: 0,
            stationaryRadius: 20,
            distanceFilter: 10,
            debug: true,
            interval: 5000
        };

        this.backgroundGeolocation.configure(config).subscribe((location) => {

            console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

            this.currentUser = this.authService.currentUser;

            // Run update inside of Angular's zone
            this.zone.run(() => {
                // this.lat = location.latitude;
                // this.lng = location.longitude;
            });

            this._currentGeoposition.coords.latitude = location.latitude;
            this._currentGeoposition.coords.longitude = location.longitude;

            this._positionChange.next(this._currentGeoposition);

            const LatLng = { lat: location.latitude, lng: location.longitude };

            this.messageService.getLocatedMessage(this.currentUser._id, LatLng).subscribe(messages => {
                console.log(messages);

                if (messages.length === 0) {
                    console.log('NON CI STA UN CAZZO QUI');
                }

                for (const element of messages) {
                    this.showPopup('Nuovo messaggio', `Il tuo amico ${element.sender} ti ha lasciato un messaggio`);
                }

                this.messageService.aggiornaMessaggi(messages);

            });


        }, (err) => {

            console.log(err);

        });

        // Turn ON the background-geolocation system.
        this.backgroundGeolocation.start();

        // // Foreground Tracking

        // let options = {
        //   frequency: 3000,
        //   enableHighAccuracy: true
        // };

        // this.watch = Geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

        //   console.log(position);

        //   // Run update inside of Angular's zone
        //   this.zone.run(() => {
        //     this.lat = position.coords.latitude;
        //     this.lng = position.coords.longitude;
        //   });

        // });

    }

    async showPopup(title, text) {
        const alert = await this.alertCtrl.create({
            header: title,
            message: text,
            buttons: [
                {
                    text: 'OK',
                    // handler: data => {
                    //   if (this.trovati) {
                    //     this.navCtrl.popToRoot();
                    //   }
                    // }
                }
            ]
        });
        await alert.present();
    }

    stopTracking() {

        console.log('stopTracking');

        this.backgroundGeolocation.finish();
        this.watch.unsubscribe();

    }

    get currentGeoposition() {
        return this._currentGeoposition;
    }

    get positionChange() {
        return this._positionChange.asObservable();
    }
}
