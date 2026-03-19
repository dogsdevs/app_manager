import { Component, Directive, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'alert-dialog-title',
  standalone: true,
  template: '<h2 class="text-lg font-semibold"><ng-content /></h2>',
})
export class AlertDialogTitle {}

@Component({
  selector: 'alert-dialog-description',
  standalone: true,
  template: '<p class="text-sm text-neutral-600 dark:text-neutral-400"><ng-content /></p>',
})
export class AlertDialogDescription {}

@Component({
  selector: 'alert-dialog-actions',
  standalone: true,
  template: '<div class="mt-6 flex justify-end gap-2"><ng-content /></div>',
})
export class AlertDialogActions {}

@Directive({
  selector: '[alertDialogAction]',
  standalone: true,
  host: {
    '(click)': 'closeDialog()',
  },
})
export class AlertDialogAction {
  private dialogRef = inject(MatDialogRef, { optional: true });

  closeDialog(): void {
    this.dialogRef?.close();
  }
}

@Directive({
  selector: '[alertDialogTriggerFor]',
  standalone: true,
  host: {
    '(click)': 'openDialog()',
  },
})
export class AlertDialogTrigger {
  private dialog = inject(MatDialog);

  @Input('alertDialogTriggerFor') alertDialog!: AlertDialog;

  openDialog(): void {
    if (this.alertDialog) {
      this.dialog.open(this.alertDialog.templateRef, {
        width: '400px',
        panelClass: 'alert-dialog-panel',
      });
    }
  }
}

@Component({
  selector: 'alert-dialog',
  standalone: true,
  imports: [MatDialogModule],
  template: `
    <ng-template>
      <div class="p-6">
        <ng-content />
      </div>
    </ng-template>
  `,
})
export class AlertDialog {
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<unknown>;
}
