import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AuthService, ROUTE_PATHS } from '../../../core';
import { LoginFormData, LoginFormState } from '../models';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Form setup
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  isLoading = this.authService.isLoading;
  error = this.authService.error;

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loginForm.disable();

    try {
      const formData: LoginFormData = this.loginForm.value;
      
      const user = await this.authService.login({
        username: formData.username,
        password: formData.password
      });

      if (user.role === 'admin') {
        this.router.navigateByUrl(ROUTE_PATHS.ADMIN.DASHBOARD);
      } else {
        this.router.navigateByUrl(ROUTE_PATHS.USER.EMPLOYEES);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      this.loginForm.enable();
    }
  }

  fillDemoAccount(account: { username: string; password: string }): void {
    this.loginForm.patchValue({
      username: account.username,
      password: account.password
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Utility methods for template
  get generalError(): string | null {
    return this.error();
  }

  getFieldError(fieldName: string): string | null {
    const control = this.loginForm.get(fieldName);
    if (control?.invalid && control?.touched) {
      if (control.errors?.['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (control.errors?.['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return null;
  }
}
