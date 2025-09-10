import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTE_PATHS } from '../constants';
import { AuthService } from '../services/auth.service';

export interface RoleGuardConfig {
  allowedRoles: Array<'admin' | 'user'>;
  redirectPath?: string;
  fallbackByRole?: boolean;
}

export const roleGuard = (config: RoleGuardConfig): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const currentUser = authService.currentUser();

    if (!currentUser) {
      return router.parseUrl(ROUTE_PATHS.AUTH.LOGIN);
    }

    if (config.allowedRoles.includes(currentUser.role)) {
      return true;
    } else {
      if (config.redirectPath) {
        return router.parseUrl(config.redirectPath);
      }

      if (config.fallbackByRole !== false) {
        if (currentUser.role === 'user') {
          return router.parseUrl(ROUTE_PATHS.USER.EMPLOYEES);
        } else {
          return router.parseUrl(ROUTE_PATHS.ADMIN.DASHBOARD);
        }
      }

      return router.parseUrl(ROUTE_PATHS.AUTH.LOGIN);
    }
  };
};