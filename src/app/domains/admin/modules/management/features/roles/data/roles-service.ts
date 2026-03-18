import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, tap } from 'rxjs';
import { NotificationService } from '@/app/core/services/notification.service';
import { Role } from './role-model';
import { RolesApiService } from './roles-api-service';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private rolesApiService = inject(RolesApiService);
  private notificationService = inject(NotificationService);

  roles = signal<Role[]>([]);
  loading = signal<boolean>(false);
  loadingList = signal<boolean>(false);
  loadingToggle = signal<string | null>(null);
  error = signal<string | null>(null);
  showOnlyEnabled = signal<boolean>(true);
  searchTerm = signal<string>('');
  
  showDisabledRows = computed(() => !this.showOnlyEnabled());

  dataSource = new MatTableDataSource<Role>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.roles();
    });
    effect(() => {
      this.applyEnabledFilter(this.showOnlyEnabled());
    });
    this.setupFilterPredicate();
  }

  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: Role, filter: string) => {
      const filterObj = JSON.parse(filter || '{}');
      const matchesSearch = !filterObj.search || data.name.toLowerCase().includes(filterObj.search);
      const matchesEnabled = !filterObj.onlyEnabled || data.enabled;
      return matchesSearch && matchesEnabled;
    };
  }

  applySearchFilter(searchValue: string): void {
    const currentFilter = this.getCurrentFilter();
    currentFilter.search = searchValue.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(currentFilter);
  }

  applyEnabledFilter(onlyEnabled: boolean): void {
    const currentFilter = this.getCurrentFilter();
    currentFilter.onlyEnabled = onlyEnabled;
    this.dataSource.filter = JSON.stringify(currentFilter);
  }

  private getCurrentFilter(): { search?: string; onlyEnabled?: boolean } {
    try {
      return JSON.parse(this.dataSource.filter || '{}');
    } catch {
      return {};
    }
  }

  loadRoles(): void {
    this.loadingList.set(true);
    this.error.set(null);

    this.rolesApiService
      .getAll()
      .pipe(
        tap((roles) => {
          this.roles.set(roles);
          this.loadingList.set(false);
        }),
        catchError((error) => {
          this.error.set('Error al cargar los roles');
          this.loadingList.set(false);
          console.error('Error loading roles:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  getRoleById(id: string) {
    return toSignal(
      this.rolesApiService.getById(id).pipe(
        catchError((error) => {
          this.error.set('Error al cargar el rol');
          console.error('Error loading role:', error);
          return of(null);
        })
      )
    );
  }

  createRole(role: Omit<Role, 'id'>) {
    this.loading.set(true);
    this.error.set(null);

    return this.rolesApiService
      .create(role)
      .pipe(
        tap((newRole) => {
          this.roles.update((roles) => [...roles, newRole]);
          this.loading.set(false);
          this.notificationService.success('Rol creado exitosamente');
        }),
        catchError((error) => {
          this.error.set('Error al crear el rol');
          this.loading.set(false);
          this.notificationService.error('Error al crear el rol');
          console.error('Error creating role:', error);
          return of(null);
        })
      );
  }

  updateRole(id: string, role: Partial<Role>) {
    this.loading.set(true);
    this.error.set(null);

    return this.rolesApiService
      .update(id, role)
      .pipe(
        tap((updatedRole) => {
          this.roles.update((roles) =>
            roles.map((r) => (r.id === id ? updatedRole : r))
          );
          this.loading.set(false);
          this.notificationService.success('Rol actualizado exitosamente');
        }),
        catchError((error) => {
          this.error.set('Error al actualizar el rol');
          this.loading.set(false);
          this.notificationService.error('Error al actualizar el rol');
          console.error('Error updating role:', error);
          return of(null);
        })
      );
  }

  deleteRole(id: string) {
    this.loading.set(true);
    this.error.set(null);

    return this.rolesApiService
      .delete(id)
      .pipe(
        tap(() => {
          this.roles.update((roles) => roles.filter((r) => r.id !== id));
          this.loading.set(false);
          this.notificationService.success('Rol eliminado exitosamente');
        }),
        catchError((error) => {
          this.error.set('Error al eliminar el rol');
          this.loading.set(false);
          this.notificationService.error('Error al eliminar el rol');
          console.error('Error deleting role:', error);
          return of(null);
        })
      );
  }

  toggleEnabled(id: string, enabled: boolean): void {
    this.loadingToggle.set(id);
    
    this.rolesApiService
      .toggleEnabled(id, enabled)
      .pipe(
        tap((updatedRole) => {
          this.roles.update((roles) =>
            roles.map((r) => (r.id === id ? updatedRole : r))
          );
          this.loadingToggle.set(null);
          const message = enabled ? 'Rol habilitado exitosamente' : 'Rol deshabilitado exitosamente';
          this.notificationService.success(message);
        }),
        catchError((error) => {
          this.error.set('Error al cambiar el estado del rol');
          this.loadingToggle.set(null);
          this.notificationService.error('Error al cambiar el estado del rol');
          console.error('Error toggling role enabled:', error);
          return of(null);
        })
      )
      .subscribe();
  }
}
