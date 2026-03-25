import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from '../components/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialog = inject(MatDialog);

  errorAlert(message: string): void {
    this.dialog.open(ErrorDialogComponent, {
      data: { message },
      width: '400px',
      disableClose: true,
    });
  }

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data,
      panelClass: 'confirmation-dialog-panel',
      autoFocus: false,
      restoreFocus: true,
    });

    return dialogRef.afterClosed();
  }


  confirmDeleteWithAction(
    title: string,
    description: string,
    action: () => Observable<unknown>
  ): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title,
        description,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
        confirmClass: 'text-white bg-red-600 hover:bg-red-700',
      },
      panelClass: 'confirmation-dialog-panel',
      autoFocus: false,
      restoreFocus: true,
      disableClose: true,
    });

    return new Observable((observer) => {
      let actionExecuted = false;

      // Watch for confirmation
      const checkConfirmed = setInterval(() => {
        if (dialogRef.componentInstance.confirmed() && !actionExecuted) {
          actionExecuted = true;
          clearInterval(checkConfirmed);

          dialogRef.componentInstance.loading.set(true);

          action().subscribe({
            next: () => {
              dialogRef.close();
              observer.next(true);
              observer.complete();
            },
            error: () => {
              dialogRef.componentInstance.loading.set(false);
              dialogRef.componentInstance.confirmed.set(false);
              actionExecuted = false;
              observer.next(false);
              observer.complete();
            },
          });
        }
      }, 100);

      // Handle cancel
      dialogRef.afterClosed().subscribe((result) => {
        clearInterval(checkConfirmed);
        if (!actionExecuted && result === false) {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
