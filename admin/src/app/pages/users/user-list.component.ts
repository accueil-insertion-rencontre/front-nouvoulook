import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <ng-container *ngIf="isAdmin; else forbidden">
      <h2>Liste des utilisateurs</h2>
      <button class="btn btn-success mb-3" (click)="openAddModal()">Ajouter un utilisateur</button>
      <table class="table table-striped" *ngIf="users.length">
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.firstname }}</td>
            <td>{{ user.lastname }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles ? user.roles.join(', ') : '' }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2" (click)="openEditModal(user)">Modifier</button>
              <button class="btn btn-sm btn-danger" (click)="deleteUser(user)" [disabled]="user.id === currentUserId">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div *ngIf="!users.length && !loading">Aucun utilisateur trouvé.</div>
      <div *ngIf="loading">Chargement...</div>

      <!-- Modal Ajouter -->
      <div class="modal fade" tabindex="-1" [ngClass]="{'show d-block': showAddModal}" *ngIf="showAddModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Ajouter un utilisateur</h5>
              <button type="button" class="btn-close" (click)="closeAddModal()"></button>
            </div>
            <div class="modal-body">
              <form #addForm="ngForm">
                <div class="mb-3">
                  <label>Prénom</label>
                  <input type="text" class="form-control" [(ngModel)]="addUser.firstname" name="firstname" required />
                </div>
                <div class="mb-3">
                  <label>Nom</label>
                  <input type="text" class="form-control" [(ngModel)]="addUser.lastname" name="lastname" required />
                </div>
                <div class="mb-3">
                  <label>Email</label>
                  <input type="email" class="form-control" [(ngModel)]="addUser.email" name="email" required />
                </div>
                <div class="mb-3">
                  <label>Mot de passe</label>
                  <input type="password" class="form-control" [(ngModel)]="addUser.password" name="password" required />
                </div>
                <div class="mb-3">
                  <label>Rôle</label>
                  <select class="form-select" [(ngModel)]="addUser.role" name="role" required>
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeAddModal()">Annuler</button>
              <button type="button" class="btn btn-success" (click)="addUserSubmit()">Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Modifier -->
      <div class="modal fade" tabindex="-1" [ngClass]="{'show d-block': showEditModal}" *ngIf="showEditModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Modifier le rôle</h5>
              <button type="button" class="btn-close" (click)="closeEditModal()"></button>
            </div>
            <div class="modal-body">
              <form #editForm="ngForm">
                <div class="mb-3">
                  <label>Rôle</label>
                  <select class="form-select" [(ngModel)]="editUser.role" name="editRole" required>
                    <option value="user">Utilisateur</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeEditModal()">Annuler</button>
              <button type="button" class="btn btn-primary" (click)="editUserSubmit()">Enregistrer</button>
            </div>
          </div>
        </div>
      </div>
    </ng-container>
    <ng-template #forbidden>
      <div class="alert alert-danger mt-4">
        Accès interdit : seuls les administrateurs peuvent gérer les utilisateurs.
        <div *ngIf="debugInfo" class="mt-2 small">
          <p>Rôle actuel : {{ userRole }}</p>
          <p>ID utilisateur : {{ currentUserId }}</p>
        </div>
      </div>
    </ng-template>
  `
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading = false;

  showAddModal = false;
  showEditModal = false;
  addUser: any = { firstname: '', lastname: '', email: '', password: '', role: 'user' };
  editUser: any = { id: '', role: 'user' };

  currentUserId: string = '';
  isAdmin: boolean = false;
  userRole: string = '';
  debugInfo: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    console.log('User from storage:', user); // Debug log
    
    this.currentUserId = user?.id;
    this.userRole = user?.role;
    this.isAdmin = user?.role === 'admin';
    
    console.log('Current user ID:', this.currentUserId); // Debug log
    console.log('User role:', this.userRole); // Debug log
    console.log('Is admin:', this.isAdmin); // Debug log
    
    this.fetchUsers();
  }

  fetchUsers() {
    this.loading = true;
    this.http.get<any[]>(environment.apiUrl + '/users', {
      headers: {
        Authorization: 'Bearer ' + (localStorage.getItem('access_token') || sessionStorage.getItem('access_token'))
      }
    }).subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.users = [];
      }
    });
  }

  // Ajouter
  openAddModal() {
    this.addUser = { firstname: '', lastname: '', email: '', password: '', role: 'user' };
    this.showAddModal = true;
  }
  closeAddModal() { this.showAddModal = false; }
  addUserSubmit() {
    const userToSend = {
      firstname: this.addUser.firstname,
      lastname: this.addUser.lastname,
      email: this.addUser.email,
      password: this.addUser.password,
      roles: [this.addUser.role]
    };
    this.http.post(environment.apiUrl + '/auth/register', userToSend, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) }
    }).subscribe({
      next: () => { this.closeAddModal(); this.fetchUsers(); },
      error: () => { alert('Erreur lors de l\'ajout'); }
    });
  }

  // Modifier
  openEditModal(user: any) {
    this.editUser = { 
      id: user.id, 
      role: Array.isArray(user.roles) ? user.roles[0] : user.role || 'user' 
    };
    this.showEditModal = true;
  }
  closeEditModal() { this.showEditModal = false; }
  editUserSubmit() {
    const isSelfEdit = this.editUser.id === this.currentUserId;
    const userToPatch = { roles: [this.editUser.role] };
    this.http.patch(environment.apiUrl + '/users/' + this.editUser.id, userToPatch, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) }
    }).subscribe({
      next: () => {
        this.closeEditModal();
        this.fetchUsers();
        if (isSelfEdit) {
          alert('Votre rôle a été modifié. Vous allez être déconnecté et devez vous reconnecter pour que le changement soit pris en compte.');
          setTimeout(() => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('refresh_token');
            sessionStorage.removeItem('user');
            window.location.href = '/';
          }, 500);
        } else {
          alert('Rôle modifié. Si la modification concerne votre propre compte, reconnectez-vous pour que le changement soit effectif.');
        }
      },
      error: () => { alert('Erreur lors de la modification'); }
    });
  }

  // Supprimer
  deleteUser(user: any) {
    if (user.id === this.currentUserId) {
      alert('Vous ne pouvez pas supprimer votre propre compte.');
      return;
    }
    if (confirm('Supprimer cet utilisateur ?')) {
      this.http.delete(environment.apiUrl + '/users/' + user.id, {
        headers: { Authorization: 'Bearer ' + (localStorage.getItem('access_token') || sessionStorage.getItem('access_token')) }
      }).subscribe({
        next: () => this.fetchUsers(),
        error: () => alert('Erreur lors de la suppression')
      });
    }
  }
} 