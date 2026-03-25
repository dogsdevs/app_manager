import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'roles',
    loadChildren: () => import('./features/roles/routes'),
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/routes'),
  },
  {
    path: 'tenants',
    loadChildren: () => import('./features/tenants/routes'),
  },
];

export default routes;
