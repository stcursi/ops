import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';
import { MapPage } from '../pages/map/map.page';
import { MailPage } from '../pages/mail/mail.page';
import { ProfilePage } from '../pages/profile/profile.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: '/tabs/(map:map)',
        pathMatch: 'full',
      },
      {
        path: 'map',
        outlet: 'map',
        component: MapPage
      },
      {
        path: 'mail',
        outlet: 'mail',
        component: MailPage
      },
      {
        path: 'profile',
        outlet: 'profile',
        component: ProfilePage
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/(map:map)',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
