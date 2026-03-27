import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { forkJoin, map, Observable, timer } from 'rxjs';
import { environment } from '../../../../../../../../environments/environment';
import { Role } from './role-model';

@Injectable({ providedIn: 'root' })
export class RolesApiService {

    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/roles`;
  

  getAll(q?: string): Observable<Role[]> {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }
     const request$ = this.http.get<Role[]>(this.apiUrl, { params });
    
    return forkJoin([request$, timer(350)]).pipe(
      map(([response]) => response)
    );
  }

  getById(id: number): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/${id}`);
  }

  create(role: Omit<Role, 'id'>): Observable<Role> {
    return this.http.post<Role>(this.apiUrl, role);
  }

  update(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.put<Role>(`${this.apiUrl}/${id}`, role);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
