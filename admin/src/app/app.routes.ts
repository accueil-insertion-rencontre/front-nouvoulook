import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './pages/guards/auth.guard';
import { UserListComponent } from './pages/users/user-list.component';
import { AffichageComponent } from './pages/affichage/affichage.component';
import { DonationsComponent } from './pages/donations/donations.component';
import { VolunteersComponent } from './pages/volunteers/volunteers.component';
import { NewsComponent } from './pages/news/news.component';
import { PartnersComponent } from './pages/partners/partners.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: DashboardComponent, canActivate: [authGuard],
    children: [
      { path: '', component: AffichageComponent },
      { path: 'users', component: UserListComponent, canActivate: [authGuard] },
      { path: 'donations', component: DonationsComponent, canActivate: [authGuard] },
      { path: 'volunteers', component: VolunteersComponent, canActivate: [authGuard] },
      { path: 'news', component: NewsComponent, canActivate: [authGuard] },
      { path: 'partners', component: PartnersComponent, canActivate: [authGuard] }
    ]
  }
];
