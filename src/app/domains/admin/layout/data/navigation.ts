import { IsActiveMatchOptions } from '@angular/router';

export type NavigationItem = {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  disabled?: boolean;
  expanded?: boolean;
  activeOptions?: { exact: boolean } | IsActiveMatchOptions;
};

export const NAVIGATION: NavigationItem[] = [
  {
    id: 'general',
    label: 'General',
    children: [
      {
        id: 'general/home',
        label: 'Inicio',
        icon: 'house',
        route: '/admin/home',
      },
    ],
  },
  {
    id: 'management',
    label: 'Gestión',
    children: [
      {
        id: 'management/tenants',
        label: 'Tenants',
        icon: 'building',
        route: '/admin/management/tenants',
      },
      {
        id: 'management/roles',
        label: 'Roles',
        icon: 'clipboard-list',
        route: '/admin/management/roles',
      },
      {
        id: 'management/features',
        label: 'Features',
        icon: 'puzzle',
        route: '/admin/management/features'
      },
    ],
  },
];
