import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { RxfirestoreAuthService } from '@r2m-common/services/rxfirestore-auth.service';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

type UserFields = 'name' | 'email' | 'password' | 'confirmPassword';
type FormErrors = { [u in UserFields]: string };

@Component({
  selector: 'r2m-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  faCheck = faCheck;
  faGoogle = faGoogle;

  signupForm: FormGroup;
  formErrors: FormErrors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };
  validationMessages = {
    name: {
      required: 'Name is required.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email must be a valid email',
    },
    password: {
      required: 'Password is required.',
      minlength: 'Must be at least 8 characters',
      maxlength: 'Password cannot be more than 20 characters long.',
      pattern: 'Must include at least 1 letter and 1 number',
    },
    confirmPassword: {
      required: 'Password confirmation required.',
    }
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

  async signup() {
    const uid = await this.db
      .emailSignUp(this.signupForm.value['email'], this.signupForm.value['password'], this.signupForm.value['name']);
  }

  buildForm() {
    this.signupForm = this.fb.group({
      name: ['', [
        Validators.required,
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(20),
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9!@#$%]+)$'),
      ]],
      confirmPassword: ['', [
        Validators.required,
      ]],
    });

    this.signupForm.valueChanges.subscribe((data) => this.onValueChanged(data));
    this.onValueChanged(); // reset validation messages
  }

  // Updates validation state on form changes.
  // TODO: Add flag to keep validation messages from coming before hitting submit, except using help hints
  onValueChanged(data?: any) {
    if (!this.signupForm) { return; }
    const form = this.signupForm;
    for (const field in this.formErrors) {
      if (Object.prototype.hasOwnProperty
        .call(this.formErrors, field) && (field === 'name' || field === 'email' || field === 'password' || field === 'confirmPassword')) {
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
