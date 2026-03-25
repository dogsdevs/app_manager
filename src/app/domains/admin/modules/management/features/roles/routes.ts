import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/list/role-list'),
    children: [
      {
        path: 'new',
        loadComponent: () => import('./features/form/role-form'),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/form/role-form'),
      },
    ],
  },
];

export default routes;