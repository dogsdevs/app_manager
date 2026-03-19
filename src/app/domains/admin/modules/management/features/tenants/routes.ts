import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/list/tenant-list'),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./features/form/tenant-form'),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/form/tenant-form'),
      },
    ],
  },
];

export default routes;
