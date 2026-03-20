import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, tap, retry } from 'rxjs';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { DialogService } from '@/app/core/services/dialog.service';
import { CatchErrorService } from '@/app/core/services/catch-error.service';
import { Tenant } from './tenant-model';
import { TenantsApiService } from './tenants-api-service';

@Injectable({ providedIn: 'root' })
export class TenantsService {
  private tenantsApiService = inject(TenantsApiService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(DialogService);
  private catchErrorService = inject(CatchErrorService);

  tenants = signal<Tenant[]>([]);
  loading = signal<boolean>(false);
  loadingList = signal<boolean>(false);
  error = signal<string | null>(null);
  searchTerm = signal<string>('');

  dataSource = new MatTableDataSource<Tenant>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.tenants();
    });
  }

  applySearchFilter(searchValue: string): void {
    this.searchTerm.set(searchValue.trim());
    this.loadTenants();
  }

  loadTenants(): void {
    this.loadingList.set(true);
    this.error.set(null);

    this.tenantsApiService
      .getAll(this.searchTerm())
      .pipe(
        retry({ count: 2, delay: 1000 }),
        tap((tenants) => {
          this.tenants.set(tenants);
          this.loadingList.set(false);
        }),
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al cargar los tenants');
          this.error.set(errorMessage);
          this.loadingList.set(false);
          return of([]);
        })
      )
      .subscribe();
  }

  getTenantById(id: number) {
    return toSignal(
      this.tenantsApiService.getById(id).pipe(
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al cargar el tenant');
          this.error.set(errorMessage);
          return of(null);
        })
      )
    );
  }

  createTenant(tenant: Omit<Tenant, 'id'>) {
    this.loading.set(true);
    this.error.set(null);

    return this.tenantsApiService
      .create(tenant)
      .pipe(
        tap((newTenant) => {
          this.tenants.update((tenants) => [...tenants, newTenant]);
          this.loading.set(false);
          this.snackbarService.success('Tenant creado');
        }),
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al crear el tenant');
          this.error.set(errorMessage);
          this.loading.set(false);
          this.dialogService.errorAlert(errorMessage);
          return of(null);
        })
      );
  }

  updateTenant(id: number, tenant: Partial<Tenant>) {
    this.loading.set(true);
    this.error.set(null);
    return this.tenantsApiService
      .update(id, tenant)
      .pipe(
        tap((updatedTenant) => {
          this.tenants.update((tenants) =>
            tenants.map((t) => (t.id === id ? updatedTenant : t))
          );
          this.loading.set(false);
          this.snackbarService.success('Tenant actualizado');
        }),
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al actualizar el tenant');
          this.error.set(errorMessage);
          this.loading.set(false);
          this.dialogService.errorAlert(errorMessage);
          return of(null);
        })
      );
  }

  deleteTenant(id: number) {
    this.loading.set(true);
    this.error.set(null);

    return this.tenantsApiService
      .delete(id)
      .pipe(
        tap(() => {
          this.tenants.update((tenants) => tenants.filter((t) => t.id !== id));
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
