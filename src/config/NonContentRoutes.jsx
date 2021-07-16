import config from '@plone/volto/registry';

// Non Content Routes/Views
// You can include either RegEx or a string representing the ending of the
// nonContentRoute eg. '/add' will match '/foo/bar/add'
export const nonContentRoutes = [
  /\?.*$/,
  '/add',
  '/contents',
  '/delete',
  '/diff',
  '/edit',
  '/history',
  '/layout',
  '/login',
  '/logout',
  '/sitemap',
  '/register',
  '/sharing',
  '/search',
  '/change-password',
  /\/controlpanel\/.*$/,
  '/controlpanel',
  '/contact-form',
  '/personal-information',
  '/personal-preferences',
  '/register',
  /\/password-reset\/.*$/,
  '/password-reset',
  '/create-translation',
  '/manage-translations',
  '/edit-slot',
  /\/edit-slot\/.*$/,
  ...(config.settings?.externalRoutes?.map((route) => route.match.path) || []),
];
