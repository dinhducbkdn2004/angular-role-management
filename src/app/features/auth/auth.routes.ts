import { Routes } from '@angular/router';

import { loginGuard } from '../../core';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [loginGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
];
