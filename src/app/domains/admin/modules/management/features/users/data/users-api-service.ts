import { environment } from '@/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from './user-model';
import { forkJoin, map, Observable, timer } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersApiService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/users`;

  getAll(q?: string, showDisabledRows?: boolean): Observable<User[]> {
    let params = new HttpParams();
    if (q) {
      params = params.set('q', q);
    }

    if (showDisabledRows == false) {
      params = params.set('isActive', true);
    }

    const request$ = this.http.get<User[]>(this.apiUrl, { params });

    return forkJoin([request$, timer(350)]).pipe(
      map(([response]) => response)
    );
  }

  toggleIsActive(user: User): Observable<User> {

    const request$ = this.http.put<User>(`${this.apiUrl}/${user.id}`,
      user
    );

    return forkJoin([request$, timer(350)]).pipe(
      map(([response]) => response)
    );
  }


}
