import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Role } from './role-model';

@Injectable({ providedIn: 'root' })
export class RolesApiService {
  private mockRoles: Role[] = [
    { id: '1', name: 'Administrador', enabled: true },
    { id: '3', name: 'Editor', enabled: false },
  ];

  private nextId = 5;

  getAll(): Observable<Role[]> {
    return of([...this.mockRoles]).pipe(delay(500));
  }

  getById(id: string): Observable<Role> {
    const role = this.mockRoles.find((r) => r.id === id);
    if (!role) {
      return throwError(() => new Error('Rol no encontrado'));
    }
    return of({ ...role }).pipe(delay(300));
  }

  create(role: Omit<Role, 'id'>): Observable<Role> {
    const newRole: Role = {
      ...role,
      id: String(this.nextId++),
    };
    this.mockRoles.push(newRole);
    return of({ ...newRole }).pipe(delay(500));
  }

  update(id: string, role: Partial<Role>): Observable<Role> {
    const index = this.mockRoles.findIndex((r) => r.id === id);
    if (index === -1) {
      return throwError(() => new Error('Rol no encontrado'));
    }
    this.mockRoles[index] = { ...this.mockRoles[index], ...role };
    return of({ ...this.mockRoles[index] }).pipe(delay(500));
  }

  delete(id: string): Observable<void> {
    const index = this.mockRoles.findIndex((r) => r.id === id);
    if (index === -1) {
      return throwError(() => new Error('Rol no encontrado'));
    }
    this.mockRoles.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }

  toggleEnabled(id: string, enabled: boolean): Observable<Role> {
    const index = this.mockRoles.findIndex((r) => r.id === id);
    if (index === -1) {
      return throwError(() => new Error('Rol no encontrado'));
    }
    this.mockRoles[index].enabled = enabled;
    return of({ ...this.mockRoles[index] }).pipe(delay(300));
  }
}
