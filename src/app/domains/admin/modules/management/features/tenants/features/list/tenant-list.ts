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
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { EmptyStateComponent } from '@/app/core/components/empty-state/empty-state.component';
import { TableSkeletonComponent } from '@/app/core/components/table-skeleton/table-skeleton.component';
import { MatPaginatorIntlEs } from '@/app/core/i18n/mat-paginator-intl-es';
import { Media } from '@/app/core/media';
import { HighlightPipe } from '@/app/core/pipes/highlight.pipe';
import { DialogService } from '@/app/core/services/dialog.service';
import { TenantsService } from '../../data/tenants-service';

type DrawerMode = 'closed' | 'create' | 'edit';

@Component({
  selector: 'management-tenant-list',
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
  templateUrl: './tenant-list.html',
})
export default class TenantList implements AfterViewInit {
  private media = inject(Media);
  private router = inject(Router);
  private tenantsService = inject(TenantsService);
  private confirmationDialog = inject(DialogService);

  @ViewChild(MatDrawer) matDrawer!: MatDrawer;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('input') searchInput!: ElementRef<HTMLInputElement>;

  protected isMobile = computed(() =>
    this.media.match(`(max-width: 1023px)`)()
  );
  
  moduleUrl =  '/admin/management/tenants';
  drawerMode = signal<DrawerMode>('closed');
  selectedTenantId = signal<number | null>(null);
  isDrawerOpen = computed(() => this.drawerMode() !== 'closed');

  displayedColumns: string[] = ['name', 'slug', 'actions'];

  tenants = this.tenantsService.tenants;
  loading = this.tenantsService.loading;
  loadingList = this.tenantsService.loadingList;
  error = this.tenantsService.error;
  dataSource = this.tenantsService.dataSource;
  searchTerm = this.tenantsService.searchTerm;

  private searchSubject = new Subject<string>();

  constructor() {
    this.tenantsService.loadTenants();

    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(searchValue => {
      this.tenantsService.applySearchFilter(searchValue);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue);
  }

  clearSearch(): void {
    this.tenantsService.applySearchFilter('');
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  openCreateDrawer(): void {
    this.drawerMode.set('create');
    this.selectedTenantId.set(null);
    this.router.navigate([`${this.moduleUrl}/new`]);
  }

  openEditDrawer(tenantId: number): void {
    this.drawerMode.set('edit');
    this.selectedTenantId.set(tenantId);
    this.router.navigate([`${this.moduleUrl}/edit`, tenantId]);
  }

  closeDrawer(): void {
    this.drawerMode.set('closed');
    this.selectedTenantId.set(null);
    this.router.navigate([`${this.moduleUrl}`]);
  }

  deleteTenant(tenantId: number): void {
    this.confirmationDialog
      .confirmDeleteWithAction(
        '¿Estás seguro?',
        'Esta acción eliminará este tenant y no estará disponible para su uso.',
        () => this.tenantsService.deleteTenant(tenantId)
      )
      .subscribe();
  }
}
