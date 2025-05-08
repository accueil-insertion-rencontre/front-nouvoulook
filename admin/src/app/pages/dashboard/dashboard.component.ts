import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLinkWithHref, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLinkWithHref, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  firstname = '';
  lastname = '';

  constructor(private auth: AuthService, private router: Router) {
    const user = this.auth.getUser();
    if (user) {
      this.firstname = user.firstname;
      this.lastname = user.lastname;
    }
  }

  isUserRoute(): boolean {
    return this.router.url.includes('/admin/users');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
} 