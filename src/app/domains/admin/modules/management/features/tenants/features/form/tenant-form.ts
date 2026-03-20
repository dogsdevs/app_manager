import { TextFieldModule } from '@angular/cdk/text-field';
import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, signal, ViewChild, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { TenantsService } from '../../data/tenants-service';
import TenantList from '../list/tenant-list';
import { FormChangesDetectorService } from '@/app/core/services/form-changes-detector.service';

@Component({
  selector: 'management-tenant-form',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatRippleModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tenant-form.html',
})
export default class TenantForm implements OnInit, AfterViewInit {
  private formBuilder = inject(UntypedFormBuilder);
  private tenantsListComponent = inject(TenantList);
  private tenantsService = inject(TenantsService);
  private route = inject(ActivatedRoute);
  private formChangesDetector = inject(FormChangesDetectorService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('nameField') nameField!: ElementRef;

  hasChanges = signal<boolean>(true);

  get isSaveDisabled(): boolean {
    if (this.tenantForm.invalid) return true;
    if (this.loading()) return true;
    if (this.isEditMode() && this.hasChanges() === false) return true;
    return false;
  }

  tenantForm!: UntypedFormGroup;
  tenantId = signal<number | null>(null);
  isEditMode = computed(() => this.tenantId() !== null);
  formTitle = computed(() => this.isEditMode() ? 'Editar Tenant' : 'Nuevo Tenant');
  formDescription = computed(() =>
    this.isEditMode()
      ? 'Modifica los detalles del tenant seleccionado'
      : 'Completa la información para crear un nuevo tenant'
  );
  loading = this.tenantsService.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.tenantId.set(id ? Number(id) : null);
    this.tenantForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      slug: ['', [Validators.required]],
    });
    if (this.isEditMode()) {
      this.loadTenantData(this.tenantId()!);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameField?.nativeElement?.focus();
    }, 300);
  }

  loadTenantData(id: number): void {
    const tenant = this.tenantsService.tenants().find(t => t.id === id);

    if (tenant) {
      const originalData = {
        name: tenant.name,
        slug: tenant.slug,
      };

      this.tenantForm.patchValue(originalData);

      this.formChangesDetector.observeChanges(this.tenantForm, originalData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(changed => this.hasChanges.set(changed));
    }
  }

  save(): void {
    if (this.tenantForm.invalid) {
      return;
    }

    const tenantData = this.tenantForm.value;

    const operation$ = this.isEditMode()
      ? this.tenantsService.updateTenant(this.tenantId()!, tenantData)
      : this.tenantsService.createTenant(tenantData);

    operation$.subscribe((result) => {
      if (result) {
        this.closeDrawer();
      }
    });
  }

  closeDrawer(): void {
    this.tenantsListComponent.closeDrawer();
  }
}
