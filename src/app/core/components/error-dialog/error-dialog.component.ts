import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="flex flex-col items-center px-6 pb-1 pt-6 text-center sm:min-w-[400px]">
      <!-- Icono centralizado destacado -->
      <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-50">
        <mat-icon class="flex items-center justify-center text-red-500" style="font-size: 32px; width: 32px; height: 32px;" svgIcon="triangle-alert"></mat-icon>
      </div>

      <!-- Título principal -->
      <h2 mat-dialog-title class="m-0 mb-0 text-2xl font-extrabold tracking-tight text-slate-800">
        Acción fallida
      </h2>
      
      <!-- Mensaje dinámico -->
      <mat-dialog-content class="m-0 pb-2 max-w-sm p-0">
        <p class="text-lg leading-relaxed text-slate-500">
          {{ data.message }}
        </p>
      </mat-dialog-content>
    </div>

    <!-- Acciones -->
    <mat-dialog-actions class="flex justify-center pb-4 pt-6">
      <button 
        matButton="filled"
        color="warn" 
        class="w-full max-w-[160px]" 
        mat-dialog-close 
        cdkFocusInitial
      >
        Entendido
      </button>
    </mat-dialog-actions>
  `
})
export class ErrorDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ErrorDialogComponent>);
}
