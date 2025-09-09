import { Routes } from '@angular/router';

// import { authGuard, roleGuard } from './core';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    redirectTo: '/auth/login',
    pathMatch: 'full',
  },

  // Auth routes (public)
  {
    path: 'auth',
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

  // TODO: Uncomment when components are created
  // Admin routes (protected)
  // {
  //   path: 'admin',
  //   canActivate: [authGuard, roleGuard({ allowedRoles: ['admin'] })],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
  //     },
  //     {
  //       path: 'employees',
  //       loadComponent: () => import('./features/admin/employees/employees.component').then(m => m.EmployeesComponent)
  //     },
  //     {
  //       path: '',
  //       redirectTo: 'dashboard',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },

  // User routes (protected)
  // {
  //   path: 'user',
  //   canActivate: [authGuard, roleGuard({ allowedRoles: ['user'] })],
  //   children: [
  //     {
  //       path: 'dashboard',
  //       loadComponent: () => import('./features/user/dashboard/dashboard.component').then(m => m.DashboardComponent)
  //     },
  //     {
  //       path: 'profile',
  //       loadComponent: () => import('./features/user/profile/profile.component').then(m => m.ProfileComponent)
  //     },
  //     {
  //       path: '',
  //       redirectTo: 'dashboard',
  //       pathMatch: 'full'
  //     }
  //   ]
  // },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
