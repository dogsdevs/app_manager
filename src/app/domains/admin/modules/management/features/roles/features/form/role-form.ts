import { TextFieldModule } from '@angular/cdk/text-field';
import { AfterViewInit, Component, computed, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
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
    // RouterLink,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    MatRippleModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './role-form.html',
})
export default class RoleForm implements OnInit, AfterViewInit {
  private formBuilder = inject(UntypedFormBuilder);
  private rolesListComponent = inject(RoleList);
  private rolesService = inject(RolesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  @ViewChild('nameField') nameField!: ElementRef;

  roleForm!: UntypedFormGroup;
  roleId = signal<string | null>(null);
  isEditMode = computed(() => this.roleId() !== null);
  formTitle = computed(() => this.isEditMode() ? 'Editar Rol' : 'Nuevo Rol');
  formDescription = computed(() => 
    this.isEditMode() 
      ? 'Modifica los detalles del rol seleccionado' 
      : 'Completa la información para crear un nuevo rol'
  );
  loading = this.rolesService.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.roleId.set(id);
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      enabled: [true],
    });
    if (this.isEditMode()) {
      this.loadRoleData(this.roleId()!);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameField?.nativeElement?.focus();
    }, 300);
  }

  loadRoleData(id: string): void {
    const role = this.rolesService.roles().find(r => r.id === id);
    
    if (role) {
      this.roleForm.patchValue({
        name: role.name,
        enabled: role.enabled,
      });
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
