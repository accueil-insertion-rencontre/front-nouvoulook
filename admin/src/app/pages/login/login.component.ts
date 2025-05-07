import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.setToken(res.access_token);
        this.router.navigate(['/admin']); // adapte la route si besoin
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur de connexion';
      }
    });
  }
}
