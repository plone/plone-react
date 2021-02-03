import React from 'react';
import { defineMessages } from 'react-intl';

import More from '@plone/volto/components/manage/Toolbar/More';
import PersonalTools from '@plone/volto/components/manage/Toolbar/PersonalTools';
import Types from '@plone/volto/components/manage/Toolbar/Types';
import PersonalInformation from '@plone/volto/components/manage/Preferences/PersonalInformation';
import PersonalPreferences from '@plone/volto/components/manage/Preferences/PersonalPreferences';
import StandardWrapper from '@plone/volto/components/manage/Toolbar/StandardWrapper';

import {
  EditButton,
  AddButton,
  ContentsButton,
  MoreButton,
  WorkflowAction,
  DisplayAction,
  HistoryAction,
  SharingAction,
  ManageTranslations,
  Bottom,
  UserButton,
} from '@plone/volto/components/manage/Toolbar/ToolbarComponents';

const messages = defineMessages({
  personalInformation: {
    id: 'Personal Information',
    defaultMessage: 'Personal Information',
  },
  personalPreferences: {
    id: 'Personal Preferences',
    defaultMessage: 'Personal Preferences',
  },
});

/**
 * Toolbar "side components". Dropdowns, popups and more
 */
const toolbarComponents = {
  personalTools: { component: PersonalTools, wrapper: null },
  more: { component: More, wrapper: null },
  types: { component: Types, wrapper: null, contentAsProps: true },
  profile: {
    component: PersonalInformation,
    wrapper: StandardWrapper,
    wrapperTitle: messages.personalInformation,
    hideToolbarBody: true, // shows a second 'view' once clicked
  },
  preferences: {
    component: PersonalPreferences,
    wrapper: StandardWrapper,
    wrapperTitle: messages.personalPreferences,
    hideToolbarBody: true,
  },
};

const moreMenu = (actions) => {
  return (props) => <MoreButton actionComponents={actions} {...props} />;
};

export const bottom = (actions) => {
  return (props) => <Bottom actionComponents={actions} {...props} />;
};

const defaultMoreActions = [
  WorkflowAction,
  DisplayAction,
  HistoryAction,
  SharingAction,
  ManageTranslations,
];
const defaultViewActions = [
  EditButton,
  ContentsButton,
  AddButton,
  moreMenu(defaultMoreActions),
];
const defaultBottomActions = [UserButton];

/**
 * Registered activities in volto:
 * - view, add, edit, contents, contact-form, search, history, sharing,
 *   manage-translations, diff, control-panel
 */
const activities = {
  default: {
    top: [],
    bottom: [],
  },
  view: {
    top: [...defaultViewActions],
    bottom: [bottom(defaultBottomActions)],
  },
  contents: {
    top: [...defaultViewActions],
    bottom: [bottom(defaultBottomActions)],
  },
};

export const defaultToolbar = {
  toolbarComponents,
  activities,
  defaultMoreActions,
  defaultBottomActions,
  defaultViewActions,
};
