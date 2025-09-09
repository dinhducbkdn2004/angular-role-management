import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { ROUTE_PATHS } from '../constants';
import { AuthService } from '../services/auth.service';

export const redirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticatedMethod()) {
    if (authService.hasRole('admin')) {
      return router.parseUrl(ROUTE_PATHS.ADMIN.DASHBOARD);
    } else {
      return router.parseUrl(ROUTE_PATHS.USER.DASHBOARD);
    }
  } else {
    return router.parseUrl(ROUTE_PATHS.AUTH.LOGIN);
  }
};
