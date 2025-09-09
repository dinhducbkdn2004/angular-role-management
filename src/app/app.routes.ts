import { Routes } from '@angular/router';

import { redirectGuard } from './core';

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
    loadChildren: () => import('./features').then((m) => m.authRoutes),
  },

  // Admin routes (protected)
  {
    path: 'admin',
    loadChildren: () => import('./features').then((m) => m.adminRoutes),
  },

  // User routes (protected)
  {
    path: 'user',
    loadChildren: () => import('./features').then((m) => m.userRoutes),
  },

  // Wildcard route
  {
    path: '**',
    redirectTo: '/auth/login',
  },
];
