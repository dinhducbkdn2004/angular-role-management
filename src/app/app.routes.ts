import { Routes } from '@angular/router';

import { authGuard, loginGuard, redirectGuard, roleGuard } from './core';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    canActivate: [redirectGuard],
    children: [],
  },

  // Auth routes (public)
  {
    path: 'auth',
    canActivate: [loginGuard],
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },

  // Admin routes (protected)
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard({ allowedRoles: ['admin'] })],
    loadComponent: () =>
      import('./features/admin/layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/admin/employees/employees.component').then(
            (m) => m.EmployeesComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // User routes (protected)
  {
    path: 'user',
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/user/dashboard/user-dashboard.component').then(
            (m) => m.UserDashboardComponent
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
