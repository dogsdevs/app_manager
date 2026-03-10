import { Route } from '@angular/router';

export const routes: Route[] = [
  // Website routes
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./domains/website/routes'),
  },

  // Auth
  {
    path: 'auth',
    loadChildren: () => import('./domains/auth/routes'),
  },

  // Admin
  {
    path: 'admin',
    loadChildren: () => import('./domains/admin/routes'),
  },

];
