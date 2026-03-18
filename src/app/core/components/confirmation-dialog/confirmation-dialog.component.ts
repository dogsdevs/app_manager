import { Component, inject, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

export type ConfirmationDialogData = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  confirmClass?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButton, MatIcon],
  template: `
    <div class="p-6">
      <h2 class="text-lg font-semibold text-neutral-900 dark:text-white">
        {{ data.title }}
      </h2>
      
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        {{ data.description }}
      </p>

      <div class="mt-6 flex justify-end gap-2">
        <button 
          matButton="outlined"
          [disabled]="loading()"
          (click)="onCancel()">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button 
          matButton="filled"
          [disabled]="loading()"
          (click)="onConfirm()"
          [class]="data.confirmClass || ''">
          @if (loading()) {
            <mat-icon class="animate-spin" svgIcon="loader-circle" />
          }@else{
            <mat-icon svgIcon="trash-2" />
          }
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  data = inject<ConfirmationDialogData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  loading = signal(false);
  confirmed = signal(false);

  onCancel(): void {
    if (!this.loading()) {
      this.dialogRef.close(false);
    }
  }

  onConfirm(): void {
    if (!this.loading()) {
      this.confirmed.set(true);
    }
  }
}
