import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';
import { LocationTrackerService } from '../../services/locationTracker/location-tracker.service';
import { showLoader, dismiss } from '../../util';


@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


    email: string;
    password: string;
    loading: boolean;

    constructor(public navCtrl: NavController,
                public authService: AuthService,
                public loadingCtrl: LoadingController,
                public locationService: LocationTrackerService) {
    }

    ngOnInit() {}

    login() {

        showLoader(this.loadingCtrl)
            .then(() => {
                const credentials = {
                    email: this.email,
                    password: this.password
                };

                this.authService.login(credentials).subscribe(() => {
                    this.locationService.startTracking();
                    dismiss(this.loadingCtrl).then(() => this.navCtrl.navigateRoot('/tabs'));
                }, (err) => {
                    dismiss(this.loadingCtrl);
                    console.log('Errore LOGIN ', err);
                });
            });
    }

    launchSignup() {
        this.navCtrl.navigateForward('/register');
    }

}
