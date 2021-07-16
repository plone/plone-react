const SlotsSchema = (props) => ({
  title: `Edit slot: {props.slotId}`,
  fieldsets: [
    {
      id: 'default',
      title: 'Default',
      fields: ['block_parent'],
    },
  ],
  required: [],
  properties: {
    block_parent: {
      type: 'boolean',
      title: 'Block parent slot fills?',
    },
  },
});

export default SlotsSchema;
