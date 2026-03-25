import { effect, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, retry, tap } from 'rxjs';
import { CatchErrorService } from '@/app/core/services/catch-error.service';
import { DialogService } from '@/app/core/services/dialog.service';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { Role } from './role-model';
import { RolesApiService } from './roles-api-service';


@Injectable({ providedIn: 'root' })
export class RolesService {
  private rolesApiService = inject(RolesApiService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(DialogService);
  private catchErrorService = inject(CatchErrorService);

  roles = signal<Role[]>([]);
  loading = signal<boolean>(false);
  loadingList = signal<boolean>(false);
  error = signal<string | null>(null);
  searchTerm = signal<string>('');
  
  dataSource = new MatTableDataSource<Role>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.roles();
    });
  }

  applySearchFilter(searchValue: string): void {
    this.searchTerm.set(searchValue.trim());
    this.loadRoles();
  }

  loadRoles(): void {
    this.loadingList.set(true);
    this.error.set(null);
    this.rolesApiService
      .getAll(this.searchTerm())
      .pipe(
        retry({ count: 2, delay: 1000 }),
        tap((roles) => {
          this.roles.set(roles);
          this.loadingList.set(false);
        }),
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al cargar los roles');
          this.error.set(errorMessage);
          this.loadingList.set(false);
          return of([]);
        })
      )
      .subscribe();
  }

  getRoleById(id: number) {
    return toSignal(
      this.rolesApiService.getById(id).pipe(
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al cargar el rol');
          this.error.set(errorMessage);
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
          this.snackbarService.success('Rol creado exitosamente');
        }),
        catchError((error) => {
         const errorMessage = this.catchErrorService.getMessage(error, 'Error al crear el rol');
          this.error.set(errorMessage);
          this.loading.set(false);
          this.dialogService.errorAlert(errorMessage);
          return of(null);
        })
      );
  }

  updateRole(id: number, role: Partial<Role>) {
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
          this.snackbarService.success('Rol actualizado');
        }),
        catchError((error) => {
           const errorMessage = this.catchErrorService.getMessage(error, 'Error al actualizar el rol');
          this.error.set(errorMessage);
          this.loading.set(false);
          this.dialogService.errorAlert(errorMessage);
          return of(null);
        })
      );
  }

  deleteRole(id: number) {
    this.loading.set(true);
    this.error.set(null);

    return this.rolesApiService
      .delete(id)
      .pipe(
        tap(() => {
          this.roles.update((roles) => roles.filter((r) => r.id !== id));
          this.loading.set(false);
          this.snackbarService.success('Tenant eliminado');
        }),
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al eliminar el tenant');
          this.error.set(errorMessage);
          this.loading.set(false);
          this.dialogService.errorAlert(errorMessage);
          return of(null);
        })
      );
  }
}
