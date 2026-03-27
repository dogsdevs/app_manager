import { AfterViewInit, Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterOutlet } from '@angular/router';
import { EmptyStateComponent } from '@/app/core/components/empty-state/empty-state.component';
import { TableSkeletonComponent } from '@/app/core/components/table-skeleton/table-skeleton.component';
import { MatPaginatorIntlEs } from '@/app/core/i18n/mat-paginator-intl-es';
import { Media } from '@/app/core/media';
import { HighlightPipe } from '@/app/core/pipes/highlight.pipe';
import { DialogService } from '@/app/core/services/dialog.service';
import { RolesService } from '../../data/roles-service';


type DrawerMode = 'closed' | 'create' | 'edit';

@Component({
  selector: 'management-role-list',
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
    HighlightPipe,
    MatTooltipModule,
    TableSkeletonComponent,
    EmptyStateComponent
  ],
  providers: [
    { provide: MatPaginatorIntl, useClass: MatPaginatorIntlEs }
  ],
  templateUrl: './role-list.html',
})
export default class RoleList implements AfterViewInit {
  private media = inject(Media);
  private router = inject(Router);
  private rolesService = inject(RolesService);
  private confirmationDialog = inject(DialogService);

  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') searchInput!: ElementRef<HTMLInputElement>;

  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  
  moduleUrl =  '/admin/management/roles';
  drawerMode = signal<DrawerMode>('closed');
  selectedRoleId = signal<string | null>(null);
  isDrawerOpen = computed(() => this.drawerMode() !== 'closed');

  displayedColumns: string[] = ['name', 'description', 'guardName','tenantId', 'actions'];

  roles = this.rolesService.roles;
  loading = this.rolesService.loading;
  loadingList = this.rolesService.loadingList;
  error = this.rolesService.error;
  dataSource = this.rolesService.dataSource;
  searchTerm = this.rolesService.searchTerm;

  constructor() {
    this.rolesService.loadRoles();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm.set(filterValue);
    this.rolesService.applySearchFilter(filterValue);
  }

  clearSearch(): void {
    this.searchTerm.set('');
    this.rolesService.applySearchFilter('');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  openCreateDrawer(): void {
    this.drawerMode.set('create');
    this.selectedRoleId.set(null);
    this.router.navigate([`${this.moduleUrl}/new`]);
  }

  openEditDrawer(roleId: string): void {
    this.drawerMode.set('edit');
    this.selectedRoleId.set(roleId);
    this.router.navigate([`${this.moduleUrl}/edit`, roleId]);
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedRoleId.set(null);
    this.router.navigate(['/admin/management/roles']);
  }


  deleteRole(roleId: number): void {
    this.confirmationDialog
      .confirmDeleteWithAction(
        '¿Estás seguro?',
        'Esta acción eliminará este rol y no estará disponible para su uso.',
        () => this.rolesService.deleteRole(roleId)
      )
      .subscribe();
  }
}
