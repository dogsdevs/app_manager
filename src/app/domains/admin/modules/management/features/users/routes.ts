import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/list/user-list'),
     children: [
      {
        path: 'new',
        loadComponent: () => import('./features/form/user-form'),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./features/form/user-form'),
      },
    ],
  },
];

export default routes;