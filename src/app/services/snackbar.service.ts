import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export enum SnackbarType {
  SUCCESS = 'success',
  ERROR = 'error',
}

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  static readonly SnackbarType = SnackbarType;

  constructor(private snackBar: MatSnackBar) {}

  snackbar(message: string, duration = 2500, type: SnackbarType = SnackbarType.SUCCESS) {
    this.snackBar.open(message, 'X', {
      duration: duration,
      panelClass: [
        'snackbar',
        type === SnackbarType.SUCCESS ? 'sb-success' : 'sb-error',
      ],
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });
  }
}
