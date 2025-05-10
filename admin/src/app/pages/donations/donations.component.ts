import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { PictosService } from '../../services/pictos.service';

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
    <!-- Début gestion des collectes -->
    <div class="container-fluid mt-5">
      <h2>Gestion des exemples de donations</h2>
      <button class="btn btn-success mb-3" (click)="openAddModal()">Ajouter un exemple de donation</button>
      <table class="table table-striped" *ngIf="clothingExamples.length">
        <thead>
          <tr>
            <th>Image</th>
            <th>Description</th>
            <th>Accepté</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of clothingExamples">
            <td *ngIf="item.imageUrl">
              <img [src]="apiUrl + item.imageUrl" alt="Image collecte" style="width:48px; height:48px;">
            </td>
            <td>{{ item.description }}</td>
            <td>
              <input type="checkbox" [(ngModel)]="item.accepted" (change)="toggleAccepted(item)" />
            </td>
            <td>
              <button class="btn btn-sm btn-primary me-2" (click)="openEditModal(item)">Modifier</button>
              <button class="btn btn-sm btn-danger" (click)="deleteClothingExample(item)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!clothingExamples.length && !loadingCollectes">Aucun exemples trouvée.</div>
      <div *ngIf="loadingCollectes">Chargement...</div>

      <!-- Modal Ajouter/Modifier -->
      <div class="modal fade" tabindex="-1" [ngClass]="{'show d-block': showModal}" *ngIf="showModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">{{ editMode ? 'Modifier' : 'Ajouter' }} un exemple</h5>
              <button type="button" class="btn-close" (click)="closeModal()"></button>
            </div>
            <div class="modal-body">
              <form #form="ngForm">
                <div class="mb-3">
                  <label>Nom (interne)</label>
                  <input type="text" class="form-control" [(ngModel)]="currentItem.name" name="name" required />
                  <div class="form-text">Ce nom n'est pas affiché sur le site public.</div>
                </div>
                <div class="mb-3">
                  <label>Image (URL)</label>
                  <div class="input-group">
                    <input type="text" class="form-control" [(ngModel)]="currentItem.imageUrl" name="imageUrl" />
                    <button type="button" class="btn btn-outline-secondary" (click)="openLibrary()">Ouvrir la bibliothèque</button>
                  </div>
                </div>
                <div class="mb-3">
                  <label>Description</label>
                  <textarea class="form-control" [(ngModel)]="currentItem.description" name="description" required></textarea>
                </div>
                <div class="mb-3">
                  <label>
                    <input type="checkbox" [(ngModel)]="currentItem.accepted" name="accepted" /> Accepté
                  </label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Annuler</button>
              <button type="button" class="btn btn-success" (click)="saveClothingExample()">{{ editMode ? 'Enregistrer' : 'Ajouter' }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Fin gestion des collectes -->

    <!-- Modale bibliothèque d'images -->
    <div class="modal" tabindex="-1" [ngStyle]="{display: showLibrary ? 'block' : 'none'}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Bibliothèque d'images</h5>
            <button type="button" class="btn-close" (click)="closeLibrary()"></button>
          </div>
          <div class="modal-body">
            <!-- Message d'aide -->
            <div class="mb-2 text-muted" style="font-size: 0.95rem;">
              Cliquez sur une image pour la sélectionner
            </div>
            <div class="pictos-gallery">
              <div *ngFor="let picto of pictosList" style="display:inline-block; position:relative; margin:4px;">
                <img
                  [src]="apiUrl + picto.url"
                  (click)="selectPictoFromLibrary(picto)"
                  [class.selected]="currentItem.imageUrl === picto.url"
                  [class.clickable]="true"
                  style="width:48px; height:48px; border:2px solid #eee; cursor:pointer; transition: box-shadow 0.2s, border 0.2s;">
                <span *ngIf="currentItem.imageUrl === picto.url"
                      style="position:absolute;top:2px;right:2px;color:#28a745;font-size:18px;">✔</span>
                <button (click)="removePicto(picto)" style="position:absolute; top:0; right:0; background:transparent; border:none; color:red; font-size:18px;">&times;</button>
              </div>
            </div>
            <div class="mt-3">
              <input type="file" (change)="uploadPicto($event)">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `.card { box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.10); border: none; border-radius: 1rem; }`,
    `.modal { background: rgba(0,0,0,0.2); position: fixed; top:0; left:0; width:100vw; height:100vh; z-index:1000; }`,
    `.modal-dialog { margin-top: 10vh; }`,
    `.pictos-gallery img.clickable:hover { border: 2px solid #ffa14e; box-shadow: 0 0 8px #ffa14e; }`,
    `.pictos-gallery img.selected { border: 2px solid #28a745; box-shadow: 0 0 8px #28a745; }`
  ]
})
export class DonationsComponent implements OnInit {
  textDonation: any = {
    messageSchedule: '',
    messageAdvertising: ''
  };
  loading = false;

  // Pour la gestion des collectes
  clothingExamples: any[] = [];
  loadingCollectes = false;
  showModal = false;
  editMode = false;
  currentItem: any = { name: '', imageUrl: '', description: '', accepted: false };

  showLibrary = false;
  pictosList: any[] = [];
  selectedPictoId: number | null = null;

  apiUrl = 'http://localhost:3001'; // À adapter selon l'environnement

  constructor(private http: HttpClient, private pictosService: PictosService) {}

  ngOnInit() {
    this.loadTextDonation();
    this.loadClothingExamples();
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

  // Gestion clothing-examples
  loadClothingExamples() {
    this.loadingCollectes = true;
    this.http.get(`${environment.apiUrl}/clothing-examples`).subscribe({
      next: (data: any) => {
        this.clothingExamples = data;
        this.loadingCollectes = false;
      },
      error: () => { this.loadingCollectes = false; }
    });
  }

  openAddModal() {
    this.editMode = false;
    this.currentItem = { name: '', imageUrl: '', description: '', accepted: false };
    this.showModal = true;
  }

  openEditModal(item: any) {
    this.editMode = true;
    this.currentItem = { ...item };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveClothingExample() {
    if (this.editMode) {
      this.http.patch(`${environment.apiUrl}/clothing-examples/${this.currentItem.id}`, this.currentItem).subscribe(() => {
        this.loadClothingExamples();
        this.closeModal();
      });
    } else {
      this.http.post(`${environment.apiUrl}/clothing-examples`, this.currentItem).subscribe(() => {
        this.loadClothingExamples();
        this.closeModal();
      });
    }
  }

  deleteClothingExample(item: any) {
    if (confirm('Supprimer cette collecte ?')) {
      this.http.delete(`${environment.apiUrl}/clothing-examples/${item.id}`).subscribe(() => {
        this.loadClothingExamples();
      });
    }
  }

  toggleAccepted(item: any) {
    this.http.patch(`${environment.apiUrl}/clothing-examples/${item.id}`, { accepted: item.accepted }).subscribe();
  }

  openLibrary() {
    this.showLibrary = true;
    this.loadPictos();
  }

  closeLibrary() {
    this.showLibrary = false;
  }

  loadPictos() {
    this.pictosService.getPictos().subscribe(data => this.pictosList = data);
  }

  selectPictoFromLibrary(picto: any) {
    this.currentItem.imageUrl = picto.url;
    this.selectedPictoId = picto.id;
    this.closeLibrary();
  }

  removePicto(picto: any) {
    if (confirm('Supprimer cette image ?')) {
      this.pictosService.deletePicto(picto.id).subscribe(() => this.loadPictos());
    }
  }

  uploadPicto(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.pictosService.uploadPicto(file).subscribe(() => this.loadPictos());
    }
  }
} 