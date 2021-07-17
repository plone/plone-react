# Folder structure

Volto is based on React, Redux, and React-Router. All of the
code is located in the `src` folder. The following convention for locating
resources is used.

## Components

`components` contains all the React components, AKA views. This includes views for the
management interface and the theme.

## Actions

`actions` contains all the redux actions for fetching all backend data like
content, users and external resources that are pulled into our app in general.

## Reducers

`reducers` contains all the Redux reducers that manage the life-cycle for Redux actions
and make the according changes to state.

## Selectors

`selectors` contains all the [Redux
selectors](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#selectors)
that interpret state into the form used by UI components.

## Constants

The constants contain all constants including the action types.

## Helpers

`helpers` contains helper methods like for example url helpers.

## Config

In this folder all configuration is stored. All configuration can be overridden
in your theme package.

## Theme

The `theme` folder lives in the root of the Volto boilerplate and by default
uses the *Pastanaga* Theme look and feel.

Inside you can find the `theme.config` file that is used to set the theme
general settings.

The site customizations also should be located inside this folder following
[SemanticUI folder naming](https://github.com/Semantic-Org/Semantic-UI/tree/master/src/themes/default).

 * assets
 * collections
 * elements
 * globals
 * modules
 * views

## Locales

The `locales` folder contains all the artifacts relating to the translations.
For more details how to translate individual strings, please refer to the [internationalization section](i18n.md).
