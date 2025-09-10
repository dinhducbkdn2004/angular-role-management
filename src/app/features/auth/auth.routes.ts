import { Routes } from '@angular/router';

import { loginPageGuard } from '../../core';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [loginPageGuard],
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
