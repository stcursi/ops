import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouteReuseStrategy} from '@angular/router';
import {JwtModule, JwtHelperService} from '@auth0/angular-jwt';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {BackgroundGeolocation} from '@ionic-native/background-geolocation/ngx';
import {LocationTrackerService} from './services/locationTracker/location-tracker.service';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {IonicStorageModule} from '@ionic/storage';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

export function tokenGetter() {
    return localStorage.getItem('token');
}

const optJwt = {
    config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['example.com'],
        blacklistedRoutes: ['example.com/examplebadroute/']
    }
};

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule,
        IonicModule.forRoot(),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        JwtModule.forRoot(optJwt)],
    providers: [
        StatusBar,
        SplashScreen,
        Geolocation,
        BackgroundGeolocation,
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
        JwtHelperService,
        LocationTrackerService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
