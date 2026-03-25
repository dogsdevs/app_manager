import { TextFieldModule } from '@angular/cdk/text-field';
import { AfterViewInit, Component, computed, DestroyRef, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { tentantId } from '@/app/app.constants';
import { FormChangesDetectorService } from '@/app/core/services/form-changes-detector.service';
import { RolesService } from '../../data/roles-service';
import RoleList from '../list/role-list';

@Component({
  selector: 'management-role-form',
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
  templateUrl: './role-form.html',
})
export default class RoleForm implements OnInit, AfterViewInit {
  private formBuilder = inject(UntypedFormBuilder);
  private rolesListComponent = inject(RoleList);
  private rolesService = inject(RolesService);
  private route = inject(ActivatedRoute);
  private formChangesDetector = inject(FormChangesDetectorService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('nameField') nameField!: ElementRef;

  hasChanges = signal<boolean>(true);

  get isSaveDisabled(): boolean {
    if (this.roleForm.invalid) return true;
    if (this.loading()) return true;
    if (this.isEditMode() && this.hasChanges() === false) return true;
    return false;
  }

  roleForm!: UntypedFormGroup;
  roleId = signal<number | null>(null);
  isEditMode = computed(() => this.roleId() !== null);
  formTitle = computed(() => this.isEditMode() ? 'Editar Rol' : 'Nuevo Rol');
  formDescription = computed(() => 
    this.isEditMode() 
      ? 'Modifica los detalles del rol seleccionado' 
      : 'Completa la información para crear un nuevo rol'
  );
  loading = this.rolesService.loading;

  constructor() {
    effect(() => {
      if (this.loading()) {
        this.roleForm?.get('name')?.disable();
        this.roleForm?.get('description')?.disable();
        this.roleForm?.get('guardName')?.disable();
      } else {
        this.roleForm?.get('name')?.enable();
        this.roleForm?.get('description')?.enable();
        this.roleForm?.get('guardName')?.enable();
      }
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.roleId.set(id ? Number(id) : null);
    this.initForm();
    if (this.isEditMode()) {
      this.loadRoleData(this.roleId()!);
    }
  }

  initForm(): void {
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      guardName: ['', [Validators.required]],
      tenantId: [tentantId, [Validators.required]],
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameField?.nativeElement?.focus();
    }, 300);
  }

  loadRoleData(id: number): void {
    const role = this.rolesService.roles().find(r => r.id === id);

    if (role) {
      const originalData = {
        name: role.name,
        description: role.description,
        guardName: role.guardName,
        tenantId: role.tenantId,
      };

      this.roleForm.patchValue(originalData);

      this.formChangesDetector.observeChanges(this.roleForm, originalData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(changed => this.hasChanges.set(changed));
    }
  }

  save(): void {
    if (this.roleForm.invalid) {
      return;
    }
    
    const roleData = this.roleForm.value;
    
    const operation$ = this.isEditMode()
      ? this.rolesService.updateRole(this.roleId()!, roleData)
      : this.rolesService.createRole(roleData);
    
    operation$.subscribe((result) => {
      if (result) {
        this.closeDrawer();
      }
    });
  }

  closeDrawer(): void {
    this.rolesListComponent.closeDrawer();
  }
}
