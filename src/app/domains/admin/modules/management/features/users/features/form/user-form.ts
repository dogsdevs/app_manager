import { AfterViewInit, Component, computed, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import UserList from '../list/user-list';
import { UsersService } from '../../data/users-service';
import { ActivatedRoute } from '@angular/router';
import { FormChangesDetectorService } from '@/app/core/services/form-changes-detector.service';
import { tentantId } from '@/app/app.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-user-form',
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
    MatSlideToggleModule,
    MatProgressSpinnerModule],
  templateUrl: './user-form.html',
})
export default class UserForm implements OnInit, AfterViewInit {

  private formBuilder = inject(UntypedFormBuilder);
  private userListComponent = inject(UserList);
  private userService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private formChangesDetector = inject(FormChangesDetectorService);
  private destroyRef = inject(DestroyRef);

  @ViewChild('nameField') nameField!: ElementRef;

  hasChanges = signal<boolean>(true);

  get isSaveDisabled(): boolean {
    if (this.userForm.invalid) return true;
    if (this.loading()) return true;
    if (this.isEditMode() && this.hasChanges() === false) return true;
    return false;
  }

  userForm!: UntypedFormGroup;
  userId = signal<number | null>(null);
  isEditMode = computed(() => this.userId() !== null);
  formTitle = computed(() => this.isEditMode() ? 'Editar usuario' : 'Nuevo usuario');
  formDescription = computed(() =>
    this.isEditMode()
      ? 'Modifica los detalles del usuario seleccionado'
      : 'Completa la información para crear un nuevo usuario'
  );
  loading = this.userService.loading;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.userId.set(id ? Number(id) : null);
    this.initForm();
    if (this.isEditMode()) {
      this.loadUserData(this.userId()!);
    }
  }

  initForm(): void {
    this.userForm = this.formBuilder.group({
      tenantId: [tentantId, [Validators.required]],
      identityKey: ['', [Validators.required]],
      email: ['', [Validators.required]],
      //isActive: ['false'],

    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.nameField?.nativeElement?.focus();
    }, 300);
  }


  loadUserData(id: number): void {
    const user = this.userService.users().find(u => u.id === id);

    if (user) {
      const originalData = {
        tenantId: user.tenantId,
        identityKey: user.identityKey,
        email: user.email,
        //isActive: user.isActive,
      };

      this.userForm.patchValue(originalData);

      this.formChangesDetector.observeChanges(this.userForm, originalData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(changed => this.hasChanges.set(changed));
    }
  }

  save(): void {
    if (this.userForm.invalid) {
      return;
    }

    const userData = this.userForm.value;

    const operation$ = this.isEditMode()
      ? this.userService.updateUser(this.userId()!, userData)
      : this.userService.createUser(userData);

    operation$.subscribe((result) => {
      if (result) {
        this.closeDrawer();
      }
    });
  }

  closeDrawer(): void {
    this.userListComponent.closeDrawer();
  }


}
