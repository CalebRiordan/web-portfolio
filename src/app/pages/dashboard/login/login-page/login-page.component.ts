import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth.service.js';
import { NavbarComponent } from '../../../../layouts/navbar/navbar.component.js';
import { SnackbarService } from '../../../../services/snackbar.service.js';

@Component({
    selector: 'app-login-page',
    imports: [CommonModule, NavbarComponent, ReactiveFormsModule],
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.css'],
    standalone: true
})
export class LoginPageComponent implements OnInit {
  formProcessing!: boolean;
  loginForm!: FormGroup;
  loginFailed: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sbService: SnackbarService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn) this.router.navigate(['admin/dashboard']);
    this.setupForm();
  }

  setupForm() {
    this.loginForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required]],
    });
  }

  get fc() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.formProcessing = true;

    if (
      this.fc['name'].value === '' &&
      this.fc['password'].value === ''
    ) {
      this.auth.login();
      this.formProcessing = false;
      this.loginFailed = false;
      this.router.navigate(['admin/dashboard']);
      this.sbService.snackbar("Login successful");
    } else {
      //.reset() clears form controls and marks them as untouched
      this.loginForm.reset();
      this.loginFailed = true;      

      this.fc['name'].valueChanges.subscribe(() => (this.loginFailed = false));
      this.fc['password'].valueChanges.subscribe(
        () => (this.loginFailed = false)
      );
    }
  }
}
