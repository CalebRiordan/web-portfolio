import { inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SnackbarService } from './snackbar.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const sbService = inject(SnackbarService);

  if (authService.isLoggedIn){
    return true;
  } else {
    router.navigate(['admin/login']);
    sbService.generateSnackbar("Please log in before accessing the dashboard");

    return false;
  }
};