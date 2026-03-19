import { effect, inject, Injectable, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, tap, retry } from 'rxjs';
import { NotificationService } from '@/app/core/services/notification.service';
import { Tenant } from './tenant-model';
import { TenantsApiService } from './tenants-api-service';

@Injectable({ providedIn: 'root' })
export class TenantsService {
  private tenantsApiService = inject(TenantsApiService);
  private notificationService = inject(NotificationService);

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
    this.loadTenants(); // Trigger API call for server-side search
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
          this.error.set('Error al cargar los tenants');
          this.loadingList.set(false);
          console.error('Error loading tenants:', error);
          return of([]);
        })
      )
      .subscribe();
  }

  getTenantById(id: number) {
    return toSignal(
      this.tenantsApiService.getById(id).pipe(
        catchError((error) => {
          this.error.set('Error al cargar el tenant');
          console.error('Error loading tenant:', error);
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
          this.notificationService.success('Tenant creado exitosamente');
        }),
        catchError((error) => {
          this.error.set('Error al crear el tenant');
          this.loading.set(false);
          this.notificationService.error('Error al crear el tenant');
          console.error('Error creating tenant:', error);
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
          this.notificationService.success('Tenant actualizado exitosamente');
        }),
        catchError((error) => {
          this.error.set('Error al actualizar el tenant');
          this.loading.set(false);
          this.notificationService.error('Error al actualizar el tenant');
          console.error('Error updating tenant:', error);
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
          this.notificationService.success('Tenant eliminado exitosamente');
        }),
        catchError((error) => {
          this.error.set('Error al eliminar el tenant');
          this.loading.set(false);
          this.notificationService.error('Error al eliminar el tenant');
          console.error('Error deleting tenant:', error);
          return of(null);
        })
      );
  }
}
