/**
 * Point of contact for component modules. This file is quite sensitive regarding the
 * order in which it's loaded. e.g. if the component depends on others to work, it
 * should ideally be loaded after them. If you start seeing imported components as
 * undefined, check the order of imports in this file.
 * @module components
 */
import loadable from '@loadable/component';

//  Do not lazy load them, since it has not much sense (they will live in the main chunk)
// The App and View component are deliberatelly left out of this index.js file!
// They should be used by Volto and only by Volto internally
export AppExtras from '@plone/volto/components/theme/AppExtras/AppExtras';
export Header from '@plone/volto/components/theme/Header/Header';
export Logo from '@plone/volto/components/theme/Logo/Logo';
export Anontools from '@plone/volto/components/theme/Anontools/Anontools';
export Navigation from '@plone/volto/components/theme/Navigation/Navigation';
export Breadcrumbs from '@plone/volto/components/theme/Breadcrumbs/Breadcrumbs';
export SearchWidget from '@plone/volto/components/theme/SearchWidget/SearchWidget';
export Footer from '@plone/volto/components/theme/Footer/Footer';
export Title from '@plone/volto/components/theme/Title/Title';
export DefaultView from '@plone/volto/components/theme/View/DefaultView';
export Pagination from '@plone/volto/components/theme/Pagination/Pagination';
export Tags from '@plone/volto/components/theme/Tags/Tags';
export OutdatedBrowser from '@plone/volto/components/theme/OutdatedBrowser/OutdatedBrowser';
export LanguageSelector from '@plone/volto/components/theme/LanguageSelector/LanguageSelector';
export RenderBlocks from '@plone/volto/components/theme/View/RenderBlocks';
export SkipLinks from '@plone/volto/components/theme/SkipLinks/SkipLinks';

export Error from '@plone/volto/components/theme/Error/Error';
export NotFound from '@plone/volto/components/theme/NotFound/NotFound';
export Forbidden from '@plone/volto/components/theme/Forbidden/Forbidden';
export Unauthorized from '@plone/volto/components/theme/Unauthorized/Unauthorized';

export Avatar from '@plone/volto/components/theme/Avatar/Avatar';
export Icon from '@plone/volto/components/theme/Icon/Icon';
export ConditionalLink from '@plone/volto/components/manage/ConditionalLink/ConditionalLink';
export UniversalLink from '@plone/volto/components/manage/UniversalLink/UniversalLink';

export SlotRenderer from '@plone/volto/components/theme/SlotRenderer/SlotRenderer';
export ContentContainer from '@plone/volto/components/theme/ContentContainer/ContentContainer';

// Lazy load them, since we want them and its deps to be in its own chunk
export ContactForm from '@plone/volto/components/theme/ContactForm/ContactForm';
export Login from '@plone/volto/components/theme/Login/Login';
export Logout from '@plone/volto/components/theme/Logout/Logout';
export Sitemap from '@plone/volto/components/theme/Sitemap/Sitemap';
export Search from '@plone/volto/components/theme/Search/Search';
export Comments from '@plone/volto/components/theme/Comments/Comments';
export SocialSharing from '@plone/volto/components/theme/SocialSharing/SocialSharing';
export Register from '@plone/volto/components/theme/Register/Register';
export PasswordReset from '@plone/volto/components/theme/PasswordReset/PasswordReset';
export RequestPasswordReset from '@plone/volto/components/theme/PasswordReset/RequestPasswordReset';
export ChangePassword from '@plone/volto/components/manage/Preferences/ChangePassword';
export PersonalPreferences from '@plone/volto/components/manage/Preferences/PersonalPreferences';
export PersonalInformation from '@plone/volto/components/manage/Preferences/PersonalInformation';
export CreateTranslation from '@plone/volto/components/manage/Multilingual/CreateTranslation';
export TranslationObject from '@plone/volto/components/manage/Multilingual/TranslationObject';
export CompareLanguages from '@plone/volto/components/manage/Multilingual/CompareLanguages';

export FileView from '@plone/volto/components/theme/View/FileView';
export ImageView from '@plone/volto/components/theme/View/ImageView';
export NewsItemView from '@plone/volto/components/theme/View/NewsItemView';

export const EventView = loadable(() =>
  import('@plone/volto/components/theme/View/EventView'),
);

export ListingView from '@plone/volto/components/theme/View/ListingView';
export SummaryView from '@plone/volto/components/theme/View/SummaryView';
export TabularView from '@plone/volto/components/theme/View/TabularView';
export AlbumView from '@plone/volto/components/theme/View/AlbumView';

export Actions from '@plone/volto/components/manage/Actions/Actions';
export Add from '@plone/volto/components/manage/Add/Add';
export AddonsControlpanel from '@plone/volto/components/manage/Controlpanels/AddonsControlpanel';
export Contents from '@plone/volto/components/manage/Contents/Contents';
export Circle from '@plone/volto/components/manage/Contents/circle';
export DatabaseInformation from '@plone/volto/components/manage/Controlpanels/DatabaseInformation';
export Controlpanel from '@plone/volto/components/manage/Controlpanels/Controlpanel';
export Controlpanels from '@plone/volto/components/manage/Controlpanels/Controlpanels';
export ContentTypes from '@plone/volto/components/manage/Controlpanels/ContentTypes';
export ContentType from '@plone/volto/components/manage/Controlpanels/ContentType';
export ContentTypeLayout from '@plone/volto/components/manage/Controlpanels/ContentTypeLayout';
export ContentTypeSchema from '@plone/volto/components/manage/Controlpanels/ContentTypeSchema';
export ContentTypesActions from '@plone/volto/components/manage/Controlpanels/ContentTypesActions';
export UsersControlpanel from '@plone/volto/components/manage/Controlpanels/UsersControlpanel';
export ModerateComments from '@plone/volto/components/manage/Controlpanels/ModerateComments';
export VersionOverview from '@plone/volto/components/manage/Controlpanels/VersionOverview';
export Delete from '@plone/volto/components/manage/Delete/Delete';
export Diff from '@plone/volto/components/manage/Diff/Diff';
export Display from '@plone/volto/components/manage/Display/Display';
export Edit from '@plone/volto/components/manage/Edit/Edit';
export EditSlot from '@plone/volto/components/manage/Slots/EditSlot';
export ModalForm from '@plone/volto/components/manage/Form/ModalForm';
export History from '@plone/volto/components/manage/History/History';
export Sharing from '@plone/volto/components/manage/Sharing/Sharing';
export Workflow from '@plone/volto/components/manage/Workflow/Workflow';
export Messages from '@plone/volto/components/manage/Messages/Messages';
export BlockChooser from '@plone/volto/components/manage/BlockChooser/BlockChooser';
export BlockChooserButton from '@plone/volto/components/manage/BlockChooser/BlockChooserButton';
export BlockToolbarItem from '@plone/volto/components/manage/Blocks/Block/BlockToolbarItem';
export Toolbar from '@plone/volto/components/manage/Toolbar/Toolbar';
export Sidebar from '@plone/volto/components/manage/Sidebar/Sidebar';
export SidebarPopup from '@plone/volto/components/manage/Sidebar/SidebarPopup';
export SidebarPortal from '@plone/volto/components/manage/Sidebar/SidebarPortal';
export PersonalTools from '@plone/volto/components/manage/Toolbar/PersonalTools';
export More from '@plone/volto/components/manage/Toolbar/More';
export Types from '@plone/volto/components/manage/Toolbar/Types';
export Toast from '@plone/volto/components/manage/Toast/Toast';
export ManageTranslations from '@plone/volto/components/manage/Multilingual/ManageTranslations';

// Potentially could ve removed from index, since they are internal components and
// we don't want them to end up in the main chunk
export Form from '@plone/volto/components/manage/Form/Form';
export BlocksToolbar from '@plone/volto/components/manage/Form/BlocksToolbar';
export Field from '@plone/volto/components/manage/Form/Field';
export SearchTags from '@plone/volto/components/theme/Search/SearchTags';
export CommentEditModal from '@plone/volto/components/theme/Comments/CommentEditModal';
export ContentsIndexHeader from '@plone/volto/components/manage/Contents/ContentsIndexHeader';
export ContentsItem from '@plone/volto/components/manage/Contents/ContentsItem';
export ContentsUploadModal from '@plone/volto/components/manage/Contents/ContentsUploadModal';
export ContentsPropertiesModal from '@plone/volto/components/manage/Contents/ContentsPropertiesModal';
export ContentsRenameModal from '@plone/volto/components/manage/Contents/ContentsRenameModal';
export ContentsWorkflowModal from '@plone/volto/components/manage/Contents/ContentsWorkflowModal';
export ContentsTagsModal from '@plone/volto/components/manage/Contents/ContentsTagsModal';
export UsersControlpanelUser from '@plone/volto/components/manage/Controlpanels/UsersControlpanelUser';
export UsersControlpanelGroups from '@plone/volto/components/manage/Controlpanels/UsersControlpanelGroups';
export DiffField from '@plone/volto/components/manage/Diff/DiffField';
export DragDropList from '@plone/volto/components/manage/DragDropList/DragDropList';
export InlineForm from '@plone/volto/components/manage/Form/InlineForm';
export BlocksForm from '@plone/volto/components/manage/Blocks/Block/BlocksForm';
export BlockDataForm from '@plone/volto/components/manage/Form/BlockDataForm';

export FormFieldWrapper from '@plone/volto/components/manage/Widgets/FormFieldWrapper';
export ArrayWidget from '@plone/volto/components/manage/Widgets/ArrayWidget';
export CheckboxWidget from '@plone/volto/components/manage/Widgets/CheckboxWidget';

export const DatetimeWidget = loadable(() =>
  import('@plone/volto/components/manage/Widgets/DatetimeWidget'),
);
export const RecurrenceWidget = loadable(() =>
  import(
    '@plone/volto/components/manage/Widgets/RecurrenceWidget/RecurrenceWidget'
  ),
);

export FileWidget from '@plone/volto/components/manage/Widgets/FileWidget';
export PasswordWidget from '@plone/volto/components/manage/Widgets/PasswordWidget';
export ReferenceWidget from '@plone/volto/components/manage/Widgets/ReferenceWidget';
export SchemaWidget from '@plone/volto/components/manage/Widgets/SchemaWidget';
export SchemaWidgetFieldset from '@plone/volto/components/manage/Widgets/SchemaWidgetFieldset';
export SelectWidget from '@plone/volto/components/manage/Widgets/SelectWidget';
export TextareaWidget from '@plone/volto/components/manage/Widgets/TextareaWidget';
export TextWidget from '@plone/volto/components/manage/Widgets/TextWidget';
export WysiwygWidget from '@plone/volto/components/manage/Widgets/WysiwygWidget';
export ObjectBrowserWidget from '@plone/volto/components/manage/Widgets/ObjectBrowserWidget';
export ObjectBrowserWidgetMode from '@plone/volto/components/manage/Widgets/ObjectBrowserWidget';
export ObjectWidget from '@plone/volto/components/manage/Widgets/ObjectWidget';
export ObjectListWidget from '@plone/volto/components/manage/Widgets/ObjectListWidget';

export EditDescriptionBlock from '@plone/volto/components/manage/Blocks/Description/Edit';
export EditTitleBlock from '@plone/volto/components/manage/Blocks/Title/Edit';
export EditToCBlock from '@plone/volto/components/manage/Blocks/ToC/Edit';
export EditTextBlock from '@plone/volto/components/manage/Blocks/Text/Edit';
export EditImageBlock from '@plone/volto/components/manage/Blocks/Image/Edit';
export EditListingBlock from '@plone/volto/components/manage/Blocks/Listing/Edit';
export EditVideoBlock from '@plone/volto/components/manage/Blocks/Video/Edit';
export EditBlock from '@plone/volto/components/manage/Blocks/Block/Edit';
export EditHeroImageLeftBlock from '@plone/volto/components/manage/Blocks/HeroImageLeft/Edit';
export ViewHeroImageLeftBlock from '@plone/volto/components/manage/Blocks/HeroImageLeft/View';
export EditMapBlock from '@plone/volto/components/manage/Blocks/Maps/Edit';
export EditHTMLBlock from '@plone/volto/components/manage/Blocks/HTML/Edit';

export ViewDescriptionBlock from '@plone/volto/components/manage/Blocks/Description/View';
export ViewTitleBlock from '@plone/volto/components/manage/Blocks/Title/View';
export ViewToCBlock from '@plone/volto/components/manage/Blocks/ToC/View';
export ViewTextBlock from '@plone/volto/components/manage/Blocks/Text/View';
export ViewImageBlock from '@plone/volto/components/manage/Blocks/Image/View';
export ViewListingBlock from '@plone/volto/components/manage/Blocks/Listing/View';
export ViewVideoBlock from '@plone/volto/components/manage/Blocks/Video/View';
export ViewMapBlock from '@plone/volto/components/manage/Blocks/Maps/View';
export ViewHTMLBlock from '@plone/volto/components/manage/Blocks/HTML/View';

export ListingBlockBody from '@plone/volto/components/manage/Blocks/Listing/ListingBody';
export ListingBlockData from '@plone/volto/components/manage/Blocks/Listing/ListingData';

export ImageSidebar from '@plone/volto/components/manage/Blocks/Image/ImageSidebar';
export MapsSidebar from '@plone/volto/components/manage/Blocks/Maps/MapsSidebar';
export VideoSidebar from '@plone/volto/components/manage/Blocks/Video/VideoSidebar';
export LeadImageSidebar from '@plone/volto/components/manage/Blocks/LeadImage/LeadImageSidebar';

export Style from '@plone/volto/components/manage/Blocks/Block/Style';
export BlockSettingsSidebar from '@plone/volto/components/manage/Blocks/Block/Settings';
export BlockSettingsSchema from '@plone/volto/components/manage/Blocks/Block/Schema';
export TextSettingsSchema from '@plone/volto/components/manage/Blocks/Text/Schema';
export ImageSettingsSchema from '@plone/volto/components/manage/Blocks/Image/Schema';
export ToCSettingsSchema from '@plone/volto/components/manage/Blocks/ToC/Schema';

export MaybeWrap from '@plone/volto/components/manage/MaybeWrap/MaybeWrap';
export ContentMetadataTags from '@plone/volto/components/theme/ContentMetadataTags/ContentMetadataTags';

export App from '@plone/volto/components/theme/App/App';
