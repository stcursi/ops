import {Component, OnInit} from '@angular/core';
import {NavController, LoadingController} from '@ionic/angular';
import {AuthService} from '../../services/auth/auth.service';
import {AuthGuardService} from '../../services/authGuard/auth-guard.service';
import {TabsPage} from '../../tabs/tabs.page';
import {RegisterPage} from '../register/register.page';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


    email: string;
    password: string;
    loading: any;

    constructor(public navCtrl: NavController,
                public authService: AuthService,
                public authGuardService: AuthGuardService,
                public loadingCtrl: LoadingController) {

    }

    ngOnInit() {

        this.showLoader();

        this.authService.setCurrentUser();

        // Check if already authenticated
        if (this.authGuardService.canActivate()) {
            console.log('Already authorized');
            this.loading.dismiss();
            this.navCtrl.navigateRoot('/tabs');
        } else {
            console.log('Not already authorized');
            this.loading.dismiss();
        }
    }

    login() {

        this.showLoader();

        const credentials = {
            email: this.email,
            password: this.password
        };

        this.authService.login(credentials).then(() => {
            this.loading.dismiss();
            this.navCtrl.navigateRoot('/tabs');
        }, (err) => {
            this.loading.dismiss();
            console.log(err);
        });

    }

    launchSignup() {
        this.navCtrl.navigateForward('/register');
    }

    async showLoader() {
        this.loading = await this.loadingCtrl.create({
            // @ts-ignore
            content: 'Please wait...'
        });

        await this.loading.present();
    }

}
