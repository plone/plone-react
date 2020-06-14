/**
 * SchemaWidget component.
 * @module components/manage/Widgets/SchemaWidget
 */

import { getFieldSchema } from '@plone/volto/actions';
import { Field, ModalForm, SchemaWidgetFieldset } from '@plone/volto/components';
import { concat, findIndex, map, omit, slice, without } from 'lodash';
import move from 'lodash-move';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { defineMessages, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Confirm, Form, Grid, Icon, Message, Segment } from 'semantic-ui-react';

// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { compose } from 'redux';
// import { concat, findIndex, map, omit, slice, without } from 'lodash';
// import move from 'lodash-move';
// import { Confirm, Form, Grid, Icon, Message, Segment } from 'semantic-ui-react';
// import { defineMessages, injectIntl } from 'react-intl';
// import { DragDropContext } from 'react-dnd';
// import HTML5Backend from 'react-dnd-html5-backend';
// import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

// import {
//   Field,
//   ModalForm,
//   SchemaWidgetFieldset,
// } from '@plone/volto/components';

const isUserCreated = (field) =>
  field.behavior.indexOf('plone.dexterity.schema.generated') > -1;

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  background: isDragging ? 'white' : 'transparent',

  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? '#f4f4f4' : 'transparent',
});

const messages = defineMessages({
  add: {
    id: 'Add',
    defaultMessage: 'Add',
  },
  addField: {
    id: 'Add field',
    defaultMessage: 'Add field',
  },
  addFieldset: {
    id: 'Add fieldset',
    defaultMessage: 'Add fieldset',
  },
  editField: {
    id: 'Edit field',
    defaultMessage: 'Edit field',
  },
  editFieldset: {
    id: 'Edit fieldset',
    defaultMessage: 'Edit fieldset',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  string: {
    id: 'String',
    defaultMessage: 'String',
  },
  text: {
    id: 'Text',
    defaultMessage: 'Text',
  },
  richtext: {
    id: 'Richtext',
    defaultMessage: 'Richtext',
  },
  checkbox: {
    id: 'Checkbox',
    defaultMessage: 'Checkbox',
  },
  selection: {
    id: 'Selection',
    defaultMessage: 'Selection',
  },
  type: {
    id: 'Type',
    defaultMessage: 'Type',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  description: {
    id: 'Description',
    defaultMessage: 'Description',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  deleteFieldset: {
    id: 'Are you sure you want to delete this fieldset including all fields?',
    defaultMessage:
      'Are you sure you want to delete this fieldset including all fields?',
  },
  deleteField: {
    id: 'Are you sure you want to delete this field?',
    defaultMessage: 'Are you sure you want to delete this field?',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
});

/**
 * SchemaWidget component class.
 * @class SchemaWidget
 * @extends Component
 */
class SchemaWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    /**
     * Id of the field
     */
    id: PropTypes.string.isRequired,
    /**
     * Title of the field
     */
    required: PropTypes.bool,
    /**
     * Value of the field
     */
    value: PropTypes.object,
    /**
     * List of error messages
     */
    error: PropTypes.arrayOf(PropTypes.string),
    /**
     * On change handler
     */
    onChange: PropTypes.func.isRequired,
    /**
     * Intl object
     */
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    required: false,
    value: {},
    error: [],
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onChangeDefaultValue = this.onChangeDefaultValue.bind(this);
    this.onAddField = this.onAddField.bind(this);
    this.onAddFieldset = this.onAddFieldset.bind(this);
    this.onEditField = this.onEditField.bind(this);
    this.onEditFieldset = this.onEditFieldset.bind(this);
    this.onDeleteFieldset = this.onDeleteFieldset.bind(this);
    this.onDeleteField = this.onDeleteField.bind(this);
    this.onShowAddField = this.onShowAddField.bind(this);
    this.onShowAddFieldset = this.onShowAddFieldset.bind(this);
    this.onShowEditFieldset = this.onShowEditFieldset.bind(this);
    this.onShowEditField = this.onShowEditField.bind(this);
    this.onShowDeleteFieldset = this.onShowDeleteFieldset.bind(this);
    this.onShowDeleteField = this.onShowDeleteField.bind(this);
    this.onSetCurrentFieldset = this.onSetCurrentFieldset.bind(this);
    this.onOrderField = this.onOrderField.bind(this);
    this.onOrderFieldset = this.onOrderFieldset.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      addField: null,
      addFieldset: null,
      editFieldset: null,
      editField: null,
      deleteFieldset: null,
      deleteField: null,
      currentFieldset: 0,
      lol: 'lol',
    };
  }

  /**
   * Add field handler
   * @method onAddField
   * @param {Object} values Form values
   * @returns {undefined}
   */
  onAddField(values) {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.currentFieldset),
        {
          ...this.props.value.fieldsets[this.state.currentFieldset],
          fields: [
            ...this.props.value.fieldsets[this.state.currentFieldset].fields,
            values.id,
          ],
        },
        ...slice(this.props.value.fieldsets, this.state.currentFieldset + 1),
      ],
      properties: {
        ...this.props.value.properties,
        [values.id]: {
          title: values.title,
          description: values.description,
          ...((type) => {
            switch (type) {
              case 'textarea':
                return {
                  type: 'string',
                  widget: 'textarea',
                };
              case 'wysiwyg':
                return {
                  type: 'string',
                  widget: 'richtext',
                };
              case 'checkbox':
                return {
                  type: 'boolean',
                };
              case 'selection':
                return {
                  type: 'string',
                  choices: [],
                };
              default:
                return {
                  type: 'string',
                };
            }
          })(values.type),
        },
      },
      required: values.required
        ? [...this.props.value.required, values.id]
        : this.props.value.required,
    });
    this.onCancel();
  }

  /**
   * Add fieldset handler
   * @method onAddFieldset
   * @param {Object} values Form values
   * @returns {undefined}
   */
  onAddFieldset(values) {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...this.props.value.fieldsets,
        {
          ...values,
          fields: [],
        },
      ],
    });
    this.onCancel();
  }

  /**
   * Edit fieldset handler
   * @method onEditFieldset
   * @param {Object} values Form values
   * @returns {undefined}
   */
  onEditFieldset(values) {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.editFieldset),
        values,
        ...slice(this.props.value.fieldsets, this.state.editFieldset + 1),
      ],
    });
    this.onCancel();
  }

  /**
   * Edit field handler
   * @method onEditField
   * @param {Object} values Field values
   * @returns {undefined}
   */
  onEditField(values) {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.currentFieldset),
        {
          ...this.props.value.fieldsets[this.state.currentFieldset],
          fields: map(
            this.props.value.fieldsets[this.state.currentFieldset].fields,
            (field) => (field === this.state.editField.id ? values.id : field),
          ),
        },
        ...slice(this.props.value.fieldsets, this.state.currentFieldset + 1),
      ],
      properties: {
        ...omit(this.props.value.properties, [this.state.editField.id]),
        [values.id]: {
          ...this.props.value.properties[this.state.editField.id],
          ...omit(values, ['id', 'required']),
        },
      },
      required: values.required
        ? concat(without(this.props.value.required, this.state.editField.id), [
            values.id,
          ])
        : without(this.props.value.required, this.state.editField.id),
    });
    this.onCancel();
  }

  /**
   * Delete fieldset handler
   * @method onDeleteFieldset
   * @returns {undefined}
   */
  onDeleteFieldset() {
    if (this.state.currentFieldset > this.props.value.fieldsets.length - 2) {
      this.setState({
        currentFieldset: this.state.currentFieldset - 1,
      });
    }
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.deleteFieldset),
        ...slice(this.props.value.fieldsets, this.state.deleteFieldset + 1),
      ],
      properties: omit(
        this.props.value.properties,
        this.props.value.fieldsets[this.state.deleteFieldset].fields,
      ),
    });
    this.onCancel();
  }

  /**
   * Delete field handler
   * @method onDeleteField
   * @returns {undefined}
   */
  onDeleteField() {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.currentFieldset),
        {
          ...this.props.value.fieldsets[this.state.currentFieldset],
          fields: without(
            this.props.value.fieldsets[this.state.currentFieldset].fields,
            this.state.deleteField,
          ),
        },
        ...slice(this.props.value.fieldsets, this.state.currentFieldset + 1),
      ],
      properties: omit(this.props.value.properties, [this.state.deleteField]),
    });
    this.onCancel();
  }

  /**
   * Change handler
   * @method onChange
   * @param {Object} value New schema
   * @returns {undefined}
   */
  onChange(value) {
    this.props.onChange(this.props.id, JSON.stringify(value));
  }

  onChangeDefaultValue(fieldId, fieldValue) {
    const { value } = this.props;
    const fieldMerge = {
      ...value.properties[fieldId],
      ...{ default: fieldValue },
    };
    const propsMerge = { ...value.properties, ...{ [fieldId]: fieldMerge } };

    this.onChange({
      ...value,
      properties: propsMerge,
    });
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.setState({
      addField: null,
      addFieldset: null,
      editFieldset: null,
      editField: null,
      deleteFieldset: null,
      deleteField: null,
    });
  }

  /**
   * Show add field handler
   * @method onShowAddField
   * @returns {undefined}
   */
  onShowAddField(event) {
    this.setState({
      addField: true,
    });
    event.preventDefault();
  }

  /**
   * Show add fieldset handler
   * @method onShowAddFieldset
   * @returns {undefined}
   */
  onShowAddFieldset(event) {
    this.setState({
      addFieldset: true,
    });
    event.preventDefault();
  }

  /**
   * Show edit fieldset handler
   * @method onShowEditFieldset
   * @param {Number} index Index of fieldset
   * @returns {undefined}
   */
  onShowEditFieldset(index) {
    this.setState({
      editFieldset: index,
    });
  }

  /**
   * Show edit field handler
   * @method onShowEditField
   * @param {string} id Id of field
   * @param {Object} schema Schema of the field
   * @returns {undefined}
   */
  onShowEditField(id, schema) {
    const { contentType } = this.props.value;

    this.setState({
      editField: {
        id,
        schema,
      },
    });

    this.props.getFieldSchema(contentType, id);
  }

  /**
   * Show delete fieldset handler
   * @method onShowDeleteFieldset
   * @param {Number} index Index of fieldset
   * @param {Object} event Event object
   * @returns {undefined}
   */
  onShowDeleteFieldset(index) {
    this.setState({
      deleteFieldset: index,
    });
  }

  /**
   * Show delete field handler
   * @method onShowDeleteField
   * @param {String} field Field to delete
   * @param {Object} event Event object
   * @returns {undefined}
   */
  onShowDeleteField(field) {
    this.setState({
      deleteField: field,
    });
  }

  /**
   * Set current fieldset handler
   * @method onSetCurrentFieldset
   * @param {Number} index Index of fieldset
   * @returns {undefined}
   */
  onSetCurrentFieldset(index) {
    this.setState({
      currentFieldset: index,
    });
  }

  /**
   * On order fieldset
   * @method onOrderField
   * @param {number} index Index
   * @param {number} delta Delta
   * @returns {undefined}
   */
  onOrderField(index, delta) {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.currentFieldset),
        {
          ...this.props.value.fieldsets[this.state.currentFieldset],
          fields: move(
            this.props.value.fieldsets[this.state.currentFieldset].fields,
            index,
            delta,
          ),
        },
        ...slice(this.props.value.fieldsets, this.state.currentFieldset + 1),
      ],
    });
  }

  /**
   * On order fieldset
   * @method onOrderFieldset
   * @param {number} index Index
   * @param {number} delta Delta
   * @returns {undefined}
   */
  onOrderFieldset(index, delta) {
    const value = {
      ...this.props.value,
      fieldsets: move(this.props.value.fieldsets, index, delta),
    };
    this.setState({
      currentFieldset: findIndex(value.fieldsets, {
        id: this.props.value.fieldsets[this.state.currentFieldset].id,
      }),
    });
    this.onChange(value);
  }

  /**
   * Set current fieldset handler
   * @method onDragEnd
   * @param {Number} index Index of fieldset
   * @returns {undefined}
   */
  onDragEnd(result) {
    if (
      result.destination &&
      result.destination.droppableId === 'fields-schema-edit'
    ) {
      this.onOrderField(result.source.index, result.destination.index);
    }
    if (
      result.destination &&
      result.destination.droppableId === 'tabs-schema-edit'
    ) {
      this.onOrderFieldset(result.source.index, result.destination.index);
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { value, error } = this.props;
    const userCreatedFields = value.fieldsets[
      this.state.currentFieldset
    ].fields.filter(
      (fieldId) =>
        isUserCreated(value.properties[fieldId]) && fieldId !== 'changeNote',
    );
    const nonUserCreatedFields = value.fieldsets[
      this.state.currentFieldset
    ].fields.filter(
      (fieldId) =>
        !isUserCreated(value.properties[fieldId]) && fieldId !== 'changeNote',
    );
    const userCreatedFieldsStartingIndex = nonUserCreatedFields.length;

    return (
      <div>
        <Segment.Group raised>
          {error.length > 0 &&
            map(error, (err) => (
              <Message
                icon="warning"
                key={err}
                negative
                attached
                header={this.props.intl.formatMessage(messages.error)}
                content={err}
              />
            ))}
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="tabs-schema-edit" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  role="tablist"
                  className="ui pointing secondary attached tabular menu"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {map(value.fieldsets, (item, index) => (
                    <SchemaWidgetFieldset
                      key={item.id}
                      title={item.title}
                      order={index}
                      active={index === this.state.currentFieldset}
                      onClick={this.onSetCurrentFieldset}
                      onShowEditFieldset={this.onShowEditFieldset}
                      onShowDeleteFieldset={this.onShowDeleteFieldset}
                      onOrderFieldset={this.onOrderFieldset}
                      getItemStyle={getItemStyle}
                    />
                  ))}
                  <div className="item item-add">
                    <button
                      aria-label={this.props.intl.formatMessage(messages.add)}
                      className="item ui noborder button"
                      onClick={this.onShowAddFieldset}
                    >
                      <Icon name="plus" size="large" />
                    </button>
                  </div>

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {map(nonUserCreatedFields, (field, index) => (
              <Field
                {...value.properties[field]}
                id={field}
                required={value.required.indexOf(field) !== -1}
                onEdit={this.onShowEditField}
                isDraggable={isUserCreated(value.properties[field])}
                isDissabled={!isUserCreated(value.properties[field])}
                order={index}
                onDelete={this.onShowDeleteField}
                onChange={this.onChangeDefaultValue}
                key={field}
                value={value.properties[field].default}
              />
            ))}
            <Droppable
              droppableId="fields-schema-edit"
              direction="vertical"
              type="fixed"
            >
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {map(userCreatedFields, (field, index) => (
                    <Draggable
                      draggableId={field}
                      index={userCreatedFieldsStartingIndex + index}
                      key={field}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={getItemStyle(
                            snapshot.isDragging,
                            provided.draggableProps.style,
                          )}
                        >
                          <Field
                            {...value.properties[field]}
                            id={field}
                            required={value.required.indexOf(field) !== -1}
                            onEdit={this.onShowEditField}
                            isDraggable={isUserCreated(value.properties[field])}
                            isDissabled={
                              !isUserCreated(value.properties[field])
                            }
                            order={index}
                            onDelete={this.onShowDeleteField}
                            onChange={this.onChangeDefaultValue}
                            key={field}
                            value={value.properties[field].default}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {value.fieldsets[this.state.currentFieldset].fields.indexOf(
            'changeNote',
          ) ? (
            <Field
              {...value.properties.changeNote}
              id={'changeNote'}
              required={value.required.indexOf('changeNote') !== -1}
              onEdit={this.onShowEditField}
              isDraggable={isUserCreated(value.properties.changeNote)}
              isDissabled={!isUserCreated(value.properties.changeNote)}
              order={value.fieldsets[this.state.currentFieldset].length - 1}
              onDelete={this.onShowDeleteField}
              onChange={this.onChangeDefaultValue}
              key={'changeNote'}
              value={value.properties.changeNote.default}
            />
          ) : null}

          <Form.Field inline>
            <Grid>
              <Grid.Row stretched>
                <Grid.Column width="12">
                  <div className="wrapper">
                    <label htmlFor="addfield">Add new field</label>
                  </div>
                  <div className="toolbar">
                    <button
                      aria-label={this.props.intl.formatMessage(messages.add)}
                      id="addfield"
                      className="item ui noborder button"
                      onClick={this.onShowAddField}
                    >
                      <Icon name="plus" color="blue" size="large" />
                    </button>
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form.Field>
        </Segment.Group>
        {this.state.addField !== null && (
          <ModalForm
            onSubmit={this.onAddField}
            onCancel={this.onCancel}
            title={this.props.intl.formatMessage(messages.addField)}
            formData={{
              type: '',
              id: '',
              title: '',
            }}
            schema={{
              fieldsets: [
                {
                  id: 'default',
                  title: this.props.intl.formatMessage(messages.default),
                  fields: ['type', 'title', 'id', 'description', 'required'],
                },
              ],
              properties: {
                type: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.type),
                  choices: [
                    ['text', this.props.intl.formatMessage(messages.string)],
                    ['textarea', this.props.intl.formatMessage(messages.text)],
                    [
                      'wysiwyg',
                      this.props.intl.formatMessage(messages.richtext),
                    ],
                    [
                      'checkbox',
                      this.props.intl.formatMessage(messages.checkbox),
                    ],
                    [
                      'selection',
                      this.props.intl.formatMessage(messages.selection),
                    ],
                  ],
                },
                id: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.idTitle),
                  description: this.props.intl.formatMessage(
                    messages.idDescription,
                  ),
                },
                title: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.title),
                },
                description: {
                  type: 'string',
                  widget: 'textarea',
                  title: this.props.intl.formatMessage(messages.description),
                },
                required: {
                  type: 'boolean',
                  title: this.props.intl.formatMessage(messages.required),
                },
              },
              required: ['type', 'id', 'title'],
            }}
          />
        )}
        {this.state.addFieldset !== null && (
          <ModalForm
            onSubmit={this.onAddFieldset}
            onCancel={this.onCancel}
            title={this.props.intl.formatMessage(messages.addFieldset)}
            formData={{
              id: '',
              title: '',
            }}
            schema={{
              fieldsets: [
                {
                  id: 'default',
                  title: this.props.intl.formatMessage(messages.default),
                  fields: ['title', 'id'],
                },
              ],
              properties: {
                id: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.idTitle),
                  description: this.props.intl.formatMessage(
                    messages.idDescription,
                  ),
                },
                title: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.title),
                },
              },
              required: ['id', 'title'],
            }}
          />
        )}
        {this.state.editField !== null && (
          <ModalForm
            onSubmit={this.onEditField}
            onCancel={this.onCancel}
            title={this.props.intl.formatMessage(messages.editField)}
            formData={{
              ...this.props.value.properties[this.state.editField.id],
              id: this.state.editField.id,
              required:
                this.props.value.required.indexOf(this.state.editField.id) !==
                -1,
            }}
            schema={this.state.editField.schema}
          />
        )}
        {this.state.editFieldset !== null && (
          <ModalForm
            onSubmit={this.onEditFieldset}
            onCancel={this.onCancel}
            title={this.props.intl.formatMessage(messages.editFieldset)}
            formData={{
              id: this.props.value.fieldsets[this.state.editFieldset].id,
              title: this.props.value.fieldsets[this.state.editFieldset].title,
            }}
            schema={{
              fieldsets: [
                {
                  id: 'default',
                  title: this.props.intl.formatMessage(messages.default),
                  fields: ['title', 'id'],
                },
              ],
              properties: {
                id: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.idTitle),
                  description: this.props.intl.formatMessage(
                    messages.idDescription,
                  ),
                },
                title: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.title),
                },
              },
              required: ['id', 'title'],
            }}
          />
        )}
        {this.state.deleteFieldset !== null && (
          <Confirm
            open
            content={this.props.intl.formatMessage(messages.deleteFieldset)}
            onCancel={this.onCancel}
            onConfirm={this.onDeleteFieldset}
          />
        )}
        {this.state.deleteField !== null && (
          <Confirm
            open
            content={this.props.intl.formatMessage(messages.deleteField)}
            onCancel={this.onCancel}
            onConfirm={this.onDeleteField}
          />
        )}
      </div>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => ({
      value: JSON.parse(props.value),
      fieldSchema: state.fieldSchema.fieldSchema,
    }),
    {
      getFieldSchema,
    },
  ),
)(SchemaWidget);
