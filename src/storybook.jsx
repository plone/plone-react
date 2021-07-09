import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { PluggablesProvider } from '@plone/volto/components/manage/Pluggable';
import configureStore from '@plone/volto/store';

const initialState = () => ({
  router: {
    location: {
      pathname: '/',
      search: '',
      hash: '',
      key: 'tacrkf',
      query: {},
    },
    action: 'POP',
  },
  intl: {
    defaultLocale: 'en',
    locale: 'en',
    messages: {},
  },
  reduxAsyncConnect: {
    loaded: true,
    loadState: {
      breadcrumbs: {
        loading: false,
        loaded: true,
        error: null,
      },
      content: {
        loading: false,
        loaded: true,
        error: null,
      },
      navigation: {
        loading: false,
        loaded: true,
        error: null,
      },
      workflow: {
        loading: false,
        loaded: true,
        error: null,
      },
    },
    breadcrumbs: {
      '@id': 'http://localhost:3000/api/@breadcrumbs',
      items: [],
    },
    content: {
      '@components': {
        actions: {
          '@id': 'http://localhost:3000/api/@actions',
        },
        breadcrumbs: {
          '@id': 'http://localhost:3000/api/@breadcrumbs',
        },
        navigation: {
          '@id': 'http://localhost:3000/api/@navigation',
        },
      },
      '@id': 'http://localhost:3000/api/',
      '@type': 'Plone Site',
      blocks: {
        '0358abe2-b4f1-463d-a279-a63ea80daf19': {
          '@type': 'description',
        },
        '07c273fc-8bfc-4e7d-a327-d513e5a945bb': {
          '@type': 'title',
        },
        '2dfe8e4c-5bf6-43f1-93e1-6c320ede7226': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 10,
                    offset: 0,
                    style: 'BOLD',
                  },
                ],
                key: '6470b',
                text:
                  'Disclaimer: This instance is reset every night, so all changes will be lost afterwards.',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        '3c881f51-f75b-4959-834a-6e1d5edc32ae': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 5,
                    offset: 6,
                    style: 'BOLD',
                  },
                ],
                key: 'ekn3l',
                text: 'user: admin',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        '5e1c30b1-ec6c-4dc0-9483-9768c3c416e4': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 5,
                    offset: 0,
                  },
                  {
                    key: 1,
                    length: 8,
                    offset: 455,
                  },
                ],
                inlineStyleRanges: [],
                key: 'behki',
                text:
                  'Plone is a CMS built on Python with over 19 years of experience. Plone has very interesting features that appeal to developers and users alike, such as customizable content types, hierarchical URL object traversing and a sophisticated content workflow powered by a granular permissions model. This allows you to build anything from simple websites to enterprise-grade intranets. Volto exposes all these features and communicates with Plone via its mature REST API. Volto can be esily themed and is highly customizable.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://plone.org',
                  rel: 'nofollow',
                  url: 'https://plone.org/',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
              '1': {
                data: {
                  href: 'https://github.com/plone/plone.restapi',
                  url: 'https://github.com/plone/plone.restapi',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
        '61cc1bc0-d4f5-4e2b-9152-79512045a4dd': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: '9qsa4',
                text: 'Demo',
                type: 'header-two',
              },
            ],
            entityMap: {},
          },
        },
        '874049e7-629e-489a-b46c-1adf35ad40ee': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: '9pnjr',
                text: 'Happy hacking!',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        '942b6530-2407-420f-9c24-597adda6b2ce': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 36,
                    offset: 39,
                  },
                ],
                inlineStyleRanges: [],
                key: '6a248',
                text:
                  'Last but not least, it also supports a Volto Nodejs-based backend reference API implementation that demos how other systems could also use Volto to display and create content through it.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://github.com/plone/volto-reference-backend',
                  url: 'https://github.com/plone/volto-reference-backend',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
        '9a976b8e-72ba-468a-bea8-b37a31bb386b': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 12,
                    offset: 51,
                    style: 'BOLD',
                  },
                ],
                key: '94arl',
                text:
                  'You can log in and use it as admin user using these credentials:',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'b3717238-448f-406e-b06f-57a9715c3326': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 5,
                    offset: 0,
                  },
                ],
                inlineStyleRanges: [],
                key: '1bnna',
                text:
                  'Volto is a React-based frontend for content management systems, currently supporting three backend implementations: Plone, Guillotina and a NodeJS reference implementation.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://github.com/plone/volto',
                  url: 'https://github.com/plone/volto',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
        'c049ff8b-3e5a-4cfb-bca6-e4a6cca9be28': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: '55n44',
                text:
                  'You can use this site to test Volto. It runs on the master branch of Volto using latest Plone 5.2 Backend running on Python 3.',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'c91f0fe9-f2e9-4a17-84a5-8e4f2678ed3c': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 5,
                    offset: 10,
                    style: 'BOLD',
                  },
                ],
                key: 'buncq',
                text: 'password: admin',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'e0ca2fbc-7800-4b9b-afe5-8e42af9f5dd6': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: 'f0prj',
                text: '2020 - Volto Team - Plone Foundation',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'effbdcdc-253c-41a7-841e-5edb3b56ce32': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 10,
                    offset: 36,
                  },
                ],
                inlineStyleRanges: [],
                key: '68rve',
                text:
                  'Volto also supports other APIs like Guillotina, a Python resource management system, inspired by Plone and using the same basic concepts like traversal, content types and permissions model.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://guillotina.io/',
                  rel: 'nofollow',
                  url: 'https://guillotina.io/',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
      },
      blocks_layout: {
        items: [
          '07c273fc-8bfc-4e7d-a327-d513e5a945bb',
          '0358abe2-b4f1-463d-a279-a63ea80daf19',
          'b3717238-448f-406e-b06f-57a9715c3326',
          '5e1c30b1-ec6c-4dc0-9483-9768c3c416e4',
          'effbdcdc-253c-41a7-841e-5edb3b56ce32',
          '942b6530-2407-420f-9c24-597adda6b2ce',
          '61cc1bc0-d4f5-4e2b-9152-79512045a4dd',
          'c049ff8b-3e5a-4cfb-bca6-e4a6cca9be28',
          '9a976b8e-72ba-468a-bea8-b37a31bb386b',
          '3c881f51-f75b-4959-834a-6e1d5edc32ae',
          'c91f0fe9-f2e9-4a17-84a5-8e4f2678ed3c',
          '2dfe8e4c-5bf6-43f1-93e1-6c320ede7226',
          '874049e7-629e-489a-b46c-1adf35ad40ee',
          'e0ca2fbc-7800-4b9b-afe5-8e42af9f5dd6',
        ],
      },
      description: 'The React powered content management system',
      id: 'Plone',
      is_folderish: true,
      items: [
        {
          '@id': 'http://localhost:3000/api/front-page',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'published',
          title: 'Welcome to Plone',
        },
        {
          '@id': 'http://localhost:3000/api/news',
          '@type': 'Folder',
          description: 'Site News',
          review_state: 'published',
          title: 'News',
        },
        {
          '@id': 'http://localhost:3000/api/events',
          '@type': 'Folder',
          description: 'Site Events',
          review_state: 'published',
          title: 'Events',
        },
        {
          '@id': 'http://localhost:3000/api/Members',
          '@type': 'Folder',
          description: 'Site Users',
          review_state: 'private',
          title: 'Users',
        },
      ],
      items_total: 4,
      parent: {},
      title: 'Welcome to Volto!',
    },
    navigation: {
      '@id': 'http://localhost:3000/api/@navigation',
      items: [
        {
          '@id': 'http://localhost:3000/api',
          description: '',
          title: 'Home',
        },
        {
          '@id': 'http://localhost:3000/api/news',
          description: 'Site News',
          title: 'News',
        },
        {
          '@id': 'http://localhost:3000/api/events',
          description: 'Site Events',
          title: 'Events',
        },
        {
          '@id': 'http://localhost:3000/api/Members',
          description: 'Site Users',
          title: 'Users',
        },
      ],
    },
    workflow: {
      '@id': 'http://localhost:3000/api/@workflow',
      history: [],
      transitions: [],
    },
  },
  actions: {
    error: null,
    actions: {
      document_actions: [],
      object: [
        {
          icon: '',
          id: 'view',
          title: 'View',
        },
        {
          icon: '',
          id: 'edit',
          title: 'Edit',
        },
        {
          icon: '',
          id: 'folderContents',
          title: 'Contents',
        },
        {
          icon: '',
          id: 'history',
          title: 'History',
        },
        {
          icon: '',
          id: 'local_roles',
          title: 'Sharing',
        },
      ],
      object_buttons: [],
      portal_tabs: [
        {
          icon: '',
          id: 'index_html',
          title: 'Home',
        },
      ],
      site_actions: [
        {
          icon: '',
          id: 'sitemap',
          title: 'Site Map',
        },
        {
          icon: '',
          id: 'accessibility',
          title: 'Accessibility',
        },
        {
          icon: '',
          id: 'contact',
          title: 'Contact',
        },
      ],
      user: [
        {
          icon: '',
          id: 'preferences',
          title: 'Preferences',
        },
        {
          icon: '',
          id: 'dashboard',
          title: 'Dashboard',
        },
        {
          icon: '',
          id: 'plone_setup',
          title: 'Site Setup',
        },
        {
          icon: '',
          id: 'logout',
          title: 'Log out',
        },
      ],
    },
    loaded: true,
    loading: false,
  },
  addons: {
    error: null,
    installedAddons: [],
    availableAddons: [],
    upgradableAddons: [],
    loaded: false,
    loading: false,
  },
  apierror: {
    error: null,
    statusCode: null,
    connectionRefused: false,
    message: null,
  },
  breadcrumbs: {
    error: null,
    items: [
      {
        title: 'Hello',
        url: '/hello',
      },
      {
        title: 'world',
        url: '/hello/world',
      },
    ],
    loaded: true,
    loading: false,
  },
  browserdetect: {
    name: 'chrome',
    version: '85.0.4183',
    os: 'Windows 10',
    type: 'browser',
  },
  comments: {
    add: {
      loaded: false,
      loading: false,
      error: null,
    },
    delete: {
      loaded: false,
      loading: false,
      error: null,
    },
    update: {
      loaded: false,
      loading: false,
      error: null,
    },
    list: {
      loaded: false,
      loading: false,
      error: null,
    },
    items: [],
  },
  content: {
    create: {
      loaded: false,
      loading: false,
      error: null,
    },
    delete: {
      loaded: false,
      loading: false,
      error: null,
    },
    update: {
      loaded: false,
      loading: false,
      error: null,
    },
    get: {
      loading: false,
      loaded: true,
      error: null,
    },
    order: {
      loaded: false,
      loading: false,
      error: null,
    },
    data: {
      '@components': {
        actions: {
          '@id': 'http://localhost:3000/api/@actions',
        },
        breadcrumbs: {
          '@id': 'http://localhost:3000/api/@breadcrumbs',
        },
        navigation: {
          '@id': 'http://localhost:3000/api/@navigation',
        },
      },
      '@id': 'http://localhost:3000/api/',
      '@type': 'Plone Site',
      blocks: {
        '0358abe2-b4f1-463d-a279-a63ea80daf19': {
          '@type': 'description',
        },
        '07c273fc-8bfc-4e7d-a327-d513e5a945bb': {
          '@type': 'title',
        },
        '2dfe8e4c-5bf6-43f1-93e1-6c320ede7226': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 10,
                    offset: 0,
                    style: 'BOLD',
                  },
                ],
                key: '6470b',
                text:
                  'Disclaimer: This instance is reset every night, so all changes will be lost afterwards.',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        '3c881f51-f75b-4959-834a-6e1d5edc32ae': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 5,
                    offset: 6,
                    style: 'BOLD',
                  },
                ],
                key: 'ekn3l',
                text: 'user: admin',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        '5e1c30b1-ec6c-4dc0-9483-9768c3c416e4': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 5,
                    offset: 0,
                  },
                  {
                    key: 1,
                    length: 8,
                    offset: 455,
                  },
                ],
                inlineStyleRanges: [],
                key: 'behki',
                text:
                  'Plone is a CMS built on Python with over 19 years of experience. Plone has very interesting features that appeal to developers and users alike, such as customizable content types, hierarchical URL object traversing and a sophisticated content workflow powered by a granular permissions model. This allows you to build anything from simple websites to enterprise-grade intranets. Volto exposes all these features and communicates with Plone via its mature REST API. Volto can be esily themed and is highly customizable.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://plone.org',
                  rel: 'nofollow',
                  url: 'https://plone.org/',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
              '1': {
                data: {
                  href: 'https://github.com/plone/plone.restapi',
                  url: 'https://github.com/plone/plone.restapi',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
        '61cc1bc0-d4f5-4e2b-9152-79512045a4dd': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: '9qsa4',
                text: 'Demo',
                type: 'header-two',
              },
            ],
            entityMap: {},
          },
        },
        '874049e7-629e-489a-b46c-1adf35ad40ee': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: '9pnjr',
                text: 'Happy hacking!',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        '942b6530-2407-420f-9c24-597adda6b2ce': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 36,
                    offset: 39,
                  },
                ],
                inlineStyleRanges: [],
                key: '6a248',
                text:
                  'Last but not least, it also supports a Volto Nodejs-based backend reference API implementation that demos how other systems could also use Volto to display and create content through it.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://github.com/plone/volto-reference-backend',
                  url: 'https://github.com/plone/volto-reference-backend',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
        '9a976b8e-72ba-468a-bea8-b37a31bb386b': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 12,
                    offset: 51,
                    style: 'BOLD',
                  },
                ],
                key: '94arl',
                text:
                  'You can log in and use it as admin user using these credentials:',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'b3717238-448f-406e-b06f-57a9715c3326': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 5,
                    offset: 0,
                  },
                ],
                inlineStyleRanges: [],
                key: '1bnna',
                text:
                  'Volto is a React-based frontend for content management systems, currently supporting three backend implementations: Plone, Guillotina and a NodeJS reference implementation.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://github.com/plone/volto',
                  url: 'https://github.com/plone/volto',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
        'c049ff8b-3e5a-4cfb-bca6-e4a6cca9be28': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: '55n44',
                text:
                  'You can use this site to test Volto. It runs on the master branch of Volto using latest Plone 5.2 Backend running on Python 3.',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'c91f0fe9-f2e9-4a17-84a5-8e4f2678ed3c': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [
                  {
                    length: 5,
                    offset: 10,
                    style: 'BOLD',
                  },
                ],
                key: 'buncq',
                text: 'password: admin',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'e0ca2fbc-7800-4b9b-afe5-8e42af9f5dd6': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [],
                inlineStyleRanges: [],
                key: 'f0prj',
                text: '2020 - Volto Team - Plone Foundation',
                type: 'unstyled',
              },
            ],
            entityMap: {},
          },
        },
        'effbdcdc-253c-41a7-841e-5edb3b56ce32': {
          '@type': 'text',
          text: {
            blocks: [
              {
                data: {},
                depth: 0,
                entityRanges: [
                  {
                    key: 0,
                    length: 10,
                    offset: 36,
                  },
                ],
                inlineStyleRanges: [],
                key: '68rve',
                text:
                  'Volto also supports other APIs like Guillotina, a Python resource management system, inspired by Plone and using the same basic concepts like traversal, content types and permissions model.',
                type: 'unstyled',
              },
            ],
            entityMap: {
              '0': {
                data: {
                  href: 'https://guillotina.io/',
                  rel: 'nofollow',
                  url: 'https://guillotina.io/',
                },
                mutability: 'MUTABLE',
                type: 'LINK',
              },
            },
          },
        },
      },
      blocks_layout: {
        items: [
          '07c273fc-8bfc-4e7d-a327-d513e5a945bb',
          '0358abe2-b4f1-463d-a279-a63ea80daf19',
          'b3717238-448f-406e-b06f-57a9715c3326',
          '5e1c30b1-ec6c-4dc0-9483-9768c3c416e4',
          'effbdcdc-253c-41a7-841e-5edb3b56ce32',
          '942b6530-2407-420f-9c24-597adda6b2ce',
          '61cc1bc0-d4f5-4e2b-9152-79512045a4dd',
          'c049ff8b-3e5a-4cfb-bca6-e4a6cca9be28',
          '9a976b8e-72ba-468a-bea8-b37a31bb386b',
          '3c881f51-f75b-4959-834a-6e1d5edc32ae',
          'c91f0fe9-f2e9-4a17-84a5-8e4f2678ed3c',
          '2dfe8e4c-5bf6-43f1-93e1-6c320ede7226',
          '874049e7-629e-489a-b46c-1adf35ad40ee',
          'e0ca2fbc-7800-4b9b-afe5-8e42af9f5dd6',
        ],
      },
      description: 'The React powered content management system',
      id: 'Plone',
      is_folderish: true,
      items: [
        {
          '@id': 'http://localhost:3000/api/front-page',
          '@type': 'Document',
          description:
            'Congratulations! You have successfully installed Plone.',
          review_state: 'published',
          title: 'Welcome to Plone',
          url: '/front-page',
        },
        {
          '@id': 'http://localhost:3000/api/news',
          '@type': 'Folder',
          description: 'Site News',
          review_state: 'published',
          title: 'News',
          url: '/news',
        },
        {
          '@id': 'http://localhost:3000/api/events',
          '@type': 'Folder',
          description: 'Site Events',
          review_state: 'published',
          title: 'Events',
          url: '/events',
        },
        {
          '@id': 'http://localhost:3000/api/Members',
          '@type': 'Folder',
          description: 'Site Users',
          review_state: 'private',
          title: 'Users',
          url: '/Members',
        },
      ],
      items_total: 4,
      parent: {},
      title: 'Welcome to Volto!',
    },
    subrequests: {},
  },
  controlpanels: {
    get: {
      loaded: false,
      loading: false,
      error: null,
    },
    list: {
      loaded: false,
      loading: false,
      error: null,
    },
    update: {
      loaded: false,
      loading: false,
      error: null,
    },
    post: {
      loaded: false,
      loading: false,
      error: null,
    },
    delete: {
      loaded: false,
      loading: false,
      error: null,
    },
    controlpanel: null,
    controlpanels: [],
    systeminformation: null,
    databaseinformation: null,
  },
  clipboard: {
    action: null,
    source: null,
    request: {
      loaded: false,
      loading: false,
      error: null,
    },
  },
  diff: {
    error: null,
    data: [],
    loaded: false,
    loading: false,
  },
  emailNotification: {
    error: null,
    loaded: false,
    loading: false,
  },
  form: {},
  groups: {
    create: {
      loaded: false,
      loading: false,
      error: null,
    },
    delete: {
      loaded: false,
      loading: false,
      error: null,
    },
    get: {
      loaded: false,
      loading: false,
      error: null,
    },
    list: {
      loaded: false,
      loading: false,
      error: null,
    },
    update: {
      loaded: false,
      loading: false,
      error: null,
    },
    groups: [],
    group: {},
  },
  history: {
    entries: [],
    get: {
      error: null,
      loaded: false,
      loading: false,
    },
    revert: {
      error: null,
      loaded: false,
      loading: false,
    },
  },
  messages: {
    messages: [],
  },
  navigation: {
    error: null,
    items: [
      {
        title: 'Home',
        url: '',
      },
      {
        title: 'News',
        url: '/news',
      },
      {
        title: 'Events',
        url: '/events',
      },
      {
        title: 'Users',
        url: '/Members',
      },
    ],
    loaded: true,
    loading: false,
  },
  querystring: {
    error: null,
    indexes: {},
    sortable_indexes: {},
    loaded: false,
    loading: false,
  },
  querystringsearch: {
    error: null,
    items: [],
    total: 0,
    loaded: false,
    loading: false,
    batching: {},
    subrequests: {},
  },
  roles: {
    error: null,
    roles: [],
    loaded: false,
    loading: false,
  },
  schema: {
    error: null,
    loaded: false,
    loading: false,
    schema: null,
    post: {
      loaded: false,
      loading: false,
      error: null,
    },
    update: {
      loaded: false,
      loading: false,
      error: null,
    },
    put: {
      loaded: false,
      loading: false,
      error: null,
    },
  },
  search: {
    error: null,
    items: [],
    total: 0,
    loaded: false,
    loading: false,
    batching: {},
    subrequests: {},
  },
  sharing: {
    update: {
      loaded: false,
      loading: false,
      error: null,
    },
    get: {
      loaded: false,
      loading: false,
      error: null,
    },
    data: {
      available_roles: [],
      entries: [],
      inherit: null,
    },
  },
  sidebar: {
    tab: 0,
  },
  types: {
    error: null,
    loaded: true,
    loading: false,
    types: [
      {
        '@id': 'http://localhost:3000/api/@types/Collection',
        addable: true,
        title: 'Collection',
      },
      {
        '@id': 'http://localhost:3000/api/@types/Event',
        addable: true,
        title: 'Event',
      },
      {
        '@id': 'http://localhost:3000/api/@types/File',
        addable: true,
        title: 'File',
      },
      {
        '@id': 'http://localhost:3000/api/@types/Folder',
        addable: true,
        title: 'Folder',
      },
      {
        '@id': 'http://localhost:3000/api/@types/Image',
        addable: true,
        title: 'Image',
      },
      {
        '@id': 'http://localhost:3000/api/@types/LRF',
        addable: false,
        title: 'LRF',
      },
      {
        '@id': 'http://localhost:3000/api/@types/Link',
        addable: true,
        title: 'Link',
      },
      {
        '@id': 'http://localhost:3000/api/@types/News Item',
        addable: true,
        title: 'News Item',
      },
      {
        '@id': 'http://localhost:3000/api/@types/Document',
        addable: true,
        title: 'Page',
      },
    ],
  },
  users: {
    user: {},
    users: [],
    create: {
      error: null,
      loaded: false,
      loading: false,
    },
    get: {
      error: null,
      loaded: false,
      loading: false,
    },
    list: {
      error: null,
      loaded: false,
      loading: false,
    },
    delete: {
      error: null,
      loaded: false,
      loading: false,
    },
    update: {
      error: null,
      loaded: false,
      loading: false,
    },
    update_password: {
      error: null,
      loaded: false,
      loading: false,
    },
    password: {
      error: null,
      loaded: false,
      loading: false,
    },
    initial: {
      error: null,
      loaded: false,
      loading: false,
    },
    reset: {
      error: null,
      loaded: false,
      loading: false,
    },
  },
  userSession: {
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTYwMDY1NTM1OSwiZnVsbG5hbWUiOm51bGx9.G7vqPxmRTQkJkLlRoUFZIJRJqdjjKcc9Ymacty9_h0g',
    login: {
      loaded: false,
      loading: false,
      error: null,
    },
  },
  vocabularies: {},
  workflow: {
    get: {
      loading: false,
      loaded: true,
      error: null,
    },
    transition: {
      loaded: false,
      loading: false,
      error: null,
    },
    history: [],
    transitions: [],
    multiple: [],
  },
  toolbar: {
    expanded: true,
  },
});

/**
 * Wrapper container class.
 * @class Wrapper
 * @extends Component
 */
export default class Wrapper extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    pathname: PropTypes.string,
    anonymous: PropTypes.bool,
    customStore: PropTypes.object,
  };

  customState() {
    let state = initialState();
    if (this.props.anonymous) {
      state.userSession.token = null;
    }
    if (this.props.customStore) {
      state = {
        ...state,
        ...this.props.customStore,
      };
    }
    return state;
  }

  render() {
    // If thunk is not included there's a complaint about async actions
    const history = createBrowserHistory();
    const store = configureStore(this.customState(), history);

    return (
      <Provider store={store}>
        <PluggablesProvider>
          <IntlProvider locale="en">
            <StaticRouter location={this.props.location}>
              <div className="volto-storybook-container">
                {this.props.children}
              </div>
            </StaticRouter>
          </IntlProvider>
        </PluggablesProvider>
      </Provider>
    );
  }
}
