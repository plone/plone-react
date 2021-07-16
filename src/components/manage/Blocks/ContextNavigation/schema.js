export const EditSchema = () => {
  return {
    title: 'Navigation',
    fieldsets: [
      {
        id: 'default',
        title: 'Default',
        fields: [
          'name',
          'root_node',
          'includeTop',
          'currentFolderOnly',
          'topLevel',
          'bottomLevel',
          'no_icons',
          'thumb_scale',
          'no_thumbs',
        ],
      },
    ],
    required: [],
    properties: {
      name: {
        title: 'Title',
        description: 'The title of the navigation tree',
      },
      root_node: {
        title: 'Root node',
        description:
          'You may search for and choose a folder to act as the root of the navigation tree. Leave blank to use the Plone site root.',
        widget: 'object_browser',
        // TODO: these don't work. Why?
        mode: 'link',
        selectedItemAttrs: ['Title', 'Description'],
      },
      includeTop: {
        title: 'Include top node',
        description:
          "Whether or not to show the top, or 'root', node in the navigation tree. This is affected by the 'Start level' setting.",
        type: 'boolean',
      },
      currentFolderOnly: {
        title: 'Only show the contents of the current folder',
        description:
          'If selected, the navigation tree will only show the current folder and its children at all times.',
        type: 'boolean',
      },

      topLevel: {
        title: 'Start level',
        description:
          'An integer value that specifies the number of folder levels below the site root that must be exceeded before the navigation tree will display. 0 means that the navigation tree should be displayed everywhere including pages in the root of the site. 1 means the tree only shows up inside folders located in the root and downwards, never showing at the top level.',
        type: 'number',
        default: 1,
      },
      bottomLevel: {
        title: 'Navigation tree depth',
        description:
          'How many folders should be included before the navigation tree stops. 0 means no limit. 1 only includes the root folder.',
        type: 'number',
        default: 0,
      },
      no_icons: {
        title: 'Supress icons',
        description:
          'If enabled, the portlet will not show document type icons.',
        type: 'boolean',
      },
      thumb_scale: {
        title: 'Override thumb scale',
        description:
          "Enter a valid scale name (see 'Image Handling' control panel) to override (e.g. icon, tile, thumb, mini, preview, ... ). Leave empty to use default (see 'Site' control panel).",
      },
      no_thumbs: {
        title: 'Supress thumbs',
        type: 'boolean',
        description: 'If enabled, the portlet will not show thumbs.',
      },
    },
  };
};
