import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

function isSafeInput(str: string): boolean {
  // Pas d'espaces, pas de guillemets, pas de point-virgule, pas de chevrons, pas de SQL classique
  return !(/[\s'";<>]/.test(str));
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {
    this.resetFields();
  }

  resetFields() {
    this.email = '';
    this.password = '';
    this.rememberMe = false;
    this.error = '';
  }

  isFormValid(): boolean {
    // Email regex simple
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
    return (
      emailValid &&
      this.password.length > 0 &&
      isSafeInput(this.email) &&
      isSafeInput(this.password)
    );
  }

  onSubmit() {
    this.error = '';
    if (!this.isFormValid()) {
      this.error = 'Champs invalides ou dangereux.';
      this.password = '';
      return;
    }
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.auth.setTokens(res.access_token, res.refresh_token, this.rememberMe, res.user);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        console.log(err); // Pour debug : voir la structure de l'erreur
        this.error = 'Identifiants incorrects';
        this.password = '';
      }
    });
  }
}
