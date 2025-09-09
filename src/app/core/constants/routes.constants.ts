export const ROUTE_PATHS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    EMPLOYEES: '/admin/employees',
  },
  USER: {
    DASHBOARD: '/user/dashboard',
    PROFILE: '/user/profile',
  },
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
  },
} as const;

export type RoutePath =
  (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS][keyof (typeof ROUTE_PATHS)[keyof typeof ROUTE_PATHS]];
