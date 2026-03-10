import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'roles',
    pathMatch: 'full',
    loadChildren: () => import('./features/roles/routes'),
  },
  {
    path: 'users',
    pathMatch: 'full',
    loadChildren: () => import('./features/users/routes'),
  },
];

export default routes;
