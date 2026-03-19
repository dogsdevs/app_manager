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

// import {
//   ActivatedRouteSnapshot,
//   RouterStateSnapshot,
//   Routes,
// } from '@angular/router';
// import RoleForm from './features/form/role-form';

// /**
//  * Can deactivate tasks details
//  * @param component
//  * @param currentRoute
//  * @param currentState
//  * @param nextState
//  */
// const canDeactivateRolesForm = (
//   component: RoleForm,
//   currentRoute: ActivatedRouteSnapshot,
//   currentState: RouterStateSnapshot,
//   nextState: RouterStateSnapshot
// ) => {
//   // Get the next route
//   let nextRoute: ActivatedRouteSnapshot = nextState.root;
//   while (nextRoute.firstChild) {
//     nextRoute = nextRoute.firstChild;
//   }

//   // If the next state doesn't contain '/tasks'
//   // it means we are navigating away from the
//   // tasks app
//   if (!nextState.url.includes('/roles')) {
//     // Let it navigate
//     return true;
//   }

//   // If we are navigating to another task...
//   if (nextRoute.paramMap.get('id')) {
//     // Just navigate
//     return true;
//   }

//   // Otherwise, close the drawer first, and then navigate
//   return component.closeDrawer().then(() => true);
// };

// export default [
//   {
//     path: '',
//     loadComponent: () => import('./features/list/role-list'),
//     children: [
//       {
//         path: 'new',
//         loadComponent: () => import('./features/form/role-form'),
//         canDeactivate: [canDeactivateRolesForm],
//       },
//       {
//         path: 'edit/:id',
//         loadComponent: () => import('./features/form/role-form'),
//         canDeactivate: [canDeactivateRolesForm],
//       },
//     ],
//   },
// ] as Routes;
