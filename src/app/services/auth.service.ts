import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authToken: string = 'admin_login_authToken_30'
  isLoggedIn: boolean = !!localStorage.getItem('authToken'); 
  private sessionDuration: number = 30 * 60 * 1000;
  private timerSubscription: Subscription;
  

  constructor(private router: Router) {
    this.timerSubscription = Subscription.EMPTY;
    this.checkAuthStatus();    
  }

  login() {
    if (this.isLoggedIn == false){
      this.isLoggedIn = true;
      localStorage.setItem('authToken', this.authToken)
      this.startSessionTimer();
    }
  }

  private startSessionTimer() {
    this.clearSession();
    this.timerSubscription = timer(this.sessionDuration).subscribe(() =>
      this.logOut()
    );
  }

  private clearSession() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = Subscription.EMPTY;
    }
  }

  logOut() {
    this.isLoggedIn = false;
    localStorage.removeItem('authToken');
    this.timerSubscription.unsubscribe();
    this.router.navigate(['admin/login']);
  }

  checkAuthStatus() {
    // Check for existing token and handle session timer if found
    if (this.isLoggedIn) {
      this.startSessionTimer();
    }
  }
}
