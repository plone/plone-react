import React from 'react';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-intl-redux';
import { MemoryRouter } from 'react-router-dom';
import jwt from 'jsonwebtoken';
import thunk from 'redux-thunk';
import { PluggablesProvider } from '@plone/volto/components/manage/Pluggable';

import Toolbar from './Toolbar';

const mockStore = configureStore([thunk]);

describe('Toolbar', () => {
  it('renders the Toolbar component', () => {
    const store = mockStore({
      types: { types: [{ title: 'Document', addable: true }] },
      actions: {
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
          object_buttons: [
            {
              icon: '',
              id: 'cut',
              title: 'Cut',
            },
            {
              icon: '',
              id: 'copy',
              title: 'Copy',
            },
            {
              icon: '',
              id: 'delete',
              title: 'Delete',
            },
            {
              icon: '',
              id: 'rename',
              title: 'Rename',
            },
            {
              icon: '',
              id: 'ical_import_enable',
              title: 'Enable icalendar import',
            },
          ],
          portal_tabs: [],
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
      },
      userSession: {
        token: jwt.sign({ fullname: 'John Doe' }, 'secret'),
      },
      content: {
        data: {
          '@type': 'Folder',
          is_folderish: true,
        },
      },
      intl: {
        locale: 'en',
        messages: {},
      },
    });
    const component = renderer.create(
      <Provider store={store}>
        <PluggablesProvider>
          <MemoryRouter>
            <Toolbar pathname="/test" inner={<span />} activity="view" />
          </MemoryRouter>
        </PluggablesProvider>
      </Provider>,
    );
    const json = component.toJSON();
    expect(json).toMatchSnapshot();
  });
});
