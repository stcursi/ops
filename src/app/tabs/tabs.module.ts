import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {TabsPageRoutingModule} from './tabs.router.module';

import {TabsPage} from './tabs.page';
import {MapPageModule} from '../pages/map/map.module';
import {MailPageModule} from '../pages/mail/mail.module';
import {ProfilePageModule} from '../pages/profile/profile.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        TabsPageRoutingModule,
        MapPageModule,
        MailPageModule,
        ProfilePageModule
    ],
    declarations: [TabsPage]
})
export class TabsPageModule {
}
