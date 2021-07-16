import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { filter, find } from 'lodash';
import { Link } from 'react-router-dom';
import { defineMessages, injectIntl } from 'react-intl';

import { Icon, Display, Workflow } from '@plone/volto/components';
import { getBaseUrl } from '@plone/volto/helpers';
import config from '@plone/volto/registry';

import addSVG from '@plone/volto/icons/add-document.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import folderSVG from '@plone/volto/icons/folder.svg';
import moreSVG from '@plone/volto/icons/more.svg';
import pastanagaSmall from '@plone/volto/components/manage/Toolbar/pastanaga-small.svg';
import pastanagalogo from '@plone/volto/components/manage/Toolbar/pastanaga.svg';
import penSVG from '@plone/volto/icons/pen.svg';
import rightArrowSVG from '@plone/volto/icons/right-key.svg';
import userSVG from '@plone/volto/icons/user.svg';

// import { matchPath } from 'react-router';

const messages = defineMessages({
  edit: {
    id: 'Edit',
    defaultMessage: 'Edit',
  },
  contents: {
    id: 'Contents',
    defaultMessage: 'Contents',
  },
  add: {
    id: 'Add',
    defaultMessage: 'Add',
  },
  more: {
    id: 'More',
    defaultMessage: 'More',
  },
  personalTools: {
    id: 'Personal tools',
    defaultMessage: 'Personal tools',
  },
  shrinkToolbar: {
    id: 'Shrink toolbar',
    defaultMessage: 'Shrink toolbar',
  },
  personalInformation: {
    id: 'Personal Information',
    defaultMessage: 'Personal Information',
  },
  personalPreferences: {
    id: 'Personal Preferences',
    defaultMessage: 'Personal Preferences',
  },
  collection: {
    id: 'Collection',
    defaultMessage: 'Collection',
  },
  file: {
    id: 'File',
    defaultMessage: 'File',
  },
  link: {
    id: 'Link',
    defaultMessage: 'Link',
  },
  newsItem: {
    id: 'News Item',
    defaultMessage: 'News Item',
  },
  page: {
    id: 'Page',
    defaultMessage: 'Page',
  },
  back: {
    id: 'Back',
    defaultMessage: 'Back',
  },
  history: {
    id: 'History',
    defaultMessage: 'History',
  },
  sharing: {
    id: 'Sharing',
    defaultMessage: 'Sharing',
  },
  ManageTranslations: {
    id: 'Manage Translations',
    defaultMessage: 'Manage Translations',
  },
});

/**
 * A connect function that provides most of the default props for potential new
 * actions to be used in the Toolbar
 */
export const connectAction = compose(
  injectIntl,
  connect(
    (state, props) => ({
      actions: state.actions.actions,
      token: state.userSession.token,
      content: state.content.data,
      pathname: props.pathname,
      types: filter(state.types.types, 'addable'),
    }),
    {},
  ),
);

export const EditButton = (props) => {
  const editAction = find(props.actions.object, { id: 'edit' });
  const path = getBaseUrl(props.pathname);

  return editAction ? (
    <Link
      aria-label={props.intl.formatMessage(messages.edit)}
      className="edit"
      to={`${path}/edit`}
    >
      <Icon name={penSVG} size="30px" className="circled" />
    </Link>
  ) : (
    ''
  );
};

export const ContentsButton = (props) => {
  const folderContentsAction = find(props.actions.object, {
    id: 'folderContents',
  });
  const path = getBaseUrl(props.pathname);
  return (
    <>
      {props.content &&
        props.content.is_folderish &&
        folderContentsAction &&
        !props.pathname.endsWith('/contents') && (
          <Link
            aria-label={props.intl.formatMessage(messages.contents)}
            to={`${path}/contents`}
          >
            <Icon name={folderSVG} size="30px" />
          </Link>
        )}
      {props.content &&
        props.content.is_folderish &&
        folderContentsAction &&
        props.pathname.endsWith('/contents') && (
          <Link
            to={`${path}`}
            aria-label={props.intl.formatMessage(messages.back)}
          >
            <Icon
              name={clearSVG}
              className="contents circled"
              size="30px"
              title={props.intl.formatMessage(messages.back)}
            />
          </Link>
        )}
    </>
  );
};

export const AddButton = (props) => {
  const { settings } = config;
  return (
    props.content &&
    ((props.content.is_folderish && props.types.length > 0) ||
      (settings.isMultilingual &&
        props.content['@components'].translations)) && (
      <button
        className="add"
        aria-label={props.intl.formatMessage(messages.add)}
        onClick={(e) => props.toggleMenu(e, 'types')}
        tabIndex={0}
        id="toolbar-add"
      >
        <Icon name={addSVG} size="30px" />
      </button>
    )
  );
};

export const MoreButton = (props) => {
  return (
    <>
      <div className="toolbar-button-spacer" />
      <button
        className="more"
        aria-label={props.intl.formatMessage(messages.more)}
        onClick={(e) =>
          props.toggleMenu(e, 'more', { extras: props.actionComponents })
        }
        tabIndex={0}
        id="toolbar-more"
      >
        <Icon className="mobile hidden" name={moreSVG} size="30px" />
        {props.showMenu ? (
          <Icon className="mobile only" name={clearSVG} size="30px" />
        ) : (
          <Icon className="mobile only" name={moreSVG} size="30px" />
        )}
      </button>
    </>
  );
};

export const WorkflowAction = (props) => {
  const path = getBaseUrl(props.pathname);
  return (
    <li className="state-select">
      <Workflow pathname={path} />
    </li>
  );
};

export const DisplayAction = (props) => {
  const path = getBaseUrl(props.pathname);
  const editAction = find(props.actions.object, { id: 'edit' });
  return (
    <li className="display-select">
      {editAction && <Display pathname={path} />}
    </li>
  );
};

export const HistoryAction = (props) => {
  const path = getBaseUrl(props.pathname);
  const historyAction = find(props.actions.object, { id: 'history' });
  return (
    <li>
      <Link to={`${path}/history`}>
        <button>
          <div>
            <span className="pastanaga-menu-label">
              {historyAction?.title ||
                props.intl.formatMessage(messages.history)}
            </span>
            <span className="pastanaga-menu-value" />
          </div>
          <Icon name={rightArrowSVG} size="24px" />
        </button>
      </Link>
    </li>
  );
};

export const SharingAction = (props) => {
  const path = getBaseUrl(props.pathname);
  const sharingAction = find(props.actions.object, {
    id: 'local_roles',
  });
  return (
    sharingAction && (
      <li>
        <Link to={`${path}/sharing`}>
          <button>
            {props.intl.formatMessage(messages.sharing)}
            <Icon name={rightArrowSVG} size="24px" />
          </button>
        </Link>
      </li>
    )
  );
};

export const ManageTranslations = (props) => {
  const editAction = find(props.actions.object, { id: 'edit' });
  const path = getBaseUrl(props.pathname);
  const { settings } = config;
  return editAction && settings.isMultilingual ? (
    <li>
      <Link to={`${path}/manage-translations`}>
        <button>
          {props.intl.formatMessage(messages.ManageTranslations)}

          <Icon name={rightArrowSVG} size="24px" />
        </button>
      </Link>
    </li>
  ) : null;
};

export const UserButton = (props) => (
  <button
    className="user"
    aria-label={props.intl.formatMessage(messages.personalTools)}
    onClick={(e) => props.toggleMenu(e, 'personalTools')}
    tabIndex={0}
    id="toolbar-personal"
  >
    <Icon name={userSVG} size="30px" />
  </button>
);

export const Bottom = (props) => {
  return (
    <>
      <img className="minipastanaga" src={pastanagaSmall} alt="" />
      {!props.hideDefaultViewButtons && props.children}
      <div className="divider" />
      <div className="pastanagalogo">
        <img src={pastanagalogo} alt="" />
      </div>
    </>
  );
};
