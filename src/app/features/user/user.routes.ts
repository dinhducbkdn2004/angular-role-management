import { Routes } from '@angular/router';

import { authGuard, roleGuard } from '../../core';

export const userRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard, roleGuard({ allowedRoles: ['user'] })],
    loadComponent: () => import('./layout/layout.component').then((m) => m.UserLayoutComponent),
    children: [
      {
        path: 'employees',
        loadComponent: () =>
          import('./employees/user-employees.component').then((m) => m.UserEmployeesComponent),
      },
      {
        path: '',
        redirectTo: 'employees',
        pathMatch: 'full',
      },
    ],
  },
];
