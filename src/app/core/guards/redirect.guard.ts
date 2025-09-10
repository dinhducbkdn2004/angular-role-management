import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTE_PATHS } from '../constants';
import { AuthService } from '../services/auth.service';

export const redirectGuard = (allowLoginAccess: boolean = false): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticatedMethod()) {
      if (authService.hasRole('admin')) {
        return router.parseUrl(ROUTE_PATHS.ADMIN.DASHBOARD);
      } else {
        return router.parseUrl(ROUTE_PATHS.USER.EMPLOYEES);
      }
    } else {
      if (allowLoginAccess) {
        return true; 
      } else {
        return router.parseUrl(ROUTE_PATHS.AUTH.LOGIN); 
      }
    }
  };
};

export const autoRedirectGuard = redirectGuard(false); 
export const loginPageGuard = redirectGuard(true);
