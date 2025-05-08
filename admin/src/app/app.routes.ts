import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './pages/guards/auth.guard';
import { UserListComponent } from './pages/users/user-list.component';
import { AffichageComponent } from './pages/affichage/affichage.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'admin', component: DashboardComponent, canActivate: [authGuard],
    children: [
      { path: '', component: AffichageComponent },
      { path: 'users', component: UserListComponent, canActivate: [authGuard] }
    ]
  }
];
