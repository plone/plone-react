# Change Log

## 13.8.2 (unreleased)

### Breaking

### Feature

- Close object browser when pressing ESC @nzambello

### Bugfix

- Fix outside click handling in object browser @nzambello

### Internal

## 13.8.1 (2021-07-16)

### Bugfix

- Missing prop `properties` passed down required for #2579 to work properly @sneridagh

## 13.8.0 (2021-07-14)

### Feature

- A new component was added, `BlockChooserButton`, it encapsulate the logic of show/hiding the `BlockChooser` @tiberiuichim
- Overload `required` property for blocks config, it supports a function as value taken `properties` (current object data) and `block` (the block being evaluated in `BlockChooser`). The purpose is to enable more control over the available blocks in the Blocks chooser. @sneridagh

### Bugfix

- Add fallback to the "image" field in Image Gallery if the listingPreviewImageField defined in the project is not available on an object @jackahl

## 13.7.0 (2021-07-12)

### Feature

- VocabularyTermsWidget option with translations for config.settings.supportedLanguages @ksuess

### Bugfix

- Fix InlineForm's understanding of missing default values @rexalex
- Guard in `isInternalURL` to catch non-string values @sneridagh

### Internal

- Update `browserlist` DB @sneridagh
- Install `luxon` explicitly to fix `rrule` package flickering deps (yarn problem) @sneridagh
- Add a11y cypress test for table block @ThomasKindermann
- Add Cypress test for Link content type @tisto
- Upgrade plone.restapi to 8.4.1 in the dev buildout @tisto

## 13.6.0 (2021-07-03)

### Feature

- Add VocabularyTermsWidget and map to field with widget attribute set to 'vocabularyterms'. @ksuess

### Bugfix

- added "Complementary" landmark-role to skiplink-container for a11y @ThomasKindermann
- changed breadcrumb link text-color slightly for a11y color contrast @ThomasKindermann
- changed table headline text color to black for a11y @ThomasKindermann

### Internal

- Updated Brazilian Portuguese translations @ericof

## 13.5.0 (2021-06-30)

### Feature

- Add og tags for social sharing @giuliaghisini @nzambello
- Add interface for plone seo extensions to use values added by them as metadata @jackahl

### Internal

- Upgrade to Storybook 6.3, refresh deps version for babel @sneridagh

## 13.4.0 (2021-06-29)

### Feature

- Working copy support for Plone (plone.app.iterate) @sneridagh

## 13.3.1 (2021-06-29)

### Internal

- Remove locales .json files pushed again by mistake, now they are no longer needed to be in the repo, since they are generated at runtime, and included in the released versions @sneridagh

## 13.3.0 (2021-06-29)

### Feature

- Allowing user to paste url in search box in objectBrowser @iFlameing
- Allowing user to click on the breadcrumbs of objectBrowser @iFlameing
- `Navigation` and `Breadcrumbs` are `apiExpanders` aware and run the action depending on them @sneridagh

### Bugfix

- Fixed docs for config.settings.externalRoutes @giuliaghisini
- Fix `Pluggable` in the use case that a `Plug` is empty @sneridagh
- Fix `Login` component navigation for `INavigationRoot` structures @sneridagh
- Hyphenation block chooser labels (no html changes) @ksuess

### Internal

- Bumps prismjs from 1.23.0 to 1.24.0. @timo

## 13.2.2 (2021-06-18)

### Bugfix

- Avoid debugging error in toolbar @tiberiuichim
- Fix the bug related to specific versioning view @iFlameing
- Fix blocks-listing Cypress test @giuliaghisini
- Fix the translation of header in babel view @iFlameing
- Fix German translations for leadimage and listing block @timo
- Show toast success message when adding a new local role @iFlameing
- Bump postcss from 7.0.29 to 7.0.36 @timo
- Complete Spanish translation @erral
- Complete German translation @timo

## 13.2.1 (2021-06-14)

### Bugfix

- Changed 'batch_size' attribute in 'b_size' in querystring widget. @giuliaghisini

### Internal

- Upgrade generator deps @sneridagh

## 13.2.0 (2021-06-12)

### Feature

- Allow passing a schemaEnhancer to QuerystringWidget @tiberiuichim
- Add internal URL blacklist to avoid render custom routes in Volto @nzambello
- In listing blocks, scroll to start of listing block instead page start @giuliaghisini

### Bugfix

- Fix addBreaklinesInline when string ends with new line @giuliaghisini
- Changed 'batch_size' attribute in 'b_size' in querystring widget. @giuliaghisini
- Properly respect batching and result limits in listing block @tiberiuichim
- Changed 'batch_size' attribute in 'b_size' in querystring widget. @giuliaghisini
- Properly respect batching and result limits in listing block @tiberiuichim
- Improve folder_contents workflow state (#2017) @avoinea
- Making placeholder image of video block to take 100% width when it is right or left aligned @iFlameing
- Showing clear icon when title is too long in objectbrowser selected items in multiple mode @iFlameing
- Use querystring prop in ListingBody @giuliaghisini
- Set default value selected for variation in listing block @giuliaghisini

### Internal

- Add [Volta](https://volta.sh) support @nzambello
- Various minor `Makefile` cleanup @rpatterson
- Improve error handling in UniversalLink @nzambello

## 13.1.2 (2021-05-26)

### Internal

- Make the `AddLinkForm` component generic, to allow reuse in volto-slate @tiberiuichim
- Adding hover effect on ObjectBrowserNav icon @iFlameing

## 13.1.1 (2021-05-25)

### Bugfix

- Second try to fix images in dev mode when api path is present (e.g. using the Robot server in Cypress tests) @sneridagh

## 13.1.0 (2021-05-24)

### Feature

- enabled ability to set 'extractScripts' for error pages @giuliaghisini

### Bugfix

- Modify Default and Summary templates to render the LinkMore @ionlizarazu
- Revert #2472, this broke normal development mode images @sneridagh

## 13.0.2 (2021-05-22)

### Bugfix

- Apply the `schemaEnhancer` from the main block even if no variations are found @sneridagh

### Internal

## 13.0.1 (2021-05-18)

### Bugfix

- Backwards compatibility for existing listing blocks with templates @sneridagh

## 13.0.0 (2021-05-18)

### Breaking

- Seamless mode by default in development. Added `Host` header support for production
  deployments, so no `RAZZLE_API_PATH` is required in production builds anymore if the
  header is present. Not an strictly breaking change, but it's a default behavior change
  worth to notice on its own. No change required in your deployments if you suply
  currently `RAZZLE_API_PATH` in build time. See documentation for more information.
  @sneridagh
- Deprecate Node 10 since it's out of LTS since April 30th, 2021 @sneridagh
- Remove the "inverted" option in Table Block since it was useless with the current CSS
  set. Better naming of options and labels in table block (English). Updating the i18n messages for the used translations is advisable, but not required. @iFlameing
- Get rid of the font icons in the control panels overview @sneridagh
- Refactored `src/components/manage/Widgets/QuerystringWidget` using `ObjectWidget` and schemas @sneridagh
- Refactored `Listing` block using the new `src/components/manage/Widgets/QuerystringWidget`. Introducing a new `showLinkMore` block option opt-in for the additional feature instead of always-in. Deprecated `ListingSidebar` and `src/components/manage/Blocks/Listing/QuerystringWidget` in favor of the new `src/components/manage/Widgets/QuerystringWidget` @sneridagh

For a more information, please read the upgrade guide
https://docs.voltocms.com/upgrade-guide/

### Feature

- Compile i18n json locales only at build time on the fly and at release time @sneridagh
- Change login form fixing accessibility issues @nzambello

### Bugfix

- Fix the Listing block with criteria to render correctly on a non-multilingual homepage. @ionlizarazu
- Fix selection of previous block when deleting a block @tiberiuichim
- Disable `Select` components family to lazy load on SSR, since it's breaking and the fix is quite obscure. They are not valuable on SSR responses anyway. @sneridagh
- Fix leftover from the multilingual fix for composed language names @sneridagh @ericof
- Translate 'All' label in Contents view pagination. @giuliaghisini
- Replace `langmap` dependency with internal code that supports composite language names @sneridagh @ericof
- RenderBlocks: Blocks like the listing block need a path. @ksuess
- Normalize language to get the correct filename in lazy imports for composite language names @sneridagh @ericof
- Checkbox not using `null` as false @sneridagh
- Use params prop in api middleware @giuliaghisini
- Fix PORT env var handling, if you have set the PORT in build time, the setting was
  removed back to defaults, now the build time setting is kept (unsetting in build time
  and set it in runtime is now the recommended setup) @sneridagh
- Fix sort_order restapi call, works on action for existing listing blocks
  and in ListingData saving correctly new ones @nzambello
- Fix `contextURL` in `ObjectBrowser` for special (add/edit) views using `getBaseUrl` @sneridagh

### Internal

- Full real zero configuration achievement by turning the stock default
  `RAZZLE_PUBLIC_DIR` into a relative path, so we can enable truly movable builds
  @sneridagh
- Upgrade Cypress to latest @sneridagh
- Remove surge since it's not used anymore @sneridagh
- Upgrade `react-redux` and friends @sneridagh
- Upgrade `yarnhook` and `yarn-deduplicate` @sneridagh
- Add Listing block test for root path @ionlizarazu
- Only log changes to po (`poToJson`) if running as a script @sneridagh
- Remove json locales from the repo to avoid merge conflicts @sneridagh
- All the `Select` components family in core are loaded through `Loadables` helper @sneridagh
- Updated Brazilian Portuguese translations @ericof
- Improve Github Actions names, separate the code analysis from the main core @sneridagh

## 13.0.0-alpha.10 (2021-05-16)

### Bugfix

- Fix the Listing block with criteria to render correctly on a non-multilingual homepage. @ionlizarazu
- Fix selection of previous block when deleting a block @tiberiuichim

### Internal

- Upgrade Cypress to latest @sneridagh
- Remove surge since it's not used anymore @sneridagh
- Upgrade `react-redux` and friends @sneridagh
- Upgrade `yarnhook` and `yarn-deduplicate` @sneridagh
- Add Listing block test for root path @ionlizarazu
- Only log changes to po (`poToJson`) if running as a script @sneridagh

## 13.0.0-alpha.9 (2021-05-13)

### Feature

- Compile i18n json locales only at build time on the fly and at release time @sneridagh

### Internal

- Remove json locales from the repo to avoid merge conflicts @sneridagh

## 13.0.0-alpha.8 (2021-05-12)

### Bugfix

- Disable `Select` components family to lazy load on SSR, since it's breaking and the fix is quite obscure. They are not valuable on SSR responses anyway. @sneridagh

### Internal

- All the `Select` components family in core are loaded through `Loadables` helper @sneridagh

## 13.0.0-alpha.7 (2021-05-11)

### Bugfix

- Fix leftover from the multilingual fix for composed language names @sneridagh @ericof

### Internal

- Updated Brazilian Portuguese translations @ericof

## 13.0.0-alpha.6 (2021-05-11)

### Bugfix

- Translate 'All' label in Contents view pagination. @giuliaghisini
- Replace langmap dependency with internal code that supports composite language names @sneridagh @ericof

## 13.0.0-alpha.5 (2021-05-10)

### Bugfix

- RenderBlocks: Blocks like the listing block need a path. @ksuess
- Normalize language to get the correct filename in lazy imports for composite language names @sneridagh @ericof

### Internal

- Updated Brazilian Portuguese translations @ericof

## 13.0.0-alpha.4 (2021-05-07)

### Breaking

- Refactored `src/components/manage/Widgets/QuerystringWidget` using `ObjectWidget` and schemas @sneridagh
- Refactored `Listing` block using the new `src/components/manage/Widgets/QuerystringWidget`. Introducing a new `showLinkMore` block option opt-in for the additional feature instead of always-in. Deprecated `ListingSidebar` and `src/components/manage/Blocks/Listing/QuerystringWidget` in favor of the new `src/components/manage/Widgets/QuerystringWidget` @sneridagh

For a more information, please read the upgrade guide
https://docs.voltocms.com/upgrade-guide/

### Bugfix

- Checkbox not using `null` as false @sneridagh

## 13.0.0-alpha.3 (2021-05-06)

### Bugfix

- Use params prop in api middleware @giuliaghisini

- Fix PORT env var handling, if you have set the PORT in build time, the setting was
  removed back to defaults, now the build time setting is kept (unsetting in build time
  and set it in runtime is now the recommended setup) @sneridagh

## 13.0.0-alpha.2 (2021-05-05)

### Bugfix

- Fix sort_order restapi call, works on action for existing listing blocks
  and in ListingData saving correctly new ones @nzambello

### Internal

- Updated Brazilian Portuguese translations @ericof

## 13.0.0-alpha.1 (2021-05-03)

### Internal

- Full real zero configuration achievement by turning the stock default
  `RAZZLE_PUBLIC_DIR` into a relative path, so we can enable truly movable builds
  @sneridagh

## 13.0.0-alpha.0 (2021-05-03)

### Breaking

- Seamless mode by default. Added `Host` header support for deployments, so no
  `RAZZLE_API_PATH` is required in production builds anymore if the header is present.
  Not an strictly breaking change, but it's a default behavior change worth to notice on
  its own. No change required in your deployments if you suply currently
  `RAZZLE_API_PATH` in build time. See documentation for more information. @sneridagh
- Deprecate Node 10 since it's out of LTS since April 30th, 2021 @sneridagh
- Remove the "inverted" option in Table Block since it was useless with the current CSS
  set. Better naming of options and labels in table block (English). Updating the i18n messages for the used translations is advisable, but not required. @iFlameing
- Get rid of the font icons in the control panels overview @sneridagh

For a complete list of actions to follow, please read the upgrade guide
https://docs.voltocms.com/upgrade-guide/

### Feature

- Change login form fixing accessibility issues @nzambello

### Internal

- Improve Github Actions names, separate the code analysis from the main core @sneridagh

## 12.14.0 (2021-05-03)

### Feature

- Provide api for block extensions. See `/blocks/extensions` in documentation @tiberiuichim

### Bugfix

- In BlockDataForm, always clone schema before applying enhancers @tiberiuichim
- In BlockDataForm, don't add the variations field multiple times @tiberiuichim

## 12.13.0 (2021-04-30)

### Feature

- Making objectBrowserWidget context aware @iFlameing

### Bugfix

- Adding `flattenToAppURL` in Link component @iFlameing

- Disable click event of the outside the engine click detection, since it leads to bad
  behavior for custom and library elements that try to mount things attaching them in
  the Body or outside the detected container @sneridagh

## 12.12.0 (2021-04-29)

### Feature

- Translations german: Login/Register @ksuess

### Bugfix

- Fix image gallery in listing block for contained (non-query based) images @sneridagh

## 12.11.0 (2021-04-28)

### Feature

- Implemented Babel view, to compare translated items in add and edit mode. @giuliaghisini
- as in Plone, hide controlpanel for users that are no 'Manager' or 'Site Administrator'. @giuliaghisini
- Improve the blocks engine by adding a detector for clicking outside in the `BlocksForm` @sneridagh
- Include a pluggable architecture for pluggable render-time insertions (similar to <Portal>) @tiberiuichim
- Add parseDateTime helper from DatetimeWidget to handle timezones @nzambello

### Bugfix

- Include selected block in multiselections @sneridagh
- Correct the selected values rendering at isMulti SelectWidget @ionlizarazu

### Internal

- Implement Github actions workflow to deploy the documentation to the Plone Foundation server @ericof
- Pin `immutable` to an updated version that does not produce continuous deprecation notices in console on every change @sneridagh
- Print console.error in SSR if not an ignored error code @nzambello
- Fetch addons with https using mrs-developer @nzambello
- Fix sitemap URL generation @nzambello

## 12.10.1 (2021-04-14)

### Bugfix

- Better error handling code in SSR when an error occurs in the code @ksuess @sneridagh

## 12.10.0 (2021-04-14)

### Feature

- Add support in FileWidget for raw file data in base64 (control panels, not really NamedFile fields) @sneridagh

### Bugfix

- ObjectListWidget: edit mode: expand last added item, not first of list. @ksuess
- Improve error handling in SSR when an error occurs in the code @sneridagh

### Internal

- Ignore files in addons when building i18n messages in the i18n script, since it's useless (they should be done in the addon itself) and lead to errors when parsing also internal `node_modules` and other utility files @sneridagh

## 12.9.0 (2021-04-10)

### Bugfix

- Avoid double calling asyncPropsExtenders @ksuess @tiberiuichim

### Internal

- Fix server when ECONNRESET is received from the backend @sneridagh
- Remove all appearences of `UNSAFE_componentWillMount` since it loads also on the SSR calls too @sneridagh

## 12.8.0 (2021-04-08)

### Feature

- Add configurable api expanders @csenger @nileshgulia1 @tiberiuichim @sneridagh
- In Text block, keep text selection on focus, and move focus to end of text if there's no selection @giuliaghisini

### Bugfix

- Fix `fieldset` instead of `fieldSet` in ObjectWidget component @sneridagh

## 12.7.0 (2021-04-07)

### Feature

- Use `onInsertBlock` callback when adding new blocks if available, otherwise fallback to `onMutateBlock` refs #2330 @avoinea

### Bugfix

- fix universal link @nileshgulia1s
- fixed recurrence widget when weekly recurrence is selected and event start date is on sunday. @giuliaghisini
- Fix default value for checkbox widget @alexbueckig
- Fix for forms in content types, the fieldset was not being passed over to the field. This affected form generation ids and labels. @sneridagh
- Add a bit of a11y love to the `ObjectListWidget` @sneridagh
- fix universal link when no item content obj passed @nileshgulia1

### Internal

- Add Blocks helpers docs and tests @avoinea

## 12.6.1 (2021-04-06)

### Bugfix

- Remove duplicated wrapper on block edit form @sneridagh
- Fix small catched up issues in tests @sneridagh

## 12.6.0 (2021-04-05)

### Feature

- Add ObjectWidget and ObjectListWidget @sneridagh
- Add `BlockForm` component, variations and schemaExtender aware @sneridagh
- Improvements to the `InlineForm` @sneridagh

### Bugfix

- Remove InlineForm default focus on first input @avoinea

### Internal

- Add Storybook to the main docs (docs.voltocms.com/storybook) build @sneridagh

## 12.5.0 (2021-03-31)

### Feature

- New setting, `config.settings.showTags` to be able to configure tags visibility on default View @avoinea

### Bugfix

### Internal

- Add toPublicURL helper @nzambello
- Don't show empty groups in BlockChooser @tiberiuichim
- Fix Text Block placeholder regression refs #2322 @avoinea

### Internal

- BlocksForm and RenderBlocks now allow a `blocksConfig` configuration object as a prop @tiberiuichim
- Updated italian translations @nzambello

## 12.4.2 (2021-03-29)

### Bugfix

- Re-add formTitle, formDescription, metadata to BlocksForm @avoinea

## 12.4.1 (2021-03-29)

### Bugfix

- Fixed InlineForm boolean false value @razvanMiu
- Fix warning message in console, move open/close detection to the aside itself @sneridagh
- Revert SidebarPortal min-height @avoinea
- Add proper proptype in `SidebarPopup` @sneridagh

### Internal

- Update plone/volto Docker image to use latest yo generator and support ADDONS env @avoinea
- Add `docker-compose.yml` to the repo for quick demoing @sneridagh
- Fixed babel config when loading addons (in testing mode) @sneridagh

## 12.4.0 (2021-03-25)

### Feature

- Improved comments @rexalex @avoinea
- Added SidebarPopup component for extra sidebar handling @avoinea
- Use SidebarPopup component in place of CSS transition sidebar @nileshgulia1

### Bugfix

- Fixed multiSelected propType and BlocksForm multiSelected.includes @avoinea
- Fixed italian translations for block `Maps` @giuliaghisini
- Fixed SidebarPortal min-height @avoinea
- Fixed CheckboxWidget state @razvanMiu

### Internal

- Upgrade API to Plone 5.2.4 and p.restapi 7.1.0 @sneridagh
- Reorganization of the Cypress tests, now they live in `cypress/tests` @sneridagh
- Splitted Cypress tests into `core` tests and `guillotina` ones for better overall handling @sneridagh

### Docs

- Update internal proxy docs @nzambello

## 12.3.0 (2021-03-18)

### Feature

- Improve `ObjectBrowserWidget` adding a manual input field and allow external URLs. Add feature to paste internal URLs and convert them to selected objects. Added the `allowExternals` prop in order to allow this behavior (opt-in).

### Bugfix

- Fix storybook initial config registry setup @sneridagh
- Search page now follows Plone's ISearchSchema settings @tiberiuichim
- Improve `ContextNavigation` component, adding the level you are in each iteration @sneridagh

### Internal

- Add testing add-on for enable special testing use cases and configuration options @sneridagh
- Add `RAZZLE_TESTING_ADDONS` environment variable for adding addons for testing purposes @sneridagh
- Add "Humboldt Labor" to show cases.
- Updated "Volto in Production" list @alecghica

### Docs

- Explicitly mention `src/config` in the "Internal proxy to API" documentation @pigeonflight

## 12.2.0 (2021-03-03)

### Feature

- Adds skiplinks @nzambello
- Fix some semantic tags as nav @nzambello
- Allow addons to specify their own dependencies in their package.json `addons` key, just like the regular Volto projects. This means that it's no longer required to list all possible addons in the Volto project and they can be bootstrapped as being part of a dependency @tiberiuichim
- insert a dimmer with the loading message in the form when the status changes in the content folder. @martina.bustacchini

### Bugfix

- Enable draftjs links to open in target blank if is external url. @giuliaghisini

### Internal

- Use correct status code for static files error handling @nzambello
- Remove dangling `.replaces(...` for the apiPath and use flattenToAppURL instead @sneridagh

## 12.1.2 (2021-02-28)

### Bugfix

- Fix addon reducers registration @tiberiuichim

## 12.1.1 (2021-02-26)

### Bugfix

- Import asyncConnected actions directly from actions module, the resolution order is different in projects @tiberiuichim @avoinea

## 12.1.0 (2021-02-24)

**This is a brown bag release and should not be used, upgrade to Volto 12.1.1 instead.**

### Feature

- A new setting, `config.settings.storeExtenders` which allows customization of used Redux middleware @tiberiuichim
- Introduce `config.settings.asyncPropsExtenders` which allows customizing, per route, the `asyncConnected` actions @tiberiuichim @sneridagh

### Bugfix

- Adapt to BlocksForm in Blocks Engine @nileshgulia1
- a11y improvements in `ObjectBrowser` and `BlockChooser` @sneridagh
- Fix UniversalLink for download link. @giuliaghisini

### Internal

- Fork redux-connect code in `src/helpers/AsyncConnect`, to allow mixing in config-based asyncConnects. Provide a webpack alias that overloads the redux-connect imports. @tiberiuichim

### Docs

- Update wording @svx

## 12.0.0 (2021-02-20)

### Breaking

- Introduction of the new Volto Configuration Registry @sneridagh @tiberiuichim
  For more information about this breaking change: https://docs.voltocms.com/upgrade-guide/#upgrading-to-volto-12xx

### Feature

- New breadcrumbs `INavigationRoot` aware for the _Home_ icon. This allows inner subsites navigation and better support for multilingual sites. @sneridagh

### Internal

- Upgrade plone.restapi to 7.0.0 and Plone to 5.2.3 @sneridagh

## 12.0.0-alpha.0 (2021-02-17)

### Breaking

- Introduction of the new Volto Configuration Registry @sneridagh @tiberiuichim
  For more information about this breaking change: https://docs.voltocms.com/upgrade-guide/#upgrading-to-volto-12xx

## 11.1.0 (2021-02-08)

### Feature

- Add `preloadLazyLibs` and `settings.lazyBundles` to allow preloading bundles of lazy libraries @tiberiuichim @silviubogan
- Added onChangeFormData prop to Form component @giuliaghisini
- Internationalization story for add-ons @sneridagh
- robots.txt from plone as fallback (if /public/robots.txt not exists and .env VOLTO_ROBOTSTXT variable not exists.) @giuliaghisini
- UniversalLink and ConditionalLink accepts also an item to link to. If item is of @type Link, a direct link to remote url is generated if user is not logged. @giuliaghisini

### Bugfix

- temporarly removed linkDetectionPlugin for draftjs (for some conflicts with AnchorPlugin) @giuliaghisini
- German translation: aria-label of '/contents' button : "Inhalte" not "Inhaltsverzeichnis" @ksuess
- fix view links and others styles of entities on editing Text Block. @giuliaghisini
- Make sidebar-collapsed visible on small mobile. @giuliaghisini
- Fix regresion on the imagesizes styling due to the removal of the id in 11 @sneridagh

### Internal

- Update docs: configuration of routes and addonRoutes @ksuess

## 11.0.0 (2021-01-29)

### Breaking

- [circular deps] Move `AlignBlock` component to its rightful place @sneridagh
- Removing id from FormFieldWrapper @iFlameing
- Change default Listing Template to include only Text and renamed the old default Template to Summary Template @jackahl

### Feature

- Add `ContextNavigation` component, it can fetch the `@contextnavigation` plone.restapi
  endpoint and display a navigation portlet, similar to Plone's classic
  navigation portlet.
- added linkDetectionPlugin plugin to draftjs to automatically create links for urls and mails when editing text. @giuliaghisini
- An initial Storybook setup. Start it with `yarn storybook`. Feel free to contribute more stories! @sneridagh
- Add storybook Wrapper utility component. Add ContactForm initial story @tiberiuichim
- make and load configurable reducers in the client `window.__data`, decreasing the html size @nileshgulia1 @tiberiuichim
- Custom group component for selectStyling @nileshgulia1
- Add new components: RenderBlocks, BlocksForm, DragDropList and EditBlockWrapper @tiberiuichim
- Add `noValueOption` prop to `SelectWidget` so you can opt-out from the "no-value" option so the choices are a closed list @sneridagh
- Provide `injectLazyLibs()` wrapper and `settings.loadables` config to deal with loadable libraries @tiberiuichim

### Bugfix

- Better handling of a condition in the new breadcrumbs @sneridagh

### Internal

- Upgrade react-select to 4.0.2 @sneridagh
- Upgrade react ecosystem to 13.14.0 @sneridagh
- Add shouldComponentUpdate to blocks @nileshgulia1
- Update old entry in upgrade guide @tiberiuichim
- Add `@testing-library/cypress` as a dep @sneridagh
- Fix an internal link in documentation @tiberiuichim

## 10.10.0 (2021-01-22)

### Feature

- Simple optional critical-CSS inclusion feature (without the actual building of
  the critical CSS) @silviubogan @tiberiuichim @nileshgulia1
- added support for allowedBlocks and showRestricted for BlockChooser in Form @giuliaghisini
- added objectBrowser to UrlWidget, and attached UrlWidget to remoteUrl field of ContentType Link @giuliaghisini
- managed tel link in UrlWidget and draftjs @giuliaghisini
- added support for allowedBlocks and showRestricted for BlockChooser in Form @giuliaghisini
- Improvements in InlineForm @nileshgulia1
- Improved form validation. Tested required fields when field is array or richtext @giuliaghisini

### Bugfix

- Fix 'All' button batch size in Contents @nzambello
- Fixed field type for 'from' field in ContactForm @giuliaghisini
- handle SelectWidget null value and isMulti(#1915) &(1878) @nileshgulia1
- Fix typo in ita locales @nzambello
- Wrap objectBrowserWidget with FormFieldWrapper @nileshgulia1
- Added preventDefault and stopPropagation for toolbar buttons of Table block. @giuliaghisini
- Fix `Contents` breadcrumbs for multilingual sites @sneridagh

### Internal

- Add support for `nav_title` in breadcrumbs and navigation @sneridagh
- Add `settings.serverConfig` in the settings object of `~/config`. Add another module, `config/server.js` which is conditionally imported if `__SERVER__`. This module will host settings that are only relevant to the server. Being conditionally imported means that the code is safe to require server-only nodejs packages. @tiberiuichim
- Update browserlist and caniuse-lite @sneridagh
- Document deprecation of `@plone/create-volto-app` @sneridagh @nileshgulia1
- Adding classname in TextWidget and ObjectBrowserBody so that we can target those element in tests. @iFlameing
- Add support for `nav_title` in breadcrumbs and navigation @sneridagh

## 10.9.2 (2021-01-15)

### Bugfix

- Make a cypress test more resilient to platform differences @tiberiuichim
- Fix regression introduced by improve CSS in the inner toolbar for the image block to support narrower width (like for using it inside grid blocks) @sneridagh
- Avoid a bug in cypress tests caused by multi-block copy/paste @tiberiuichim

### Internal

- i18n for a literal in the table block @sneridagh

## 10.9.1 (2021-01-14)

### Bugfix

- Fix regression introduced by improve CSS in the inner toolbar for the image block to support narrower width (like for using it inside grid blocks) @sneridagh

## 10.9.0 (2021-01-14)

### Feature

- Enhance `BlockChooser` by adding support for `allowedBlocks` and `showRestricted` @avoinea @sneridagh

### Bugfix

- Better handling of @@images pipeline errors @tiberiuichim
- Fix `More` menu when using with Plone 4 backend / history action is undefined (#2120) @avoinea
- Fix `/sharing` page when using with Guillotina (#2122) @avoinea
- Improve CSS in the inner toolbar for the image block to support narrower width (like for using it inside grid blocks) @sneridagh

### Internal

- Move express middleware routes (sitemap, download, images and robotstxt) out of server.jsx into their own `express-middleware/*.js` modules. All express middleware now has access to the redux store, api middleware and an errorHandler, available under `req.app.locals` @tiberiuichim

## 10.8.0 (2021-01-11)

### Feature

- Add proper icons to the table block @sneridagh

### Internal

- Add `packages` directory to the `modulePathIgnorePatterns` for the jest tests @sneridagh
- Add `packages` directory in npmignore @sneridagh

## 10.7.0 (2021-01-05)

### Feature

- Lazy load image in blocks Image and HeroImage @mamico

### Bugfix

- Fix redirection for Link objects. @cekk
- Fix import order in server.jsx. @cekk @tiberiuichim
- Make sentry config more resilient to edge cases (SPA, storybook) @sneridagh
- Handle errors on file and image download (#2098) @cekk
- Remove test dependant on the year in `Copyright` footer section @sneridagh
- Increase maxResponseSize for superagent calls. Now is 500mb (#2098) @cekk

### Internal

- Translations german: Unauthorized, Login/Register @ksuess
- Removing id from FormFieldWrapper @iFlameing

## 10.6.1 (2020-12-21)

### Bugfix

- Better API helper end request handling, since the existing one was causing problems and rendered the SSR server unusable in case of the request was rejected @sneridagh

### Internal

- Add a paragraph on dealing with CORS errors in Deploying doc page @tiberiuichim
- Remove useless RobotFramework related packages, keep only the minimum required ones @sneridagh
- Updated italian translations @nzambello

## 10.6.0 (2020-12-18)

### Feature

- Allow setting a custom robots.txt from environment with the `VOLTO_ROBOTSTXT` environment variable @tiberiuichim

### Bugfix

- Replace `__SERVER__` occurrence from table `Edit` component @sneridagh

## 10.5.0 (2020-12-17)

### Feature

- Adding `All` button to folder content @iFlameing

### Bugfix

- Fix "is client" check for SidebarPortal @tiberiuichim @sneridagh

## 10.4.3 (2020-12-15)

### Internal

- Bring back `App` to `components/index.js` for now, since it's breaking the projects
  where it gets referenced from `routes.js`. @sneridagh

## 10.4.2 (2020-12-15)

**This is a brown bag release and should not be used, upgrade to Volto 10.4.3 instead.**

### Bugfix

- Fix numeric widget console warnings regarding flex styling refs #2059 @ichim-david
- Fix numeric widget crash once we click inside it refs #2059 @ichim-david

### Internal

- Fix some key points to improve the circular imports problem @sneridagh

  - `App` and `View` components are meant to be used only by Volto internals, so it's no
    point into having them exported in `components/index.js` that facilitated a path for
    circular imports.
  - `withObjectBrowser` and friends also are prone to facilitate a path for having
    circular imports, so we are using there only absolute imports.
  - All these changes are non-breaking and non-intrusive.

## 10.4.1 (2020-12-12)

### Bugfix

- Make sure that prism is loaded before rendering HTML block @tiberiuichim

## 10.4.0 (2020-12-11)

### Feature

- Add ability to filter the attributes that are saved in the ObjectBrowserWidget @sneridagh
- Add `object_browser` as widget @sneridagh

### Bugfix

- Adding video thumbnail for the .mp4 extension @iFlameing.

### Internal

- Added new in productions sites to README @terapyon

## 10.3.0 (2020-12-04)

### Feature

- added search depth in listing and updated it locales @giuliaghisini
- Add emailSend action @nzambello
- lazy load react-dropzone @nileshgulia1

### Bugfix

- Fix addons loader name generation on Windows @tiberiuichim
- For python3.9 compatibility, install wheel package in build-backend targets @tiberiuichim

### Internal

- Tweak Cypress command `waitForResourceToLoad` to timeout after 50 tries. @tiberiuichim

## 10.2.0 (2020-12-04)

### Feature

- Generate language file of added missing German translations by @tisto. @ksuess

### Bugfix

- Fix regression in the `getContent` action with the expandable missing @sneridagh

## 10.1.0 (2020-11-30)

### Feature

- Add missing German translations @tisto

## 10.0.0 (2020-11-30)

### Feature

- Provide operations on multiple-selected blocks: delete, cut/copy and paste. You can trigger the "multiselected blocks" by holding the shift key and clicking on another block. You can add/remove blocks to the selection with the Control key. Holding Control when you click on the Paste button doesn't clear the clipboard, so you can paste multiple times. The blocks clipboard uses the browser's local storage to synchronize between tabs. @tiberiuichim
- Allow reducers to be persisted using localstorage @tiberiuichim

### Breaking

- Removal of the Razzle patch that was introduced in 9.0.0 @sneridagh
  See https://docs.voltocms.com/upgrade-guide/ for more details.
- Fetched content with `getContent` no longer includes fullobjects by default @tiberiuichim

### Bugfix

- Fix link to login in the Unauthorised component @sneridagh

### Internal

- Add details on how to run Cypress integration tests @tiberiuichim
- Upgrade `@testing-library/react` to 11.2.2. Add `jest-environment-jsdom-sixteen as upgraded jsdom implementation @tiberiuichim
- Split some small prismjs related files (used in HTML block) in separate chunks @tiberiuichim
- Remove dangling analyzer plugin @sneridagh
- Support for Guillotina 6 @bloodbare @sneridagh
- Update Cypress to version 5.6.0 @sneridagh
- Terse `react-intl` errors in console during development turning them into warnings @sneridagh

## 9.2.0 (2020-11-24)

**This is a brown bag release and should not be used, upgrade to Volto 10.x.x instead.**
See https://docs.voltocms.com/upgrade-guide/ for more information.

### Feature

- Remove the Razzle patch for the local, "inline" Volto Razzle plugins @tiberiuichim @sneridagh

### Bugfix

- Move missplaced `appExtras` into settings @sneridagh

### Internal

- Make filewidget label more consistent @tisto

## 9.1.0 (2020-11-20)

### Feature

- Extend the internal proxy capabilities, now the target is overridable and SSL aware @sneridagh
- Added new environment variables for the internal proxy `RAZZLE_PROXY_REWRITE_TARGET` and `RAZZLE_PROXY_REWRITE_TARGET` @sneridagh
- Enhance `AppExtras` component to make it pluggable through the
  `config.settings.appExtras`. These are router-path filtered components that
  are rendered inside the `AppExtras` component @tiberiuichim

### Bugfix

- Fix Sentry tags and extra via settings.sentryOptions @avoinea
- Fix `yarn analyze` command by packing our own version of
  webpack-bundle-analyzer integration. It has a few changes to the old default
  configuration. There is an alternative way of triggering the bundle analyzer,
  with the `OFFLINE_BUNDLE_ANALYZE=true` env variable, which avoids starting
  the HTTP bundle analyzer server. Also, it always saves a report html file.
  @tiberiuichim

### Internal

- Improve developer documentation. Add several new chapters @tiberiuichim

## 9.0.0 (2020-11-15)

### Breaking

- Upgrade Razzle to 3.3.7 @tiberiuichim @sneridagh

  Razzle 3.3.7 prepares the transition to the upcoming Razzle 4 so it improves and
  unifies the extensibility story at the cost of change the signature of the
  `razzle.config.js` and how plugins are declared. It also enables by default the new
  _React Fast Refresh_ feature implemented by the React community, which improves the
  refresh of the code while in development.

- Babel plugins housekeeping

  Deprecated proposals:

  - @babel/plugin-proposal-function-bind
  - @babel/plugin-proposal-do-expressions
  - @babel/plugin-proposal-logical-assignment-operators
  - @babel/plugin-proposal-pipeline-operator
  - @babel/plugin-proposal-function-sent

For a complete list of actions to follow, please read the upgrade guide
https://docs.voltocms.com/upgrade-guide/

### Feature

- Add `webpack-relative-resolver` plugin. For addons and Volto, it normalizes local relative imports to package-rooted imports. An import such as `import Something from './Something'` would be rerouted internally as `import Something from '@collective/someaddon/Something'`. By doing so we get easier customization of addons, as they don't have to be so strict with their import and exports @tiberiuichim
- Posibility to configure Sentry via `settings.sentryOptions` configuration key @avoinea
- Catch `console.error` by default with Sentry @avoinea
- Refactor CT icons helper: add getContentIcons @nzambello

### Bugfix

- Properly return 404, 401 and 403 on SSR, when appropriate @tiberiuichim
- Fix Guillotina PATCH by adding the `@static_behaviors` field inconditionally @sneridagh

### Internal

## 8.10.1 (2020-11-13)

### Bugfix

- Fix leaking input CSS in the link widget in draftjs @sneridagh

### Internal

- Move Guillotina CI job to GH actions @sneridagh

## 8.10.0 (2020-11-12)

### Feature

- Adding show all button in UsersControlpanel @iFlameing
- Now you can prettify the html code in HTML block @iFlameing
- Adding preview image placeholder in Video Block @iFlameing

### Bugfix

- Fix error object in clipboard reducer @iFlameing
- Making QuerystringWidget more resilient by handeling null value @iFlameing
- Fixing bug related to initiation of table block with previous table block data @iFlameing
- enabled no-folderish CT to be translated @giuliaghisini

### Internal

- Changing checkbox widget of exclude-nav to select widget @iFlameing

## 8.9.2 (2020-11-06)

### Bugfix

- Revert type-in detection in draftjs link widget, as that leads to a regression @sneridagh
- Fix and refactoring FileWidget @iFlameing

## 8.9.1 (2020-11-06)

### Bugfix

- Fix SSR rendering in table blocks @sneridagh

## 8.9.0 (2020-11-05)

### Feature

- Added Dropzone in FileWidget @iFlameing
- Making inline link toolbar, location aware in content browser @iFlameing.
- Detect if the link typed or pasted in the link widget of the text block is internal @sneridagh

## 8.8.1 (2020-11-04)

### Bugfix

- Improve misleading translations deleted message @sneridagh
- Fixing overlap of labels with each other in select widget @iFlameing
- Throw error in crashReporter; also log sentry errors in server @tiberiuichim

### Internal

- Split razzle svg and sentry loaders to separate files @tiberiuichim
- prevent form without blocks. Form always have at least the default block. @giuliaghisini
- Fix default target for links in text blocks @giuliaghisini

### Internal

## 8.8.0 (2020-11-02)

### Feature

- Add support for the new active LTS NodeJS version 14. NodeJS 10 eol will happen on 2021-04-30 and Volto will update accordingly. More information on https://nodejs.org/en/about/releases @sneridagh

## 8.7.1 (2020-10-29)

### Bugfix

- Added loading icon when doing actions in folder-contents @giuliaghisini
- Fix German translation "from" -> "E-Mail" in contact form @tisto

## 8.7.0 (2020-10-27)

### Feature

- Manage translations view @sneridagh

### Internal

- Update docs build and include pygments support for jsx @sneridagh

## 8.6.0 (2020-10-25)

### Feature

- Added placeholder background color same as selected one @iFlameing
- Showing notification when user sort the folder-content @iFlameing
- Render full language name (e.g. "English") instead of 2 character language code in language selector, matching Plone default behavior. @mikejmets

### Bugfix

- A pathname like /policy/edit does not show the Unauthorized or Forbidden component when not logged in, ref #1936. @silviubogan
- Fixes secondary views in toolbar @iFlameing @sneridagh
- Fixing overlay expansion during link assign from objectbrowser in edit mode @iFlameing

### Internal

- Added new in productions sites to README @wkbkhard
- Writing test for the lisiting block location relative criteria @iFlameing
- Add `UniversalLink` to handle internal/external/download links @nzambello

## 8.5.4 (2020-10-23)

### Breaking

### Feature

### Bugfix

- Fixing bug for link when inseting break lines in list tag for view mode @iFlameing

## 8.5.3 (2020-10-22)

### Bugfix

- Removed timezone initialization for DatetimeWidget, ref #1923. @razvanMiu

## 8.5.2 (2020-10-21)

### Bugfix

- Showing error notification when user try to paste disallowed content type. @iFlameing

### Internal

- Added environment parameter `RAZZLE_BIND_ADDRESS` to be able to bind server to localhost or other specific IPs instead of 0.0.0.0 @achimwilde

## 8.5.1 (2020-10-21)

### Bugfix

- Fix sharing for when users has dots on them @sneridagh

## 8.5.0 (2020-10-20)

### Bugfix

- Japanese translation updated @terapyon

## 8.5.0-alpha.2 (2020-10-20)

### Bugfix

- Update German translation @ksuess

### Internal

- Fix runtimeConfig relative vs absolute import @avoinea

## 8.5.1-alpha.0 (2020-10-19)

### Feature

- Adding softlinebreak in list tag @iFlameing

### Bugfix

- Errors catched by the default error handler are sent to sentry @zotya
- Fixed a problem what occured when RAZZLE*SENTRY_DSN was missing but the other RAZZLE_SENTRY*\* variables were set @zotya

### Internal

- Fix sentry docs markdown format @avoinea

## 8.5.0-alpha.0 (2020-10-14)

### Feature

- Sentry integration @zotya
- All the environment variables defined at runtime that have the `RAZZLE_` prefix, are now available in the browser under window.env @zotya

## 8.4.0 (2020-10-14)

### Feature

- Add `Style`, a wrapper component that applies float and width classes to wrapped content (typically blocks) @tiberiuichim
- Add `AlignWidget`, a widget that wraps the `AlignBlock` helper @tiberiuichim

### Bugfix

- Folder contents view: Save additional columns and updated order of columns @ksuess
- Fixed edit link in draft-js when link is selected from word-end to word-start @giuliaghisini
- Revert PR No. 1820 to fix linebreaks on inline links in draftJS @steffenri

### Internal

- Keep `@babel/core` in Volto core in sync with `babel-preset-razzle` it fixes #1897 @sneridagh

## 8.3.0 (2020-10-12)

### Feature

- Adding droppable placeholder for Image Block @iFlameing

### Bugfix

- Test if content exists in ListingBody, for addon Dropdownmenu @giuliaghisini

## 8.2.6 (2020-10-12)

### Bugfix

- Fix break-line in view mode @iFlameing

## 8.2.5 (2020-10-08)

### Bugfix

- Fixing the bleed out of the modal for long filename @iFlameing

## 8.2.4 (2020-10-08)

### Bugfix

- Fixing table block edit @iFlameing

## 8.2.3 (2020-10-07)

### Bugfix

- Use Plone `I18N_LANGUAGE` cookie instead of `language` @cekk

## 8.2.2 (2020-10-06)

### Bugfix

- Upgrade react-dropzone from 5.1.0 to 11.1.0 @nileshgulia1
- Update German translations @tisto

## 8.2.1 (2020-10-06)

### Bugfix

- Querystingsearch action now uses correct relative path, if specified. Fixes #1861 @jackahl
- Fixing ObjectBrowser search input reload @iFlameing
- Fix broken current folder by default in content browser for image links, solves #1860 @sneridagh

## 8.2.0 (2020-09-27)

### Feature

- Add Basque translation @erral

### Bugfix

- Added prop resettable to DatetimeWidget @damiDevRT
- Removed the ability to reset the datepicker in the recurrence widget to prevent the uncontrolled creation of recurrences @damiDevRT
- Fix regression in setting selected sidebar tab by blocks @tiberiuichim

## 8.1.1 (2020-09-27)

### Bugfix

- Japanese translation updated @terapyon

## 8.1.0 (2020-09-22)

### Breaking

### Feature

- Create link in Draftjs using Objectbrowser @giuliaghisini

### Bugfix

- Allow select widget to reset when the incoming props change. The react-select widget has its own internal state, so if you initialise the widget without choices, then populate the choices, it wouldn't properly show the default value @tiberiuichim

### Internal

- Fix console warning in ToHTML @iFlameing

## 8.0.1 (2020-09-22)

### Bugfix

- Fix word overflow from html-block @iFlameing
- Fix Cypress test for image upload @zotya

### Internal

- Improve developer experience, don't logout on hot-reload @tiberiuichim
- Cleanup eslint in razzle.config.js @tiberiuichim

## 8.0.0 (2020-09-18)

### Breaking

- Change dummy-addons-loader.js fixture name to `jest-addons-loader.js`, to match existing `jest-svgsystem-transform.js` @tiberiuichim

### Feature

- Added Schema Editor within Dexterity Content-Types Controlpanel @rexalex @avoinea #1517
- Added Blocks Layout Editor within Dexterity Content-Types Controlpanel @avoinea #1517
- Added missing components for Email and Url widgets #1246 @rexalex
- Use content title instead of image id in alt tag @nileshgulia1

### Bugfix

- Fix the broken profile view in Toolbar @iFlameing

### Internal

- Hide block chooser button using React logic instead of CSS. This makes it easier to support nested blocks @tiberiuichim

- Wrap addon configuration loaders in a wrapper to check that they return back config @tiberiuichim

## 7.15.0 (2020-09-15)

### Feature

- Added missing components for Email and Url widgets #1246 @rexalex
- Show backend validation errors on corresponding fields #1246 @rexalex
- Validation implemented for add user/group @rexalex
- Show Username when Firstname attr is missing in UsersControlPanelUser @iFlameing

### Bugfix

- When dealing with authentication token expiration set to 0, auto-refresh token in one hour instead of logging out use @tiberiuichim
- Fixed front-end field validation #1246 @rexalex
- Fixed date only widget rendering #1246 @rexalex
- Fix errors with SelectWidget when removing the only element @rexalex

## 7.14.2 (2020-09-10)

### Bugfix

- Hyphenate sidebar labels @ksuess
- Update German translations @tisto

## 7.14.1 (2020-09-09)

### Bugfix

- Fix customization mechanism where customization paths end with `/` @tiberiuichim

## 7.14.0 (2020-09-08)

### Feature

- Render form with vertical tabs, setting the property `verticalFormTabs` in config.js @giuliaghisini

### Bugfix

- Imported locales by razzle and fixed import locale @giuliaghisini
- Fix console warning due to uncontrolled selectWidget component @nileshgulia1

## 7.13.0 (2020-09-07)

### Feature

- Add NumberWidget, an input widget for numbers @tiberiuichim

### Bugfix

- Fixing the Image size settings in sidebar when Image alignment changes @iFlameing

## 7.12.1 (2020-09-04)

### Bugfix

- Fix checkbox widget styles @nzambello

## 7.12.0 (2020-09-04)

### Feature

- Allow Volto projects to customize (via webpack resolve aliases) addons. Allow addons to customize Volto and other addons. Allow Volto projects to customize Volto in a `src/customizations/volto` folder, for better organization of the customizations folder. @tiberiuichim @sneridagh

## 7.11.3 (2020-08-28)

### Bugfix

- On image upload in a block, don't overwrite the global `state.content.data` with new image data @tiberiuichim @silviubogan

### Internal

- Add a `subrequest` option to the `createContent` action @tiberiuichim @silviubogan

## 7.11.2 (2020-08-28)

### Bugfix

- Fix bug introduced in 7.9.0, properly return a list of results when dealing with batched api requests @tiberiuichim
- In folder contents batch upload, use a subrequest to avoid breaking the global `content.data` state @tiberiuichim
- Fix `null` response issue when passing custom `Accept:` headers to actions #1771 @avoinea
- Removed all `<<<<<HEAD` artifacts from translations @steffenri
- Increase z-index of `block-add-button` @steffenri

## 7.11.1 (2020-08-27)

### Breaking

### Feature

### Bugfix

- Update German translations @tisto

### Internal

## 7.11.0 (2020-08-27)

### Feature

- Add sort option to search @iFlameing

### Bugfix

- Turn autocomplete off for the search input field @timo

## 7.10.0 (2020-08-26)

### Feature

- Added toast notifications for form errors @nzambello @avoinea
- Added italian translations and translated array, token and select widget. @giuliaghisini

## 7.9.2 (2020-08-26)

### Bugfix

- Open content browser sidebar on parent object when editing an existing document. @iFlameing

### Internal

- Added developer-guidelines/redux documentation @tiberiuichim

## 7.9.1 (2020-08-25)

### Bugfix

- Fix bug related to closing the More menu of Toolbar @iFlameing

- Fix cosmetic issue, add links were not properly generated in Contents view not under the root. This didn't impact functionality as the content was properly created @tiberiuichim

- Fix bug for text block with new line and styles applyed to all text. @giuliaghisini

### Internal

- Removed unused component `src/components/manage/Contents/ContentsToolbar.jsx` @tiberiuichim
- Add no-console eslint rule @tisto

## 7.9.0 (2020-08-24)

### Breaking

### Feature

- Adding support of pasting link of voltoCMS video link to video blocks @iFlameing
- Allow serial processing of API requests when `mode:'serial'` is passed in the action. @tiberiuichim
- Adding cypress test from image-gallery in edit mode @iFlameing

### Bugfix

- On mutating a block, don't create extra placeholder block if such block already exists @tiberiuichim
- Fixing broken file-preview placeholder for other file type than image @iFlameing

### Internal

- When passed an array of items (for example in batch upload content), the `createContent` action now serializes those requests @tiberiuichim

## 7.8.3 (2020-08-21)

### Bugfix

- Change ImageGallery image scale from preview to large. @tisto
- Also use `settings.internalApiPath` in url helpers `isInternalURL`, `flattenToAppUrl` and `flattenHTMLToAppURL` @tiberiuichim
- Fix getBlocks helper when blocks_layout has no `items` (default PloneSite with no volto homepage) @avoinea

### Internal

- Docs: Review of "How to use and addon" @ksuess
- Addon: Hint for addon developers if function applying config is missing @ksuess

## 7.8.2 (2020-08-18)

### Bugfix

- Include cypress folder in release @timo

## 7.8.1 (2020-08-18)

### Bugfix

- Remove supposed fix to form.jsx again, as it apparently did not really fix anything but only broke stuff @jackahl

## 7.8.0 (2020-08-18)

### Breaking

### Feature

- Add cms-only theme that allows to completely remove semantic-ui from public facing views @pnicolli @nzambello

### Internal

## 7.7.2 (2020-08-18)

### Bugfix

- Fix bug showing wrong data in the edit view, that occured in some cases, when one would enter the edit view of a page from another page @jackahl

### Internal

- Remove "\$" from all examples in install docs and README @timo

## 7.7.1 (2020-08-12)

### Bugfix

- Japanese translation updated @terapyon
- Bugfix Edit page through Contents list #1594 @terapyon @csenger

### Internal

- Bump serialize-javascript from 2.1.1 to 3.1.0 @timo
- Bump prismjs from 1.17.1 to 1.21.0 @timo
- Make Table Block Cypress test more reliable @timo
- Make listing template Cypress test more reliable @timo

## 7.7.0 (2020-08-04)

### Feature

- Allow addons to provide less files @tiberiuichim
- Making Content browser aware of context @iFlameing

### Bugfix

- Fix click-select block on unknown block type @nileshgulia1
- Fix Image Gallery Template in Listing Block crashing when no criteria are set (#1722) @jackahl

## 7.6.0 (2020-07-31)

### Feature

- Added recurrence widget @giuliaghisini

## 7.5.1 (2020-07-29)

### Bugfix

- Avoid React hydration complaining about mismatched server output in toolbar. In component rendering, replaced the use of `__CLIENT__` with a state-stored `isClient`, as that is more correct. @tiberiuichim

## 7.5.0 (2020-07-29)

### Feature

- Used moment-timezone to set a specific server timezone as default for DatetimeWidget. @razvanMiu

## 7.4.0 (2020-07-29)

### Feature

- Highlight the sidebar toggle button with a small flashing animation @silviubogan @tiberiuichim

## 7.3.1 (2020-07-28)

### Bugfix

- Solved a browser console error in /contents view (#1695) @silviubogan
- Pagination icon fix @nileshgulia1

## 7.3.0 (2020-07-26)

### Feature

- Add Placeholder attribute to Textwidget and TextAreaWidget @iFlameing
- Make the default block type (currently draftjs text) configurable @tiberiuichim @silviubogan

### Internal

- Upgrade lodash dependency to 4.17.19 @tisto
- Add a new blocks helper method, `getBlocks`. It simplifies using `getBlocksFieldname` and `getBlocksLayoutFieldname` under a single method that returns ordered pairs of `[blockid, blockvalue]` @tiberiuichim

## 7.2.1 (2020-07-16)

### Internal

- Upgrade to Cypress 4.10.0 @tisto
- Upgrade to cypress-file-upload 4.0.7 @iFlameing

## 7.2.0 (2020-07-13)

### Feature

- Provide a new webpack alias, `volto-themes`, which points to Volto's theme folder. See details in the https://docs.voltocms.com/upgrade-guide/

### Internal

- Upgrade razzle to `^3.1.5`. @tiberiuichim

## 7.1.0 (2020-07-09)

### Feature

- Addons can optionally include a `razzle.extend.js` file in their root. This module needs to follow the same rules as the `razzle.config.js`. They change the default Volto Razzle configuration, before it is passed to the Volto project @tiberiuichim @sneridagh

### Bugfix

- Managed hidden fields @giuliaghisini
- Fix bug in addon loading with namespaced packages @tiberiuichim
- Japanese translation updated @terapyon

- Upgrade razzle to `^3.1.5`. @tiberiuichim

## 7.0.1 (2020-07-07)

### Bugfix

- Adding absolute url in ObjectBrowser for image type @iFlameing

## 7.0.0 (2020-07-06)

### Breaking

- Fix filename of strickthrough.svg to strikethrough.svg @tiberiuichim

### Feature

- Addons configuration loading. You can now declare addons in the addons key of
  package.json and they'll be automatically loaded. @tiberiuichim @sneridagh

## 6.5.0 (2020-07-03)

### Feature

- Added default Export for the QuerystringWidget for the ListingBlock @steffenri

### Bugfix

- Fix text overflow in pastanaga-menu header if title is too long. @giuliaghisini
- Fixing bug to correctly assign classes to image sizes in View @steffenri
- Center aligned Images are now displayed like they are center aligned in the View @steffenri
- Fix datepicker z-index @giuliaghisini

### Internal

- Upgrade insecure packages `http-proxy`, `http-proxy-middleware` and `handlebars` @tiberiuichim

## 6.4.1 (2020-07-01)

### Breaking

### Feature

- Allow JSON API calls to made to third-party servers @tiberiuichim

### Bugfix

- Fix styling and use of csss classes in `InlineForm.jsx` @tiberiuichim

- Fixing bug for Image Preview on upload @iFlameing

### Internal

- Fix formatting of `src/server.jsx` @tiberiuichim

## 6.4.0 (2020-06-29)

### Feature

- Translated workflow state in contents @nzambello
- Added item type as a tooltip in contents @nzambello
- Added Italian translations and translated array, token and select widget. @giuliaghisini
- Added uploading image preview in FileWidget @iFlameing
- Allow custom express middleware declared with `settings.expressMiddleware`. See [Customizing Express](docs/source/customizing/express.md) @tiberiuichim

### Bugfix

- Fix the toolbar dropdown to add content types if isMultilingual is enabled
  but a type is not marked as translatable. @csenger
- Usage of Contettype label in Add component. @giuliaghisini

### Internal

- Update upgrade-guide to for `addonRoutes` and `addonReducers` @jackahl

## 6.3.0 (2020-06-22)

### Feature

- Added internationalization for French language @bsuttor #1588
- use of maximumSelectionSize from plone in ObjectBrowserWidget. @giuliaghisini
- Added selectableTypes in ObjectBrowserWidget @giuliaghisini

### Bugfix

- Added export for ObjectBrowserWidget in component/index.js @giuliaghisini
- Fixed duplicated items in SelectWidget and ArrayWidget @giuliaghisini
- Update German translation @timo
- Removed broken preview image in ContentsUploadModal if uploaded item is not an image. @giuliaghisini
- Localized content upload modal last modified date @nzambello
- Fix overflow in folder contents with long titles @nzambello
- Fixed object browser widget when a selected items is deleted. Plone.restapi returns a null object. @giuliaghisini
- Fixed error on adding new item if parent item is not translated when multilingual is set @giuliaghisini
- Added translations for select in querystring widget @nzambello

## 6.2.0 (2020-06-14)

### Feature

- Added database information component in ControlPanels @iFlameing

### Internal

- Add yarn-deduplicate. @timo

## 6.1.0 (2020-06-12)

### Feature

- Include `config.addonRoutes` in router configuration. This allows addons to
  override route children defined for the `App` component.
- Added param 'wrapped' for widgets, to use widgets without form wrappers. @giuliaghisini
- Added internationalization for Romanian language @alecghica #1521
- Support loading additional reducers from the `config.addonReducers` key,
  to allow addons to provide their own reducers @tiberiuichim
- Add a no brainer image sizing option, using scales. This will be vastly improved when
  we adopt srcsets. @sneridagh

### Bugfix

- Removed a regex check in default view, we already have that check implemented in `toHTML.jsx` L173s @nileshgulia1
- UX and UI improvements to `DateTimeWidget` @sneridagh
- Fix an UTC handling for edge cases in `DateTimeWidget` @sneridagh
- Do not store the server information of the image block in the block @sneridagh
- expose `blocks` and `blocks_layout` only editing content types @nileshgulia1
- Small fix for `TextAreaWidget` and max_lenght @sneridagh

## 6.0.0 (2020-05-18)

### Breaking

- Removed support for CSS modules, since Razzle 3.1.x do not support them @sneridagh
- Updated Volto dependencies - See https://docs.voltocms.com/upgrade-guide/ for more information @sneridagh
- By adding `react-beautiful-dnd` in the block editor we are introducing new wrappers
  (belonging to the lib machinery) in the structure. The original structure and class
  names are still in there for maintain maximum backwards compatibility. Those might be
  cleaned up in next major versions, so if for some reason you have customized the
  styling of your blocks in edit mode relying in the old structure, you might want to
  review and adapt them @sneridagh

### Feature

- Added `react-beautiful-dnd` in core for edit form @iFlameing

### Bugfix

- Improve `isInternalURL` helper to match also anchors @sneridagh
- Fix local build when no RAZZLE_API_PATH is set @sneridagh
- Fix `WysiwygWidget` redraft HTML conversion when creating an empty paragraph force a `<br />` on it @sneridagh

### Internal

- Update to Razzle 3.1.2 @sneridagh
- Update to React 16.13.1 @sneridagh
- Removal of unused (and deprecated) `@babel/preset-stage-0` @sneridagh
- Update `react-router` @sneridagh
- Update `react-redux` and friends @sneridagh
- Update `connected-react-router` @sneridagh
- Update low hanging fruits deps @sneridagh
- Update style/less loaders and friends @sneridagh
- Update stylelint and friends @sneridagh
- Update prettier @sneridagh
- Update eslint plugins @sneridagh
- Update `cypress-axe`, `detectbrowser`, `lint-staged` and `release-it` @sneridagh

## 5.10.0 (2020-05-16)

### Feature

- Refactor createContent command to accept a single json object @iFlameing
- enable hyperlinks in comments when intelligent text is enabled for comments @jackahl
- Added InlineForm, a generic form implementation that can be used to edit, among others, block data. @tiberiuichim

### Internal

- Make available some internal artifacts (Router, Redux Store and Settings) to the Cypress acceptance tests, add docs @sneridagh
- Added a cypress test for the comment @iFlameing
- Add a cypress function to set registry entries @jackahl

## 5.9.1 (2020-05-15)

### Bugfix

- Fix Bug in Form Component, that lead to site crash when transmitting a comment @jackahl #1475
- Fix for the long lasted issue when creating links in newly created text blocks not showing as links until you save @avoinea

### Internal

- add a cypress function to set registry entries @jackahl

## 5.9.0 (2020-05-12)

### Feature

- Implemented a new ObjectBrowserWidget @giuliaghisini
- Add system information in controlpanel @iFlameing #1457
- Added Dexterity Types Controlpanel @avoinea #1285
- Remember sort order of folder contents view. @ksuess

### Bugfix

- Fix new lines inside blockquotes are not rendered @iFlameing #1249
- Fix blockquote style render error: unique key @iFlameing #1097
- Added Dexterity control panel Cypress tests @iFlameing

## 5.8.0 (2020-05-11)

### Feature

- Adding Image Gallery template in Listing view @iFlameing

## 5.7.1 (2020-05-08)

### Bugfix

- Fix translation locator lookup in `CreateTranslation` component and remove the no longer needed store reducer @sneridagh

## 5.7.0 (2020-05-08)

### Feature

- Enable `@querystringresults` action to use the new context aware query feature @sneridagh

## 5.6.1 (2020-05-08)

### Bugfix

- REALLY load the current object language on SSR, instead of relying on the cookie @sneridagh

### Internal

- Pin some api devs (ZCatalog and p.namedfile improvements) @sneridagh

## 5.6.0 (2020-05-06)

### Feature

- Load the current object language on SSR, instead of relying on the cookie @sneridagh

### Bugfix

- Correct the `defaultLanguage` intend in `react-intl-redux` configuration @sneridagh

### Internal

- Add default `src` alias for addons detecting if there is a released or a mrs-developer one @sneridagh

## 5.5.0 (2020-05-06)

### Feature

- Added label expired if expiration date is smaller that current date #1413 @iFlameing
- Added word limit widget @iFlameing
- Addons control panel @esteele @iFlameing

### Internal

- Cypress test for Table Block @steffenri @iFlameing
- Cypress tests upgraded for Image, Hero and HTML Block @steffenri @iFlameing
- Added cypress test for sort method in folder content #1035 @iFlameing

## 5.4.0 (2020-05-04)

### Feature

- Add babel and externals support in Webpack for add-on infrastructure @sneridagh
- Forward the images and files cache headers in Volto SSR passthrough @sneridagh

### Bugfix

- Fix handling of external links in ToHTML config @nzambello
- Remove the title field from right dropdown in folder content view

### Internal

- Periodical upgrade of `browserlist` lib @sneridagh

## 5.3.0 (2020-04-29)

### Feature

- Add general @navigation endpoint depth setting @sneridagh

### Bugfix

- Fix `<html>` `lang` attribute @sneridagh

## 5.2.1 (2020-04-27)

### Internal

- Remove console log in workflow asyncConnect :( @sneridagh

## 5.2.0 (2020-04-27)

### Feature

- Improvement of API requests error handling @sneridagh
- Unauthorized on folder contents if no proper credentials @sneridagh

### Bugfix

- Improve German translations for folder contents view @timo
- Make label of checkboxwidget clickable @pbauer #1414
- Show new added user in user control panel @iFlameing #1271
- Support multi selection in roles and groups and polish add user #1372
- Listing block: removed message 'No results found' only in view mode on public site, in editMode is still present. @giuliaghisini

### Internal

- Add crossorigin to the preload resources tags while in development @sneridagh
- Permissions in contents and Edit @sneridagh
- Fix the error on content Edit no credentials now shows `Unauthorized` @sneridagh
- Improve console server output showing info @sneridagh

## 5.1.0 (2020-04-23)

### Breaking

### Feature

- Full screen right sidebar @rexalex #1345
- Enable internal API proxy for not to rely on CORS on development @sneridagh
- Added Print CSS @iFlameing #1289
- Added error handling for Add and Edit forms #1392 @nzambello

### Bugfix

- Japanese translation @terapyon
- Fix `ArrayWidget` to support multiselect schema `schema.List`/`schema.Set`-> `schema.Choice` hardcoded (not using vocabularies) combination @sneridagh
- Remove Back button from control panels, since it's redundant @sneridagh
- Show past dates in date time widget calendar @nzambello

### Internal

- Translated labels in Eventi View @nzambello
- Improve i18n script, so shadowed components are not overriding their original translations. For the record, any override of i18n messages, should be done somewhere else (eg. config object) @sneridagh

## 5.0.1 (2020-04-16)

### Bugfix

- Show new added user in user control panel @iFlameing #1271
- Fixes for contact form @nzambello

## 5.0.0 (2020-04-12)

### Breaking

- Added basic lazy loading dependencies and boilerplate @sneridagh
- Change component to where page title is set to `View.jsx`, remove all `Helmet` calls from inner views @jackahl

### Feature

- Added date time widget @nzambello
- Add meta description tags and meta generator @sneridagh
- Add lang property in `html` tag depending on the site/content language @sneridagh
- Add `App.jsx` component insertion point @sneridagh
- Lazy load `EventView.jsx`, splitting out all its big dependencies (Luxon) along with it @sneridagh
- Lazy load `pretty` library, used in the HTML block @sneridagh
- Lazy load `Raven` library @sneridagh
- Lazy load `React Select` library @sneridagh

### Bugfix

- Show save/cancel on control panels @avoinea #850
- Fix listing "show more" link rendering conditions @nzambello

### Internal

- Make Jest only looks up in `src` folder @sneridagh
- Re-arrange `components/index.js` @sneridagh
- Added a patch for Razzle Jest config generator to include `modulePathIgnorePatterns` option @sneridagh
- Fix Travis random no sound card found error @sneridagh
- docs: add release documentation @tisto

## 4.6.0 (2020-04-06)

### Feature

- pagination on site search results @giuliaghisini

### Bugfix

- Fix use case for non-multilingual setups and on projects on lang loading @sneridagh

### Internal

- Typo in German translations @steffenri
- Complete more Italian translations @nzambello

## 4.5.0 (2020-04-06)

### Feature

- /sitemap to view sitemap based on @navigation with depth 4 @giuliaghisini

### Bugfix

- Fix ArrayWidget to support static supermodel vocabulary @datakurre
- Bring back the OutdatedBrowser component, it got removed in a bad merge :( @sneridagh

### Internal

- Improve the i18n script, only write the pot file if it's really different @sneridagh

## 4.4.0 (2020-04-03)

### Feature

- /contents (folder content view) is sortable @ksuess
- Updated the (folder content icons to Pastanaga Icons) @iFlameing

### Bugfix

- Fix conversion from DraftJS to HTML using redraft for atomic entities (IMAGE) @sneridagh

## 4.3.0 (2020-04-01)

### Feature

- Added recursive workflow changes @robgietema

### Bugfix

- Fixed ssr link view @robgietema

## 4.2.0 (2020-03-31)

### Feature

- Add Multilingual Support @sneridagh

## 4.1.2 (2020-03-30)

### Bugfix

- Fix typo for Japanese translation @terapyon
- Fix refresh of the `Breadcrumbs` and `Navigation` components on calling `/login` and `/logout` @sneridagh
- Fix refresh of the `Navigation` component on calling `/login` and `/logout` @sneridagh
- Adjust implementation of the download link behavior for files @sneridagh
- Fix Maps block to use maps-inner instead of video-inner class @timo
- Add div with class "table-of-contents" to ToC block @timo

### Internal

- Upgrade critical Plone 5.2.1 deps in api folder @sneridagh
- Improve Cypress Video Block tests @sneridagh @timo
- Run `yarn i18n` on any JSX change @sneridagh
- Add link mailto Cypress test @timo
- Added design guidelines manifesto @sneridagh

## 4.1.1 (2020-03-18)

### Bugfix

- Fix for #1267 - Link inside text for content-type without blocks breaks the site @sneridagh
- Japanese translation @terapyon
- Fix production mode for newly created `__DEVELOPMENT__` global @sneridagh

### Internal

- Upgrade to Cypress 4 @timo

## 4.1.0 (2020-03-13)

### Feature

- Add `flattenHTMLToAppURL` helper method for remove api url from TinyMCE generated HTML @cekk
- Add development mode global @sneridagh

### Bugfix

- Improve the UX of the listing block when queries are running @sneridagh
- Added table of content cypress test @steffenri

## 4.0.1 (2020-03-09)

### Bugfix

- Fixes #1262 - SSR support for "undetected" browsers
- Japanese translation @terapyon
- Site settings styling fixed in the Controlpanel
- Increase ObjectBrowser limit per folder to 1000, partially fixes #1259 @sneridagh
- Deprecate `utils.less` as it's a leftover and it collides with some use cases depending on the viewport, see: #1265

### Internal

- Use kitconcept.volto as integration package @sneridagh

## 4.0.0 (2020-03-01)

### Feature

Summary of the most important features in this final release. For more detailed information
refer to all of them in https://github.com/plone/volto/releases

- Improved Pastanaga Editor
- New Pastanaga Editor sidebar
- New mobile first toolbar
- Developing blocks experience simplified
- New Object Browser
- Listing, TOC, Lead Image blocks
- Improved existing blocks (Image, Video, Maps)
- New blocks chooser and future proof blocks definitions
- Definition of default Blocks per content type
- Body classes like the Plone ones hinting content types, section and current view
- New message system
- React hooks support
- Several internal libraries updated, including Redux, Router ones that support hooks as well
- New locales (es, it, ja, pt, pt_BR)

### Bugfixes

- Tons of bug fixes

## 4.0.0-alpha.43 (2020-03-01)

### Changes

- Fixes #982 - History compare/diff @avoinea
- Responsive header @ksuess
  - Anontools (login, register) wrapping under long navigation.
  - Breaking change: Hamburger menu also on tablet.
  - Mobile: compact display of anontools and search.

## 4.0.0-alpha.42 (2020-02-26)

### Changes

- Revert "Fix Scrolling Functionality if there are many columns in table" since it has non desired secondary effects in the table block and other tables @sneridagh

## 4.0.0-alpha.41 (2020-02-26)

### Changes

- Fixes for the `ListingView` (Issue #1188, Listing View) @wkbkhard
- Fix date widgets on QueryString widget on listings and in the widget @sneridagh
- Update German translation @tisto
- i18n in toolbar and folder contents view @ksuess

## 4.0.0-alpha.40 (2020-02-24)

### Added

- Add pagination support to listing blocks @sneridagh

### Changes

- Fix Video and Maps blocks hydration quirks on view mode @sneridagh
- Deleted Empty Select Component @aryamanpuri
- Fix `RichText` Widget on normal forms @sneridagh
- Fix Guillotina tests @bloodbare
- Fix problem with not wrapped element in `Provider` store in `WysiwygWidget` component
  due that now, the links are wrapped with a connected component @sneridagh

## 4.0.0-alpha.39 (2020-02-18)

### Added

- Add permission check to edit form @sneridagh

### Changes

- Fix and improve Error in SSR @sneridagh
- Fix `LinkAnchorPlugin` press Enter key inside blocks with draftJS widgets @sneridagh

### Internal

- Replace all relative paths to `@plone/volto` absolute paths to ensure you can override all the resources via component shadowing @sneridagh

## 4.0.0-alpha.38 (2020-02-18)

### Internal

- Update to use ESLint 6 @timo

## 4.0.0-alpha.37 (2020-02-18)

### Added

- Chose template for listing block @giuliaghisini
- Event type view @nileshgulia1 @pnicolli
- Add ability to define the starting blocks per content type @sneridagh
- Reference widget: show item title and path in search and hover items selected @giuliaghisini

### Changes

- Fix the "jump" on the blocks editor on focusing blocks @sneridagh
- Include link and size info to the full size image in `ImageView` view component @sneridagh
- In the Display menu, only show views that are implemented @pnicolli
- Hide Blocks fields in Layout fieldset in Add/Edit forms @pnicolli
- Updated italian translations @nzambello
- Fallback for non existing layout views registered in `constants/Layouts` when selected in the widget @sneridagh
- Fix select widget for array inline choices fields and `z-index` problem @sneridagh
- Improve UX of the edit block Image component @sneridagh
- Fix on creating a new block, it should show the sidebar block properties (#1167) @sneridagh
- Send only the changed fields on PATCH (edit content) operations @sneridagh
- Japanese translation @terapyon

### Internal

- Added forest.eea.europa.eu as deployed Volto in production @tiberiuichim
- Add SemanticUI responsive variables to the responsive utils @sneridagh
- Added `yarnhook` to the build @sneridagh

## 4.0.0-alpha.36 (2020-02-03)

### Changes

- Fix unable to login from /logout page (#1147) @sneridagh
- Fix sitemap.xml by increasing the batch size @robgietema
- Browser detect feature, adding a deprecation message for ancient browsers in the `App` component @sneridagh
- Adding fallback in the edit form, in case the blocks related fields are empty, so we are sure that the edit form shows at least the default blocks @sneridagh
- Fix shift return in tables @robgietema

## 4.0.0-alpha.35 (2020-01-31)

### Changes

- Fix CSS when multiselection widgets have multiple items, then provoke a line jump @sneridagh
- added new italian translations, added italian to available languages, translated some static string
- updated italian translations
- Fix listing block sidebar focus @sneridagh
- Fix getBaseUrl helper method to not match inner occurrences of nonContentRoutes @sneridagh

## 4.0.0-alpha.34 (2020-01-26)

### Changes

- Fix token expiration/renewer timer, this fixes #674 @sneridagh

## 4.0.0-alpha.33 (2020-01-26)

### Changes

- Updated Maps block to the sidebar and image block look and feel @sneridagh
- Update video block to the sidebar and get the image block look and feel @sneridagh

### Internal

- Fix and update to latest husky and lint-staged @sneridagh
- Fix for i18n to use defaultMessages instead to default to the id @sneridagh
- Update `babel-plugin-react-intl` to latest @sneridagh

## 4.0.0-alpha.32 (2020-01-24)

### Added

- Lead image behavior block @sneridagh sponsored by CMSCOM.jp @terapyon

### Changes

- Make login component honors the returnUrl prop if called from any pathname @sneridagh

### Internal

- Try to improve the realibility of the Cypress tests, reorganize commands @sneridagh
- Upgrade to Plone 5.2.1, add `Products.PloneHotfix20200121` @sneridagh
- Force global use of `browserslist` package to get rid of message on build @sneridagh

## 4.0.0-alpha.31 (2020-01-22)

### Changes

- fix `SelectWidget`, when there is a vocabulary and no choices @sneridagh

## 4.0.0-alpha.30 (2020-01-22)

### Added

- Added listing block @pnicolli @rodfersou @sneridagh @giuliaghisini

### Changes

- fix bug in TokenWidget and ArrayWidget when removing all elements. @giuliaghisini
- fix listing block customization @giuliaghisini
- fix Querystring widgets failing to render if the `MultipleSelectionWidget` field applied is not included in the site vocabulary returned by `@querystring`. This applies to `Subject` field when the tag value is not there any more. @sneridagh
- fix QueryString widget on creation when query is empty, fixed broken when editing after too @sneridagh

## 4.0.0-alpha.29 (2020-01-18)

### Changes

- Remove dangling reference to external data in Image block not used anymore, causing confusion and lead to dead (and wrong) code @sneridagh
- Remove last remains of the append secondary actions, remove Image block toolbar. Update i18n, fix small issues in Image block @sneridagh

## 4.0.0-alpha.28 (2020-01-17)

### Changes

- Fix ToC anchor links in Firefox @robgietema

## 4.0.0-alpha.27 (2020-01-17)

### Changes

- Fix removing links in blocks @robgietema

## 4.0.0-alpha.26 (2020-01-15)

### Added

- German translation updated @timo

## 4.0.0-alpha.25 (2020-01-14)

### Added

- German translation for TOC @timo

## 4.0.0-alpha.24 (2020-01-14)

### Added

- Added customStyleMap param to Editor of draftjs @giuliaghisini
- Added Table of Contents block @robgietema

## 4.0.0-alpha.23 (2020-01-14)

### Added

- Support for indexable blocks (requires plone.restapi 6.1.0) @timo
- Set alt tag of image when selecting image in image block @robgietema

### Changes

- Avoid console warnings in AddLinkForm.jsx @tiberiuichim
- More cleaning the body classname from the current displayname view @sneridagh
- Make it possible to paste links, lists, b and i Elements into text-blocks
  @jackahl
- added option to include mp4 files from a remote source in video Block @steffenri @jackahl
- Make it possible to paste links, lists, b and i Elements into text-blocks @jackahl

## 4.0.0-alpha.22 (2020-01-04)

### Changes

- Disable all styling when copying text from another source (e.g. MS Word) into a text block @jackahl
- Avoid console warnings in QuerystringWidget @tiberiuichim
- Fix body classname based on the current content type @sneridagh

## 4.0.0-alpha.21 (2020-01-02)

### Changes

- Fix failing test on Footer due to year change in Copyright notice @sneridagh

## 4.0.0-alpha.20 (2020-01-02)

### Added

- Added translations to Portuguese @emansije

### Changes

- Fix wysiwyg widget help tag, for styling consistency @tiberiuichim
- Added more i18n improvements @macagua
- Disable submit button on save, to avoid multiple content creation @tiberiuichim
- Fix focus on sidebar @robgietema

### Internal

- Upgrade version pin for lxml, for compatibility with Python3.8
- Bump handlebars from 4.1.2 to 4.3.0 @timo

## 4.0.0-alpha.19 (2019-12-20)

### Added

- Implementation of `Portuguese (BR)` translation @LeuAlmeida
- Added translations to spanish @macagua
- Added AlbumView @wkbktill @alexbueckig

### Changes

- empty text blocks are shown as `<br />` in the view.
- Fix double fetch due to asyncConnect being executed in browser too @robgietema @sneridagh

## 4.0.0-alpha.18 (2019-12-12)

### Added

- Added CTRL+ENTER feature in text blocks by default. It creates a newline inside the same text chunk (`<p>`) @sneridagh
- Automatically switch sidebar on block change @robgietema
- Japanese translation @terapyon

### Changes

- Remove "documentDescription" class in table block @sverbois
- Added possibility to work with vimeo-videos instead of youtube-videos in the video block @wkbkhard
- Fixed Issue 1021: typing in a "wrong" URL leads to error @wkbkhard
- General toolbar more and personal tools menu CSS fixes @sneridagh
- Fix bug that lead to crashing the view when deleting the last row of a table
- Fix Select widget bug if the field has already the options in the `choices` schema, do not trigger the vocabulary request @sneridagh

### Internal

- Updated to react-select v3 @robdayz
- Fix file and link redirect views @robgietema
- Restrict moment.js locales to available languages @tisto @robgietema
- Fix history view @robgietema

## 4.0.0-alpha.17 (2019-12-03)

### Internal

- Revert eslint upgrade, because of problems with the react-app preset typescript settings @sneridagh

## 4.0.0-alpha.16 (2019-12-02)

### Changes

- Fix small CSS issues in Blocks @sneridagh

### Internal

- Pin Guillotina docker image @sneridagh
- Forked `react-helmet` since it seems unmaintained. Now it's a Named import in helpers. @sneridagh
- Update internal dependencies, fix "unmet peer dependencies" console logs by adding the peer dependencies to the local dependencies @sneridagh
- Update some dependencies, including: react-router, eslint engine and plugins/config and others @sneridagh
- Lodash improvements for decrease bundle size @sneridagh

## 4.0.0-alpha.15 (2019-11-27)

### Internal

- Export the resetContent action @pnicolli
- Fix toolbar collapsed color @sneridagh
- Minor CSS fixes @sneridagh
- Remove @testing-library/cypress dep, as it breaks builds if the internal cypress release is different than the one in this package @sneridagh

## 4.0.0-alpha.14 (2019-11-24)

### Internal

- Proper config for stylelint-prettier integration, add husky integration and scripts for stylelint, review stylelint rules @sneridagh

## 4.0.0-alpha.13 (2019-11-23)

### Internal

- Upgrade autoprefixer, remove deprecated `browsers` option, move to `browserlist` in `package.json` @sneridagh
- Upgrade react and react-dom to 16.12.0 @pnicolli
- Upgrade Cypress to 3.6.1 @timo

## 4.0.0-alpha.12 (2019-11-13)

### Changes

- Add loading animation for save and edit buttons in toolbar @pgrunewald
- Move Body class depending on content type to `App` component in order to make it available everywhere @sneridagh
- Add root class name to `Tags` component @sneridagh

## 4.0.0-alpha.11 (2019-11-08)

### Added

- Improved `ObjectBrowser` API to allow arbitrary field names and a custom `onSelectItem` @sneridagh

### Changes

- Fix icon in `TextWidget` @sneridagh
- Improve documentation for `Icon` @jackahl
- Fix ability to develop Volto itself (as and addon with a mrs.developer checkout) inside a Volto project @sneridagh

### Internal

- Add internationalization section to docs @pgrunewald

### Internal

- Set Cypress viewport width to 1280px @timo

## 4.0.0-alpha.10 (2019-10-31)

### Added

- Add Node 12 support @timo

### Changes

- Removed wrapper `p` tag from image block in edit mode for better layout purposes @sneridagh
- Make SelectWidget more robust @robgietema
- Add image to listing view @robgietema
- Fix `SchemaWidget` @robgietema
- Move styles import to a separate file @pnicolli
- Fix crash when user enters only whitespace in required fields @JeffersonBledsoe
- Fix the _real_ focus thief in new tiles @sneridagh

### Internal

- Report port number on startup @fredvd
- Retry Cypress tests two times before failing @timo
- Add waitForResourceToLoad to Cypress @timo
- Add use cases to README @timo
- Re-enabled Guillotina tests @sneridagh
- Remove Docker build from tests @sneridagh
- Removed Enzyme @pnicolli
- Added testing-library (react and cypress) @pnicolli
- Tiles -> Blocks renaming @sneridagh

## 4.0.0-alpha.9 (2019-10-09)

### Changes

- Rename `blockID` to `id` for view block components, to unify naming in edit-view @sneridagh
- Change the order of the widget decider algorithm to `choices` is chosen before the vocabularies one @sneridagh
- Remove old messages container since it's not used anymore @sneridagh
- Improve the Pastanaga Editor block wrapper container layout, deprecating the hack `.ui.wrapper > *` @sneridagh
- Fix `ArrayWidget` and amend users control panel arrays instantiations @sneridagh

## 4.0.0-alpha.8 (2019-10-05)

### Added

- Upgrade react-intl to latest version @sneridagh

### Changes

- Fix `DefaultView.jsx` warning on missing key @sneridagh

### Internal

- Enable run yarn install on git checkout and git pull in husky @sneridagh
- Disable Cypress blocks tests @sneridagh
- Remove dockerized unit tests @timo
- Add Cypress link test for text blocks @timo

## 4.0.0-alpha.7 (2019-10-02)

### Added

- Add CSS class names to block chooser @timo
- Add Cypress tests for blocks @timo @rodrigo @jakahl

### Changes

- Fix page jump on edit route @sneridagh
- Fixes to users and groups controlpanel i18n strings @nileshgulia1

### Internal

- Change the general naming of the documentation to `developer` documentation @sneridagh
- Add `blockID` prop to block tiles render view, this is handy for some blocks use cases @sneridagh
- Fix flaky Cypress test @sneridagh

## 4.0.0-alpha.6 (2019-09-30)

### Added

- Transfer focus management and keyboard navigation to the tiles engine @sneridagh

### Changes

- Slight amendment to Blocks chooser styling @sneridagh
- The default view for content types `DocumentView.jsx` has been renamed to a more appropiate `DefaultView.jsx` @sneridagh

### Internal

- Add complete husky config @sneridagh
- Add COC.md file @timo

## 4.0.0-alpha.5 (2019-09-28)

### Added

- Default body classes were enhanced to accept path and content type based ones as in Plone @sneridagh

### Changes

- Fix for checkboxes when setting `false` values, this fixes #888 @sneridagh

## 4.0.0-alpha.4 (2019-09-27)

### Added

- Added Users and Groups Controlpanel @nileshgulia1 @csenger @jackahl

### Changes

- Move the Tile Edit wrapper one level up to the tiles engine, so we can simplify how edit tiles are made @sneridagh
- Rename Metadata and Properties in sidebar to Document and Block @jackahl
- Add some German Translations @steffenri, @jackahl

### Internal

- Fix cypress test for file Upload @jackahl
- Dependencies upgrades (router, redux) @sneridagh
- Enhance Cypress createContent keyword to create files and images @timo
- Fix docs build locally @sneridagh

## 4.0.0-alpha.3 (2019-09-22)

### Added

- New tiles chooser @sneridagh

### Internal

- Fail eslint check on any warnings @timo
- Add i18n check on Travis @timo

## 4.0.0-alpha.2 (2019-09-19)

### Changes

- Fix parameter handling in Search view to avoid limiting search results with empty parameters #845 @csenger
- Fix SearchTags handling of keyword vocabulary for anonymous users @csenger
- Fix hero tile being next to a left or right aligned image @jackahl
- Fix toolbar elements showing depending on user permissions @sneridagh

## 4.0.0-alpha.1 (2019-09-17)

### Changes

- Fix test failure for `VersionOverview` component in master after release process @sneridagh
- Improve usability of login form @sneridagh
- Fix creation of image objects from image tile by adding the id as well @sneridagh
- Remove description tile from the default tiles on new content @sneridagh

### Internal

- Update release-it to fix some deprecation messages @sneridagh

## 4.0.0-alpha.0 (2019-09-13)

### Added

- Show images in Rich Text editor @rodfersou @sneridagh
- Full Pastanaga Toolbabr implementation @sneridagh
- Internal API path for containers @bloodbare
- Add toast component @sneridagh
- Add sidebar support for components @sneridagh
- Add Volto version number in control panel @nzambello
- Remove Mosaic component @tisto
- Added toast component in actions @nzambello
- Added translations to italian @nzambello
- Add table tile @robgietema
- Add image sidebar @sneridagh @gomez
- Add delete file button to file Widget @jackahl
- Add link redirect view @robgietema
- Add proper unique id to all fields, based on the fieldset and field name @sneridagh
- Add QueryString widget @robgietema @sneridagh

### Changes

- Add a delay when filtering content in folder contents so it doesn't overload backend @vangheem
- Small UX/UI fixes @sneridagh
- Fix query string search in subjects vocab field @gomez
- Removed the delete button from the title tile @pnicolli
- Rewrite sidebar @robgietma @sneridagh
- Added SidebarPortal component for easier sidebar handling @pnicolli
- Fixed tiles outline in Pastanaga editor @pnicolli
- Fix typos @balavec
- Fix warnings for boolean fields @miziodel
- Fix dropdown styling @robgietema
- Update connected-react-router and fix instantiation of the wrapper component
  to fix the sync problems with the router and the store @sneridagh
- Fix link popup in case you dismiss it without setting anything @sneridagh
- Export history in start-client.jsx for being able to import it from the project for trackers (Matomo, etc) @csenger
- Workflow change awareness on toolbar @robgietema
- Fix reordering in folder contents view and problems with previous windowing settings leaked to current one. @robgietema
- Fix remove link entity of only a part it only removes that part, not the whole entity @robgietema
- Add proper placeholder to the add link feature in the editor @sneridagh
- Fix bulk workflow change in contents view @sneridagh
- Fix regresion on uploading image to root @sneridagh
- Fix hero tile on view if image is missing @sneridagh
- Fix link to contextual contents in toolbar @sneridagh
- Add automatically the wildcard for the `SearchableText` on the @search action @sneridagh

### Internal

- Upgrade lodash to 4.17.15 @tisto
- Fix console errors on tests @sneridagh
- Add development mode for kitkoncept.voltodemo to /api plonebacked @fredvd
- Cleanup map dispatch to props @robgietema
- Fix linting warnings @robgietema
- Remove decorators @robgietema
- Pin mem to 4.0.0 @tisto
- Add razzle-plugin-bundle-analyzer @tisto
- Add bundlewatch @tisto
- Add bundlesize @tisto
- Update base buildout @sneridagh

## 3.1.0 (2019-06-14)

### Added

- Upgrade to react-redux 7.1. It includes the new official hooks for Redux. @sneridagh
- Make Login Route accessible from anywhere in path url @nileshgulia1

### Changes

- Fix basic tiles classes @rodfersou
- Fix video alignment @sneridagh

### Internal

- Upgrade handlebars to 4.1.2 @timo
- Upgrade js-yaml to 3.13.3 @timo
- Upgrade Plone api folder to 5.2rc3 @sneridagh
- Fixes for image/file fields widgets for Guillotina @sneridagh
- Fixes for Cypress Guillotina tests @sneridagh

## 3.0.4 (2019-05-30)

### Changes

### Internal

- Add cypress a11y tests. @timo
- Fix order of arguments when sending the contact form @csenger
- Fix @babel/core import on i18n script @sneridagh

## 3.0.3 (2019-05-13)

### Internal

- Use eslint-config-react-app instead of airbnb + custom config for linting @timo
- More eslint fixes for avoiding parsing errors on decorators @sneridagh
- Add 'prettier' command to check if there are any missing prettier fixes @timo
- Run 'prettier' on Travis and fail the build if there are missing prettier fixes @timo
- Add 'prettier:fix' command to fix all missing prettier fixes at once @timo
- Run 'prettier:fix' once and commit all fixes @timo
- Fix the most important violations reported with the new config @sneridagh

## 3.0.2 (2019-05-10)

### Changes

- Re-add babel-eslint because of the decorators @sneridagh
- Upgrade eslint-config-airbnb @sneridagh

## 3.0.1 (2019-05-10)

### Changes

- Small fix for a missplacement of the hooks plugin in .eslintrc @sneridagh

## 3.0.0 (2019-05-10)

### Added

- Upgrade to Razzle 3 @sneridagh
- contact-form view @cekk
- Add cypress setup for both Plone and Guillotina @sneridagh
- Update SelectWidget and ArrayWidget and related vocabularies actions/reducers
  for the breaking changes in plone.restapi 4.0.0 @davisagli @sneridagh
- Expose request on the promise returned by the api helper @csenger

### Changes

- Several dependencies upgraded @sneridagh
- Fix image of Hero Tile for images in private containers @sneridagh
- Remove enforcement of JSdocs in Volto ESlint rules @sneridagh
- Remove RobotFramework tests in favor of the cypress ones @sneridagh
- Updated docs to highlight some code changes @pigeonflight

## 2.1.3 (2019-04-17)

### Changes

- Update api folder to Plone 5.2 and Python3, update the whole story @sneridagh

## 2.1.2 (2019-04-16)

### Changes

- Fixed issue where it was not possible to click into the title tile above the
  small red bar at the beginning of the line in some browsers. @jackahl
- Docs content editing. @esteele
- Fix the folder_contents view component bby preventing the SearchableText be
  empty if you haven't typed anything in the filter fields yet. This is caused
  by the new ZCatalog in Zope 4. @sneridagh

## 2.1.1 (2019-04-04)

### Changes

- Improved search action, now it supports passing directly the arrayed values
  and it converts it to Plone's query syntax @sneridagh

- Added depth argument to the navigation action, to match the @navigation
  endpoint feature @sneridagh

## 2.1.0 (2019-04-02)

### Added

- Added specific `onMutateTile` for solely use of the Text tile when it mutates
  to another type of tile. This prevents onChangeTile do one thing that it was
  not designed lifting responsibilities from it. @sneridagh
- Added `detached` mode for the text tile so it will be able to render outside
  the Volto editor without all the tile mutation machinery and the keyboard
  handlers. @sneridagh

### Changes

- Small improvements to the internal tile api @sneridagh
- Fix for tiles having dialog box `ENTER` key captured by global tile onKeyDown
  handler, then creating a tile instead of the intended behavior. @sneridagh
- Fix small CSS and import issues @sneridagh
- Fix Invalid Redraft object warning on console @sneridagh

## 2.0.0 (2019-03-25)

### Added

- Tiles refactor, move keyboard listeners and Trash icon to Tiles HOC
  @sneridagh
- Fix tiles navigation via cursors on all available tiles @sneridagh
- Fix UX on HTML tile when navigating via cursors @sneridagh
- Add ability to add new text tile via `Enter` key @sneridagh
- Add create new text tile at the bottom on adding tiles @sneridagh
- Improve general UX on tiles creation and focusing on creation @sneridagh

## 1.10.0 (2019-03-25)

### Added

- Fix npm package generation @sneridagh

## 1.9.0 (2019-03-25)

### Added

- Upgraded to React 16.8 (the one with hooks) @sneridagh
- Upgraded to the recent (at last) released react-redux 7.0beta.0, this release
  solves the performance issues with the new React context and leave them ready
  for the upcoming useRedux hook. This release supports the latest React 16.8.
  @sneridagh
- Upgraded to the latest Router and react-router-config and other required
  upgrades. @sneridagh
- Upgraded to latest redux-connect @sneridagh
- Upgraded to latest razzle @sneridagh

## 1.8.3 (2019-03-21)

### Changes

- Several CSS fixes @sneridagh
- Add several icons @sneridagh

## 1.8.2 (2019-03-21)

### Changes

- Improve README @svx @fredvd
- Pretty Pastanaga UI .overrides stylesheets @sneridagh

## 1.8.1 (2019-03-19)

### Changes

- Fix hero tile View styling, add definitive icon @sneridagh
- Fix the trash icon on the tiles that was displaced by other change @sneridagh

## 1.8.0 (2019-03-15)

### Added

- Hero Tile @nileshgulia1 @sneridagh

### Changes

## 1.7.0 (2019-03-03)

### Added

- Add image-zooming functionality @nileshgulia1

### Changes

- Fix image float/left right on image tile @timo

## 1.6.1 (2019-03-01)

### Changes

- Fix a regression on the add tile button alignment @sneridagh

## 1.6.0 (2019-03-01)

### Added

- Set image width in Volto editor to 50% for images that float left/right @timo
- Ability to navigate through the existing tiles with the cursors. @sneridagh
- HTML Tile for Volto Editor with preview and code prettifier
  @ajayns @nileshgulia1 @sneridagh
- Add error log in the SSR console @sneridagh
- Add SSR helper to get resources (images/files) from the server using the API
  headers. This fixes the missing images on non published resources while editing @sneridagh
- Fix not valid `<div>` tag nested in a `<p>` tag error on tiles and wysiwyg
  field @sneridagh

### Changes

- Clean .variables files from Pastanaga theme since they are already applied by
  the theming engine from the default theme. @sneridagh
- Fix edit forms with richtext fields coming from SSR @sneridagh

## 1.5.2 (2019-02-20)

### Changes

- Fix external images on Image Tile render @sneridagh
- Several fixes reagarding correctness of markup @sneridagh
- Issue with dangerouslySetInnerHTML RichText fields on first SSR load
  apparently fixed (due to the above fix) :) @sneridagh

## 1.5.1 (2019-02-19)

### Changes

- Fix build for projects created with `create-volto-app` @sneridagh
- Fix link view @nileshgulia1

## 1.5.0 (2019-02-19)

### Added

- Add Google Maps tile @nileshgulia1
- Add support for extending Semantic UI Styling using the semantic theme engine
  by adding an `extras` file that can bring into the engine new styles coming
  from third party libs or custom styling code for the local theme. Being this
  applied after semantic default styling, it's the last one in the styling
  cascade easing the develop of new themes. @sneridagh

### Changes

- Prevent Volto hit the @types endpoint (via its action, getTypes()) if the
  user is not authenticated, since it's useless and always returns a 401
  @sneridagh
- Improved readme @sneridagh
- New logo for the Pastanaga Theme referring to Volto and fix header @sneridagh
- Disable SocialSharing component by default @sneridagh
- Fix login tab index for username autofocus and password after tab @sneridagh
- Fix hamburgers menu @sneridagh
- Fix CSS sourcemaps by make postcss stage to accept other stages sourcemaps
  @sneridagh
- Add IE11 fixes by pinning some packages, added documentation in `docs` about
  it and how to deal with it. However, compatibility is _NOT_ guaranteed in
  future Volto releases @sneridagh
- Fix Header scroll in Firefox in case that there are lot of items in the nav
  @sneridagh
- Add supported browsers in README @sneridagh
- Default tile position to center for all the existing tiles @sneridagh

## 1.4.0 (2019-02-15)

### Added

- Add the ability to detect the edit Plone Site hack for show the tiles editor
  on Plone site edit @sneridagh

### Changes

- Bring back the stylelint default configs for IDEs @sneridagh
- Improve ESlint resolvers for special paths (@plone/volto and ~), so IDEs do
  not complain any more with no-unresolved active @sneridagh
- Fix the floating image problem in the Volto Editor @sneridagh

## 1.3.0 (2019-02-13)

### Added

- Improve the definitions of the view/edit tiles components for better
  extensibility. This might be a BREAKING change if you have already used the
  old way to extend/add more tiles, please update to the new one @sneridagh

### Changes

- Fix Travis unit testing false green @sneridagh
- Fix bad Proptype for location in ScrollToTop component @sneridagh

## 1.2.1 (2019-02-04)

### Changes

- Bring back the scroll to top on every route change feature @sneridagh
- Loosen node version, allow LTS (v8 and v10) @sneridagh

## 1.2.0 (2019-01-22)

### Added

- be able to specify custom headers in actions @vangheem
- fix icons used in contents @vangheem
- be able to work with mr.developer @vangheem
- add alias `@plone/volto-original` and `@package` webpack aliases @vangheem
- add `errorViews` configuration @vangheem

### Changes

- Upgrade to Node 10.14.2 @nileshgulia1

## 1.1.0 (2018-12-24)

### Changes

- Fix edit on root @robgietema
- Fix sharing @robgietema
- Fix error on token renew @robgietema
- Fix layout fieldname @bloodbare
- First field in a form will get the focus @robgietema
- Fix download file links @mikejmets
- Fix HMR missbehaving on both server and client @sneridagh
- Upgrade to Node 8.14.0 @timo
- Relaxed node runtime constraints @sneridagh
- Update to latest LESS and Semantic UI version @sneridagh

## Added

- Add .gitattributes file to avoid most Changelog merge conflicts @pnicolli
- Buildout for Python 3 @pbauer
- Websockets support @robgietema
- Subrequests to search and get content actions @robgietema
- Add logos @sneridagh @albertcasado

## 1.0.0 (2018-10-31)

### Added

- Training documentation link @robgietema

## 0.9.5 (2018-10-24)

### Changes

- Fix API*PATH variable using RAZZLE* prefix instead @sneridagh
- Fix FUOC (flash of unstyled content) in production mode @sneridagh
- Fix missing buttons on RichText tiles @sneridagh
- Fix original external `overrides.css` position in the cascade was applied in
  the wrong order in site.overrides in Pastanaga theme @sneridagh
- Fatten widget config @robgietema

## 0.9.4 (2018-10-10)

### Changes

- Fix tags layout @robgietema @jaroel
- Fix imports of views, widgets and tiles @robgietema @jaroel

## 0.9.3 (2018-10-10)

### Changes

- Fix logo import path @robgietema @jaroel

## 0.9.2 (2018-10-10)

### Added

- Automatic customization imports for images @robgietema @jaroel

## 0.9.1 (2018-10-10)

### Added

- Automatic customization imports @robgietema @jaroel

## 0.9.0 (2018-10-04)

### Changes

- Renamed package to Volto @robgietema

## 0.8.3 (2018-10-03)

### Changes

- Fix i18n script for dependency @robgietema

## 0.8.2 (2018-10-03)

### Changes

- Move all dev dependencies to dependencies @robgietema

## 0.8.1 (2018-10-03)

### Changes

- Fix compiling when used as a library @robgietema
- Fix buildout security issue @robgietema

## 0.8.0 (2018-10-03)

### Added

- Move the webpack config to Razzle @sneridagh @robgietema
- Upgrade React to 16.5 @tisto
- Upgrade React to 16.4.2 to fix a server-side vulnerability @tisto
- Support for base url @bloodbare

### Changes

- Merged Guillotina and Plone robot tests @bloodbare
- Don't reset total and batching on pending search @robgietema

## 0.7.0 (2018-07-31)

### Added

- Add Pastanaga Icon System @sneridagh
- Support for nested schemas @robgietema
- New block on return in editor @robgietema
- Added 404 page on page not found @robgietema
- Custom tiles support @sneridagh
- Add full register/password reset views @sneridagh
- Make the list block types configurable @robgietema
- Add all missing German translations @tisto
- Add helper `BodyClass` for appending classes to the `body` tag from View components @sneridagh
- Add Tiles support for Guillotina CMS @bloodbare @sneridagh @robgietema

### Changes

- Pastanaga Editor look and feel improvements and polishment @sneridagh @albertcasado
- Refactor configuration of routes, views and widgets for extensibility @sneridagh @davilima6
- Fix view name class in body element @sneridagh @davilima6
- Refactor actions @robgietema
- Store text tile data in json @robgietema
- Fixed tile add menu @robgietema
- Change to use root import on all config calls @sneridagh
- Fix CSS on tile image view @sneridagh
- Fix broken CSS on alignments left/right @sneridagh
- Tile DE literals translations @sneridagh
- Pass location as prop to child views in main View component in case we require it in some views @sneridagh
- Fix computed displayName from add-display-name Babel plugin for connected components @sneridagh

## 0.6.0 (2018-07-14)

### Added

- Schema widget @robgietema
- User actions and reducers @robgietema
- Group actions and reducers @robgietema
- Roles actions and reducers @robgietema
- Move combineReducers to the store creation level. This will ease the extensibility of them in Plone-React apps. @sneridagh
- Upgrade node to 8.11.2 @sneridagh
- Basic user listing in users controlpanel @robgietema
- Add missing FileWidget import @sneridagh
- Option to delete tiles @robgietema
- Option to add tiles @robgietema
- Image tiles in editor @robgietema
- Align images in editor @robgietema
- Video tiles in editor @robgietema
- Video tiles in editor @robgietema
- Sitemap.xml.gz view @robgietema
- Upload image indicator @robgietema
- Video tile view @robgietema
- Option to reset image @robgietema
- Drag and drop to reorder tiles @robgietema
- Enhanced DraftJS AnchorLink Plugin @robgietema @sneridagh
- Added the configuration required in Webpack config to load CSS modules in the project, required by DraftJS AnchorLink plugin @sneridagh

### Changes

- Styled wysiwyg widget @robgietema
- Switch from accordion to tabs in forms @robgietema
- Upgrade to Node 8.11.1 @tisto
- Replace ExtractionTextCSSPlugin with the new mini-css-extract-plugin, adapt universal-webpack config @sneridagh
- Removed flow @robgietema
- Fix eslint prettier config @robgietema
- Refactor actions and reducers to match restapi docs naming @robgietema
- Fix site root api calls @robgietema
- Change visual editor to use the new tiles api @robgietema
- Fix bug with wrong order input @robgietema
- Fix several problems in the DraftJS AnchorLink plugin @sneridagh
- Replace DraftJS Toolbar plugin H1/H2 buttons for H2/H3 ones @sneridagh
- Sync i18n translations @sneridagh
- Fix CSS .input class scope intrusion on the project introduced by the AnchorLink plugin fork @sneridagh
- Improve search reducer by adding the batching property in the search store.
- Upgrade to Node 8.11.3 @sneridagh

## 0.5.0 (2018-03-23)

### Added

- Pastanaga theme package @jaroel, @robgietema
- Registry based controlpanels @robgietema
- Component documentation @robgietema
- Component documentation examples @VaysseB
- Folder listing view @cekk
- Prettier docs for SCA @nileshgulia1
- Comments, email notification and vocabularies reducers @robgietema
- Pastanaga theme @robgietema
- Pastanaga manage views @robgietema
- Pastanaga theme views @robgietema
- Callout styling to draftjs @robgietema
- Image, file and news item view @robgietema
- Social sharing @robgietema
- Commenting @robgietema
- Tags @robgietema
- Renew login token when almost expired @robgietema
- Cctions reducers @robgietema
- Error reporting with Sentry support on client (default ErrorBoundary), server and Redux middleware @sneridagh
- Tiles reducers @robgietema
- Context aware toolbar @robgietema
- Hamburger menu navigation on mobile @sneridagh
- Editor prototype @robgietema
- Support for null values when reseting a field value @sneridagh

### Changes

- Update plone api versions / bootstrap process @thet
- Fix textwidget proptypes @cekk
- Remove phantomjs @tulikavijay
- Upgrade to node 8 @robgietema
- Switched to draft js plugins editor @robgietema
- Fix paragraph styling in draftjs @robgietema
- Fixed summary and tabular views @robgietema
- Upgrade to React 16 @sneridagh
- Upgrade to Webpack 4 @sneridagh
- Review chunks policy. Keep it in sync with Webpack 4 policy with entrypoint bundles @sneridagh
- Merged block styling to inline toolbar @robgietema
- Actions aware toolbar @sneridagh
- Fix permissions on the toolbar display menu @sneridagh

## 0.4.0 (2017-05-03)

### Added

- Adding tiles @robgietema
- Handle different tiles @robgietema
- Resizing of tiles @robgietema
- Deletion of tiles @robgietema
- Drag and drop of tiles @robgietema
- Basic mosaic grid rendering @robgietema
- Form validation @robgietema
- Notification messages @robgietema

### Changes

- Updated to new history api @robgietema
- Deselect on click outside grid @robgietema

## 0.3.0 (2017-04-29)

### Added

- Personal information @robgietema
- Change password @robgietema
- Password widget @robgietema
- I18n support and translations @robgietema
- Personal preferences @robgietema
- Rename action @robgietema

### Changed

- Fixed favicon @robgietema

## 0.2.0 (2017-04-27)

### Added

- Batch state in folder contents @robgietema
- Batch properties in folder contents @robgietema
- Batch tags in folder contents @robgietema
- Batch rename in folder contents @robgietema
- Diff view @robgietema
- Add revert to version @robgietema
- Create view revision page @robgietema
- Create history list view @robgietema
- Sorting of items in folder contents @robgietema
- Upload files in folder contents @robgietema
- Ordering of columns in folder contents @robgietema
- Ordering of items in folder contents @robgietema
- Pagination in folder contents @robgietema
- Delete in folder contents @robgietema

### Changed

- Only show add and contents in the toolbar when folderish @robgietema
- Diff on words not chars @robgietema

## 0.1.0 (2017-04-20)

### Added

- Folder contents @robgietema
- Sharing menu and view @robgietema
- Display menu @robgietema
- Semantic UI integration @robgietema
- Basic Mosaic setup @robgietema
- Basic Server Side Rendering @robgietema
- Search view @robgietema
- Actions menu @robgietema
- Workflow menu @robgietema
- Add menu @robgietema
- Add and edit forms including widgets @robgietema
- Basic components (navigation, toolbar, breadcrumbs etc) @robgietema
- Authentication including login / logout @robgietema
- Setup build environment @robgietema
