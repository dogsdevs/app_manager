/**
 * Application-wide constants and configuration
 */
export const APP_CONSTANTS = {
  /**
   * Application route paths
   */
  routes: {
    auth: {
      signIn: '/auth/sign-in',
    },
    admin: {
      home: '/admin/home',
      management: {
        roles: '/admin/management/roles',
        users: '/admin/management/users',
      },
      apps: {
        fileManager: '/admin/apps/file-manager',
        notes: '/admin/apps/notes',
      },
    },
  },

  /**
   * Theme configuration
   */
  theme: {
    scheme: 'light' as const,
    primary: '#4C4EA8',
    error: '#dc2626',
  },
} as const;
