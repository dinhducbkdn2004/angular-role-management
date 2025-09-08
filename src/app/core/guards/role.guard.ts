import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: Array<'admin' | 'user'>): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.currentUser();

    if (!currentUser) {
      return router.parseUrl('/auth/login');
    }

    if (allowedRoles.includes(currentUser.role)) {
      return true;
    } else {
      // Redirect based on role with proper routing structure
      if (currentUser.role === 'user') {
        return router.parseUrl('/user/dashboard');
      } else {
        return router.parseUrl('/admin/dashboard');
      }
    }
  };
};
