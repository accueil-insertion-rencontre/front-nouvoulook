import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-donations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid">
      <h2>Gestion des horaires d'ouverture</h2>
      
      <div class="card mt-4">
        <div class="card-body">
          <form (ngSubmit)="onSubmit()" #donationForm="ngForm">
            <div class="mb-3">
              <label for="messageSchedule" class="form-label">Horaires d'ouverture</label>
              <textarea
                id="messageSchedule"
                name="messageSchedule"
                class="form-control"
                rows="3"
                [(ngModel)]="textDonation.messageSchedule"
                required
              ></textarea>
              <div class="form-text">Exemple : Nouvoulook vous accueille du mardi au vendredi matin de 9h à 12h ! Ainsi que le samedi après midi de 14h à 18h.</div>
            </div>

            <div class="mb-3">
              <label for="messageAdvertising" class="form-label">Concernant les dons</label>
              <textarea
                id="messageAdvertising"
                name="messageAdvertising"
                class="form-control"
                rows="5"
                [(ngModel)]="textDonation.messageAdvertising"
                required
              ></textarea>
              <div class="form-text">Ce message sera affiché sur la page des dons.</div>
            </div>

            <button type="submit" class="btn btn-primary" [disabled]="!donationForm.form.valid || loading">
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.10);
      border: none;
      border-radius: 1rem;
    }
  `]
})
export class DonationsComponent implements OnInit {
  textDonation: any = {
    messageSchedule: '',
    messageAdvertising: ''
  };
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTextDonation();
  }

  loadTextDonation() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/text-donations`).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.textDonation = data[0];
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des horaires:', error);
        this.loading = false;
      }
    });
  }

  onSubmit() {
    this.loading = true;
    const url = this.textDonation.id 
      ? `${environment.apiUrl}/text-donations/${this.textDonation.id}`
      : `${environment.apiUrl}/text-donations`;

    const method = this.textDonation.id ? 'patch' : 'post';

    this.http[method](url, this.textDonation).subscribe({
      next: (response) => {
        this.textDonation = response;
        this.loading = false;
        alert('Horaires mis à jour avec succès !');
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des horaires:', error);
        this.loading = false;
        alert('Erreur lors de la mise à jour des horaires');
      }
    });
  }
} 