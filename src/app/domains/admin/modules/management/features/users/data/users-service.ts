import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { User } from './user-model';
import { UsersApiService } from './users-api-service';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, of, retry, tap } from 'rxjs';
import { CatchErrorService } from '@/app/core/services/catch-error.service';
import { SnackbarService } from '@/app/core/services/snackbar.service';
import { DialogService } from '@/app/core/services/dialog.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersApiService = inject(UsersApiService);
  private catchErrorService = inject(CatchErrorService);
  private snackbarService = inject(SnackbarService);
  private dialogService = inject(DialogService);

  users = signal<User[]>([]);
  loadingList = signal<boolean>(false);
  loading = signal<boolean>(false);
  loadingToggle = signal<number | null>(null);
  error = signal<string | null>(null);
  showDiableRows = signal<boolean>(false);
  searchTerm = signal<string>('');


  dataSource = new MatTableDataSource<User>([]);


  constructor() {
    effect(() => {
      this.dataSource.data = this.users();
    });
    effect(() => {
      this.applyIsActiveFilter(this.showDiableRows());
    })
  }


  applySearchFilter(searchValue: string): void {
    this.searchTerm.set(searchValue.trim());
    this.loadUsers();
  }

  applyIsActiveFilter(value: boolean): void {
    this.showDiableRows.set(value);
    this.loadUsers();
  }


  loadUsers(): void {
    this.loadingList.set(true);
    this.error.set(null);

    this.usersApiService
      .getAll(
        this.searchTerm(),
        this.showDiableRows()
      )
      .pipe(
        retry({ count: 2, delay: 1000 }),
        tap((users) => {
          this.users.set(users);
          this.loadingList.set(false);
        }),
        catchError((error) => {
          const errorMessage = this.catchErrorService.getMessage(error, 'Error al cargar los usuarios');
          this.error.set(errorMessage);
          this.loadingList.set(false);
          return of([]);
        })
      )
      .subscribe();
  }


  toggleIsActive(user: User): void {
    this.loadingToggle.set(user.id);

    const updateUser = {
      ...user,
      isActive: !user.isActive
    };

    this.usersApiService
      .toggleIsActive(updateUser)
      .pipe(
        tap((responseUser) => {
          this.users.update((users) =>
            users.map((u) => (u.id === user.id ? responseUser : u))
          );

          this.loadingToggle.set(null);

          const message = updateUser.isActive
            ? 'Usuario habilitado '
            : 'Usuario deshabilitado ';

          this.snackbarService.success(message);
        }),
        catchError((error) => {
          this.error.set('Error al cambiar el estado del usuario');
          this.loadingToggle.set(null);
          this.dialogService.errorAlert('Error al cambiar el estado del usuario');
          console.error('Error toggling user isActive:', error);
          return of(null);
        })
      )
      .subscribe();
  }

}
