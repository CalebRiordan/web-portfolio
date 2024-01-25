import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  generateSnackbar(message: string){
    this.snackBar.open(message, 'X', {
      duration: 2500,
      panelClass: 'custom-snackbar',
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
