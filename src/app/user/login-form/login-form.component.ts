import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

type UserFields = 'email' | 'password';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'r2m-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  faGoogle = faGoogle;

  loginForm: FormGroup;
  formErrors: FormErrors = {
    email: '',
    password: '',
  };
  validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email',
    },
    password: {
      required: 'Password is required.',
    },
  };

  constructor(
    private fb: FormBuilder,
    private db: RxfirestoreAuthService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.redirectIfLoggedIn();
    this.buildForm();
  }

  private async redirectIfLoggedIn() {
    const user = await this.db.getUser();
    if (user) {
      return this.router.navigate(['/user']);
    }
  }

  async googleLogin() {
    const uid = await this.db.googleLogin();
  }

  async login() {
    const uid = await this.db.emailLogin(this.loginForm.value['email'], this.loginForm.value['password']);
  }

  resetPassword() {
    const email = this.loginForm.value['email'];
    this.db.sendPasswordResetEmail(email);
  }

  buildForm() {
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
      ]],
    });

    this.loginForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  // TODO: Add flag to keep validation messages from coming before hitting submit, except using help hints
  onValueChanged(data?: any) {
    if (!this.loginForm) { return; }
    const form = this.loginForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty.call(this.formErrors, field) && (field === 'email' || field === 'password')) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          if (control.errors) {
            for (const key in control.errors) {
              if (Object.prototype.hasOwnProperty.call(control.errors, key)) {
                this.formErrors[field] += `${(messages as { [key: string]: string })[key]} `;
              }
            }
          }
        }
      }
    }
  }
}
