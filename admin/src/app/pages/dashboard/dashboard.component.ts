import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
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

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }
} 