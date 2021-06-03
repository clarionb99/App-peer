import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { TabsPage } from './tabs.page';
import { ProfilePageResolver } from 'src/app/profile/profile.resolver';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['sign-in']);

const routes: Routes = [

  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'match',
        loadChildren: () => import('../match/match.module').then( m => m.MatchPageModule)
      },
      {
        path: 'schedule',
        loadChildren: () => import('../schedule/schedule.module').then( m => m.SchedulePageModule)
      },
      {
        path: 'chat',
        loadChildren: () => import('../chat/chat.module').then( m => m.ChatPageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('../profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'message',
        loadChildren: () => import('../message/message.module').then( m => m.MessagePageModule )
      },
      {
        path: '**',
        redirectTo: '/tabs/match',
        pathMatch: 'full'
      }
    ],
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    resolve: {
      data: ProfilePageResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [ProfilePageResolver]
})
export class TabsPageRoutingModule {}
