import { Routes } from '@angular/router';

import { authGuard, roleGuard } from '../../core';

export const adminRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard({ allowedRoles: ['admin'] })],
    loadComponent: () => import('./layout/layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./employees/employees.component').then((m) => m.EmployeesComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
