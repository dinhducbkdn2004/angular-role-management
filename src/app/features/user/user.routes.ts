import { Routes } from '@angular/router';

import { authGuard } from '../../core';

export const userRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
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
