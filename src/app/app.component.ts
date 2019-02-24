import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth/auth.service';
import { LocationTrackerService } from './services/locationTracker/location-tracker.service';
import {dismiss} from './util';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authService: AuthService,
    private locationTracker: LocationTrackerService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
        this.authService.isAuthenticated()
            .then((result: boolean) => {
                if (result) {
                    console.log('Already authorized');
                    this.authService.setCurrentUser();
                    this.locationTracker.startTracking();
                } else {
                    console.log('Not already authorized');
                    this.authService.logout();
                }
            })
            .catch((err) => {
              console.log('err auth', err);
              this.authService.logout();
            });
    });
  }
}
