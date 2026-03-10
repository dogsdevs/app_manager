import { Routes } from '@angular/router';
import { AdminLayout } from './layout/layout';

const routes: Routes = [
  {
    path: '',
    component: AdminLayout,
    children: [
      // Redirect empty path to '/auth/sign-in'
      { path: '', pathMatch: 'full', redirectTo: '/auth/sign-in' },

      // -----------------------------------------------------------------------
      // Management
      // -----------------------------------------------------------------------
      {
        path: 'management',
        loadChildren: () => import('./modules/management/routes'),
      },
      // -----------------------------------------------------------------------
      // General
      // -----------------------------------------------------------------------
      {
        path: 'home',
        loadChildren: () => import('./modules/home/routes'),
      },
      // 404
      {
        path: '404',
        pathMatch: 'full',
        loadComponent: () =>
          import('./modules/extras/error/features/error-404'),
      },

      // Catch all
      { path: '**', redirectTo: '404' },
    ],
  },
];

export default routes;
