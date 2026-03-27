import { MatPaginatorIntlEs } from '@/app/core/i18n/mat-paginator-intl-es';
import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../data/users-service';
import { HighlightPipe } from '@/app/core/pipes/highlight.pipe';
import { EmptyStateComponent } from '@/app/core/components/empty-state/empty-state.component';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { RouterOutlet } from "@angular/router";
import { TableSkeletonComponent } from "@/app/core/components/table-skeleton/table-skeleton.component";
import { Media } from '@/app/core/media';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { User } from '../../data/user-model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggle } from '@angular/material/slide-toggle';

type DrawerMode = 'closed' | 'create' | 'edit';

@Component({
  selector: 'management-user-list',
  imports: [
      MatIcon,
    MatButton,
    RouterOutlet,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconButton,
    MatMenuModule,
    MatFormField,
    MatInput,
    MatSlideToggle,
    HighlightPipe,
    MatTooltipModule,
    TableSkeletonComponent,
    EmptyStateComponent

  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs }
  ],
  templateUrl: './user-list.html',
})
export default class UserList {
  private usersService = inject(UsersService);
  private media = inject(Media);


  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') searchInput!: ElementRef<HTMLInputElement>;

  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );


  drawerMode = signal<DrawerMode>('closed');
  isDrawerOpen = computed(() => this.drawerMode() !== 'closed');
  displayedColumns: string[] = ['indicator', 'identityKey', 'email', 'isActive', 'actions'];

  users = this.usersService.users;
  loading = this.usersService.loading;
  loadingList = this.usersService.loadingList;
  loadingToggle = this.usersService.loadingToggle;
  error = this.usersService.error;
  dataSource = this.usersService.dataSource;
  searchTerm = this.usersService.searchTerm;
  showDisabledRows = this.usersService.showDiableRows;


  private searchSubject = new Subject<string>();
  

  constructor() {
    this.usersService.loadUsers();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.usersService.applySearchFilter(searchValue);
    });

  }


  toggleIsActive(user: User): void {
    this.usersService.toggleIsActive(user);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm.set(filterValue);
    this.usersService.applySearchFilter(filterValue);
  }

  clearSearch(): void {
    this.usersService.applySearchFilter('');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  toggleIsActiveFilter(value: boolean): void {
    this.showDisabledRows.set(value);
    this.usersService.applyIsActiveFilter(value);
  }



  openCreateDrawer(): void {

  }

  openEditDrawer(userId: number): void {

  }

  closeDrawer(): void {

  }

  deleteUser(userId: number): void {

  }

}
