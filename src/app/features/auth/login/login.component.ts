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

  // Component state using signals
  formState = signal<LoginFormState>({
    data: { username: '', password: '', rememberMe: false },
    errors: {},
    isLoading: false,
    isSubmitted: false
  });

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.updateFormState({ isLoading: true, isSubmitted: true, errors: {} });
    
    // Disable form while loading
    this.loginForm.disable();

    const formData: LoginFormData = this.loginForm.value;

    this.authService.login({
      username: formData.username,
      password: formData.password
    }).subscribe({
      next: (response) => {
        this.updateFormState({ isLoading: false });
        this.loginForm.enable();
        
        // Redirect based on user role
        if (response.user.role === 'admin') {
          this.router.navigateByUrl(ROUTE_PATHS.ADMIN.DASHBOARD);
        } else {
          this.router.navigateByUrl(ROUTE_PATHS.USER.DASHBOARD);
        }
      },
      error: (error) => {
        this.updateFormState({
          isLoading: false,
          errors: { general: error.message || 'Login failed. Please try again.' }
        });
        this.loginForm.enable();
      }
    });
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

  private updateFormState(updates: Partial<LoginFormState>): void {
    this.formState.update(current => ({ ...current, ...updates }));
  }

  // Utility methods for template
  get isLoading(): boolean {
    return this.formState().isLoading;
  }

  get generalError(): string | undefined {
    return this.formState().errors.general;
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
