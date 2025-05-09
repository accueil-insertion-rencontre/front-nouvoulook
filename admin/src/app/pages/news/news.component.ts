import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermissionsService } from '../../services/permissions.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="permissionsLoaded">
      <ng-container *ngIf="hasAccess; else forbidden">
        <h2>Actualités</h2>
        <p>Bienvenue sur la page des actualités.</p>
      </ng-container>
      <ng-template #forbidden>
        <div class="alert alert-danger mt-4">Accès refusé : vous n'avez pas la permission d'accéder à cette page.</div>
      </ng-template>
    </ng-container>
    <ng-container *ngIf="!permissionsLoaded">
      <div>Chargement des permissions...</div>
    </ng-container>
  `
})
export class NewsComponent implements OnDestroy {
  hasAccess = false;
  permissionsLoaded = false;
  sub: Subscription;

  constructor(private permissions: PermissionsService) {
    this.sub = this.permissions.getPermissions().subscribe(perms => {
      this.hasAccess = perms.some(p => p.resource === 'news');
      this.permissionsLoaded = true;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
} 