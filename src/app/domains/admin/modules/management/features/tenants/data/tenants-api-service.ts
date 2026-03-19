import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { Tenant } from './tenant-model';
import { environment } from '../../../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TenantsApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tenants`;

  getAll(q?: string): Observable<Tenant[]> {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }

    const request$ = this.http.get<Tenant[]>(this.apiUrl, { params });

    return forkJoin([request$, timer(350)]).pipe(
      map(([response]) => response)
    );
  }

  getById(id: number): Observable<Tenant> {
    return this.http.get<Tenant>(`${this.apiUrl}/${id}`);
  }

  create(tenant: Omit<Tenant, 'id'>): Observable<Tenant> {
    return this.http.post<Tenant>(this.apiUrl, tenant);
  }

  update(id: number, tenant: Partial<Tenant>): Observable<Tenant> {
    return this.http.put<Tenant>(`${this.apiUrl}/${id}`, tenant);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
