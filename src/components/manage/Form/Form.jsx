/**
 * Form component.
 * @module components/manage/Form/Form
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  findIndex,
  isEmpty,
  keys,
  map,
  mapValues,
  omit,
  pickBy,
  uniq,
  without,
} from 'lodash';
import move from 'lodash-move';
import isBoolean from 'lodash/isBoolean';
import {
  Button,
  Container,
  Form as UiForm,
  Segment,
  Tab,
  Message,
} from 'semantic-ui-react';
import { defineMessages, injectIntl } from 'react-intl';
import { v4 as uuid } from 'uuid';
import { Portal } from 'react-portal';

import { EditBlock, Icon, Field } from '@plone/volto/components';
import { settings } from '~/config';
import dragSVG from '@plone/volto/icons/drag.svg';

import {
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  difference,
  blockHasValue,
} from '@plone/volto/helpers';

import aheadSVG from '@plone/volto/icons/ahead.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const messages = defineMessages({
  addBlock: {
    id: 'Add block…',
    defaultMessage: 'Add block…',
  },
  required: {
    id: 'Required input is missing.',
    defaultMessage: 'Required input is missing.',
  },
  minLength: {
    id: 'Minimum length is {len}.',
    defaultMessage: 'Minimum length is {len}.',
  },
  uniqueItems: {
    id: 'Items must be unique.',
    defaultMessage: 'Items must be unique.',
  },
  save: {
    id: 'Save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'Cancel',
    defaultMessage: 'Cancel',
  },
  error: {
    id: 'Error',
    defaultMessage: 'Error',
  },
  thereWereSomeErrors: {
    id: 'There were some errors.',
    defaultMessage: 'There were some errors.',
  },
});

/**
 * Form container class.
 * @class Form
 * @extends Component
 */
class Form extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    schema: PropTypes.shape({
      fieldsets: PropTypes.arrayOf(
        PropTypes.shape({
          fields: PropTypes.arrayOf(PropTypes.string),
          id: PropTypes.string,
          title: PropTypes.string,
        }),
      ),
      properties: PropTypes.objectOf(PropTypes.any),
      definitions: PropTypes.objectOf(PropTypes.any),
      required: PropTypes.arrayOf(PropTypes.string),
    }),
    formData: PropTypes.objectOf(PropTypes.any),
    pathname: PropTypes.string,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    submitLabel: PropTypes.string,
    resetAfterSubmit: PropTypes.bool,
    isEditForm: PropTypes.bool,
    title: PropTypes.string,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
    loading: PropTypes.bool,
    hideActions: PropTypes.bool,
    description: PropTypes.string,
    visual: PropTypes.bool,
    blocks: PropTypes.arrayOf(PropTypes.object),
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    formData: null,
    onSubmit: null,
    onCancel: null,
    submitLabel: null,
    resetAfterSubmit: false,
    isEditForm: false,
    title: null,
    description: null,
    error: null,
    loading: null,
    hideActions: false,
    visual: false,
    blocks: [],
    pathname: '',
    schema: {},
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Form
   */
  constructor(props) {
    super(props);
    const ids = {
      title: uuid(),
      text: uuid(),
    };
    let { formData } = props;
    const blocksFieldname = getBlocksFieldname(formData);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);

    if (!props.isEditForm) {
      // It's a normal (add form), get defaults from schema
      formData = {
        ...mapValues(props.schema.properties, 'default'),
        ...formData,
      };
    }
    // defaults for block editor; should be moved to schema on server side
    // Adding fallback in case the fields are empty, so we are sure that the edit form
    // shows at least the default blocks
    if (
      formData.hasOwnProperty(blocksFieldname) &&
      formData.hasOwnProperty(blocksLayoutFieldname)
    ) {
      if (
        !formData[blocksLayoutFieldname] ||
        isEmpty(formData[blocksLayoutFieldname].items)
      ) {
        formData[blocksLayoutFieldname] = {
          items: [ids.title, ids.text],
        };
      }
      if (!formData[blocksFieldname] || isEmpty(formData[blocksFieldname])) {
        formData[blocksFieldname] = {
          [ids.title]: {
            '@type': 'title',
          },
          [ids.text]: {
            '@type': settings.defaultBlockType,
          },
        };
      }
    }
    this.state = {
      formData,
      initialFormData: { ...formData },
      errors: {},
      selected:
        formData.hasOwnProperty(blocksLayoutFieldname) &&
        formData[blocksLayoutFieldname].items.length > 0
          ? formData[blocksLayoutFieldname].items[0]
          : null,
      placeholderProps: {},
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onChangeBlock = this.onChangeBlock.bind(this);
    this.onMutateBlock = this.onMutateBlock.bind(this);
    this.onSelectBlock = this.onSelectBlock.bind(this);
    this.onDeleteBlock = this.onDeleteBlock.bind(this);
    this.onAddBlock = this.onAddBlock.bind(this);
    this.onMoveBlock = this.onMoveBlock.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onFocusPreviousBlock = this.onFocusPreviousBlock.bind(this);
    this.onFocusNextBlock = this.onFocusNextBlock.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Change field handler
   * @method onChangeField
   * @param {string} id Id of the field
   * @param {*} value Value of the field
   * @returns {undefined}
   */
  onChangeField(id, value) {
    this.setState({
      formData: {
        ...this.state.formData,
        // We need to catch also when the value equals false this fixes #888
        [id]: value || (value !== undefined && isBoolean(value)) ? value : null,
      },
    });
  }

  hideHandler = (data) => {
    return !blockHasValue(data);
  };

  /**
   * Change block handler
   * @method onChangeBlock
   * @param {string} id Id of the block
   * @param {*} value Value of the field
   * @returns {undefined}
   */
  onChangeBlock(id, value) {
    const blocksFieldname = getBlocksFieldname(this.state.formData);
    this.setState({
      formData: {
        ...this.state.formData,
        [blocksFieldname]: {
          ...this.state.formData[blocksFieldname],
          [id]: value || null,
        },
      },
    });
  }

  /**
   * Change block handler
   * @method onMutateBlock
   * @param {string} id Id of the block
   * @param {*} value Value of the field
   * @returns {undefined}
   */
  onMutateBlock(id, value) {
    const idTrailingBlock = uuid();
    const blocksFieldname = getBlocksFieldname(this.state.formData);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);
    const index =
      this.state.formData[blocksLayoutFieldname].items.indexOf(id) + 1;

    this.setState({
      formData: {
        ...this.state.formData,
        [blocksFieldname]: {
          ...this.state.formData[blocksFieldname],
          [id]: value || null,
          [idTrailingBlock]: {
            '@type': settings.defaultBlockType,
          },
        },
        [blocksLayoutFieldname]: {
          items: [
            ...this.state.formData[blocksLayoutFieldname].items.slice(0, index),
            idTrailingBlock,
            ...this.state.formData[blocksLayoutFieldname].items.slice(index),
          ],
        },
      },
    });
  }

  /**
   * Select block handler
   * @method onSelectBlock
   * @param {string} id Id of the field
   * @returns {undefined}
   */
  onSelectBlock(id) {
    this.setState({
      selected: id,
    });
  }

  /**
   * Delete block handler
   * @method onDeleteBlock
   * @param {string} id Id of the field
   * @param {bool} selectPrev True if previous should be selected
   * @returns {undefined}
   */
  onDeleteBlock(id, selectPrev) {
    const blocksFieldname = getBlocksFieldname(this.state.formData);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);

    this.setState({
      formData: {
        ...this.state.formData,
        [blocksLayoutFieldname]: {
          items: without(this.state.formData[blocksLayoutFieldname].items, id),
        },
        [blocksFieldname]: omit(this.state.formData[blocksFieldname], [id]),
      },
      selected: selectPrev
        ? this.state.formData[blocksLayoutFieldname].items[
            this.state.formData[blocksLayoutFieldname].items.indexOf(id) - 1
          ]
        : null,
    });
  }

  /**
   * Add block handler
   * @method onAddBlock
   * @param {string} type Type of the block
   * @param {Number} index Index where to add the block
   * @returns {string} Id of the block
   */
  onAddBlock(type, index) {
    const id = uuid();
    const idTrailingBlock = uuid();
    const blocksFieldname = getBlocksFieldname(this.state.formData);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);
    const totalItems = this.state.formData[blocksLayoutFieldname].items.length;
    const insert = index === -1 ? totalItems : index;

    this.setState({
      formData: {
        ...this.state.formData,
        [blocksLayoutFieldname]: {
          items: [
            ...this.state.formData[blocksLayoutFieldname].items.slice(
              0,
              insert,
            ),
            id,
            ...(type !== settings.defaultBlockType ? [idTrailingBlock] : []),
            ...this.state.formData[blocksLayoutFieldname].items.slice(insert),
          ],
        },
        [blocksFieldname]: {
          ...this.state.formData[blocksFieldname],
          [id]: {
            '@type': type,
          },
          ...(type !== settings.defaultBlockType && {
            [idTrailingBlock]: {
              '@type': settings.defaultBlockType,
            },
          }),
        },
      },
      selected: id,
    });

    return id;
  }

  /**
   * Submit handler
   * @method onSubmit
   * @param {Object} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }
    const errors = {};
    map(this.props.schema.fieldsets, (fieldset) =>
      map(fieldset.fields, (fieldId) => {
        const field = this.props.schema.properties[fieldId];
        var data = this.state.formData[fieldId];
        if (typeof data === 'string' || data instanceof String) {
          data = data.trim();
        }
        if (this.props.schema.required.indexOf(fieldId) !== -1) {
          if (field.type !== 'boolean' && !data) {
            errors[fieldId] = errors[field] || [];
            errors[fieldId].push(
              this.props.intl.formatMessage(messages.required),
            );
          }
          if (field.minLength && data.length < field.minLength) {
            errors[fieldId] = errors[field] || [];
            errors[fieldId].push(
              this.props.intl.formatMessage(messages.minLength, {
                len: field.minLength,
              }),
            );
          }
        }
        if (field.uniqueItems && data && uniq(data).length !== data.length) {
          errors[fieldId] = errors[field] || [];
          errors[fieldId].push(
            this.props.intl.formatMessage(messages.uniqueItems),
          );
        }
      }),
    );
    if (keys(errors).length > 0) {
      this.setState({
        errors,
      });
    } else {
      // Get only the values that have been modified (Edit forms), send all in case that
      // it's an add form
      if (this.props.isEditForm) {
        this.props.onSubmit(this.getOnlyFormModifiedValues());
      } else {
        this.props.onSubmit(this.state.formData);
      }
      if (this.props.resetAfterSubmit) {
        this.setState({
          formData: this.props.formData,
        });
      }
    }
  }

  /**
   * getOnlyFormModifiedValues handler
   * It returns only the values of the fields that are have really changed since the
   * form was loaded. Useful for edit forms and PATCH operations, when we only want to
   * send the changed data.
   * @method getOnlyFormModifiedValues
   * @param {Object} event Event object.
   * @returns {undefined}
   */
  getOnlyFormModifiedValues = () => {
    const fieldsModified = Object.keys(
      difference(this.state.formData, this.state.initialFormData),
    );
    return pickBy(this.state.formData, (value, key) =>
      fieldsModified.includes(key),
    );
  };

  /**
   * Move block handler
   * @method onMoveBlock
   * @param {number} dragIndex Drag index.
   * @param {number} hoverIndex Hover index.
   * @returns {undefined}
   */
  onMoveBlock(dragIndex, hoverIndex) {
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);

    this.setState({
      formData: {
        ...this.state.formData,
        [blocksLayoutFieldname]: {
          items: move(
            this.state.formData[blocksLayoutFieldname].items,
            dragIndex,
            hoverIndex,
          ),
        },
      },
    });
  }

  /**
   *
   * @method onFocusPreviousBlock
   * @param {string} currentBlock The id of the current block
   * @param {node} blockNode The id of the current block
   * @returns {undefined}
   */
  onFocusPreviousBlock(currentBlock, blockNode) {
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);
    const currentIndex = this.state.formData[
      blocksLayoutFieldname
    ].items.indexOf(currentBlock);

    if (currentIndex === 0) {
      // We are already at the top block don't do anything
      return;
    }
    const newindex = currentIndex - 1;
    blockNode.blur();

    this.onSelectBlock(
      this.state.formData[blocksLayoutFieldname].items[newindex],
    );
  }

  /**
   *
   * @method onFocusNextBlock
   * @param {string} currentBlock The id of the current block
   * @param {node} blockNode The id of the current block
   * @returns {undefined}
   */
  onFocusNextBlock(currentBlock, blockNode) {
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);
    const currentIndex = this.state.formData[
      blocksLayoutFieldname
    ].items.indexOf(currentBlock);

    if (
      currentIndex ===
      this.state.formData[blocksLayoutFieldname].items.length - 1
    ) {
      // We are already at the bottom block don't do anything
      return;
    }

    const newindex = currentIndex + 1;
    blockNode.blur();

    this.onSelectBlock(
      this.state.formData[blocksLayoutFieldname].items[newindex],
    );
  }

  /**
   * handleKeyDown, sports a way to disable the listeners via an options named
   * parameter
   * @method handleKeyDown
   * @param {object} e Event
   * @param {number} index Block index
   * @param {string} block Block type
   * @param {node} node The block node
   * @returns {undefined}
   */
  handleKeyDown(
    e,
    index,
    block,
    node,
    {
      disableEnter = false,
      disableArrowUp = false,
      disableArrowDown = false,
    } = {},
  ) {
    if (e.key === 'ArrowUp' && !disableArrowUp) {
      this.onFocusPreviousBlock(block, node);
      e.preventDefault();
    }
    if (e.key === 'ArrowDown' && !disableArrowDown) {
      this.onFocusNextBlock(block, node);
      e.preventDefault();
    }
    if (e.key === 'Enter' && !disableEnter) {
      this.onAddBlock(settings.defaultBlockType, index + 1);
      e.preventDefault();
    }
  }

  /**
   * Removed blocks and blocks_layout fields from the form.
   * @method removeBlocksLayoutFields
   * @param {object} schema The schema definition of the form.
   * @returns A modified copy of the given schema.
   */
  removeBlocksLayoutFields = (schema) => {
    const newSchema = { ...schema };
    const layoutFieldsetIndex = findIndex(
      newSchema.fieldsets,
      (fieldset) => fieldset.id === 'layout',
    );
    if (layoutFieldsetIndex > -1) {
      const layoutFields = newSchema.fieldsets[layoutFieldsetIndex].fields;
      newSchema.fieldsets[layoutFieldsetIndex].fields = layoutFields.filter(
        (field) => field !== 'blocks' && field !== 'blocks_layout',
      );
      if (newSchema.fieldsets[layoutFieldsetIndex].fields.length === 0) {
        newSchema.fieldsets = [
          ...newSchema.fieldsets.slice(0, layoutFieldsetIndex),
          ...newSchema.fieldsets.slice(layoutFieldsetIndex + 1),
        ];
      }
    }
    return newSchema;
  };

  onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) {
      return;
    }
    const blocksLayoutFieldname = getBlocksLayoutFieldname(this.state.formData);
    this.setState({
      placeholderProps: {},
    });
    this.setState({
      formData: {
        ...this.state.formData,
        [blocksLayoutFieldname]: {
          items: move(
            this.state.formData[blocksLayoutFieldname].items,
            source.index,
            destination.index,
          ),
        },
      },
    });
  };

  handleDragStart = (event) => {
    const queryAttr = 'data-rbd-draggable-id';
    const domQuery = `[${queryAttr}='${event.draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }

    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = event.source.index;
    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      [...draggedDOM.parentNode.children]
        .slice(0, sourceIndex)
        .reduce((total, curr) => {
          const style = curr.currentStyle || window.getComputedStyle(curr);
          const marginBottom = parseFloat(style.marginBottom);
          return total + curr.clientHeight + marginBottom;
        }, 0);

    this.setState({
      placeholderProps: {
        clientHeight,
        clientWidth,
        clientY,
        clientX: parseFloat(
          window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
        ),
      },
    });
  };

  onDragUpdate = (update) => {
    if (!update.destination) {
      return;
    }
    const draggableId = update.draggableId;
    const destinationIndex = update.destination.index;

    const queryAttr = 'data-rbd-draggable-id';
    const domQuery = `[${queryAttr}='${draggableId}']`;
    const draggedDOM = document.querySelector(domQuery);

    if (!draggedDOM) {
      return;
    }
    const { clientHeight, clientWidth } = draggedDOM;
    const sourceIndex = update.source.index;
    const childrenArray = [...draggedDOM.parentNode.children];
    const movedItem = childrenArray[sourceIndex];
    childrenArray.splice(sourceIndex, 1);

    const updatedArray = [
      ...childrenArray.slice(0, destinationIndex),
      movedItem,
      ...childrenArray.slice(destinationIndex + 1),
    ];

    var clientY =
      parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) +
      updatedArray.slice(0, destinationIndex).reduce((total, curr) => {
        const style = curr.currentStyle || window.getComputedStyle(curr);
        const marginBottom = parseFloat(style.marginBottom);
        return total + curr.clientHeight + marginBottom;
      }, 0);

    this.setState({
      placeholderProps: {
        clientHeight,
        clientWidth,
        clientY,
        clientX: parseFloat(
          window.getComputedStyle(draggedDOM.parentNode).paddingLeft,
        ),
      },
    });
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { schema: originalSchema, onCancel, onSubmit } = this.props;
    const { formData, placeholderProps } = this.state;
    const blocksFieldname = getBlocksFieldname(formData);
    const blocksLayoutFieldname = getBlocksLayoutFieldname(formData);
    const renderBlocks = formData?.[blocksLayoutFieldname]?.items;
    const blocksDict = formData?.[blocksFieldname];
    const schema = this.removeBlocksLayoutFields(originalSchema);

    return this.props.visual ? (
      // Removing this from SSR is important, since react-beautiful-dnd supports SSR,
      // but draftJS don't like it much and the hydration gets messed up
      !__SERVER__ && (
        <div className="ui container">
          <DragDropContext
            onDragEnd={this.onDragEnd}
            onDragStart={this.handleDragStart}
            onDragUpdate={this.onDragUpdate}
          >
            <Droppable droppableId="edit-form">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ position: 'relative' }}
                >
                  {map(renderBlocks, (block, index) => (
                    <Draggable draggableId={block} index={index} key={block}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`block-editor-${blocksDict[block]['@type']}`}
                        >
                          <div style={{ position: 'relative' }}>
                            <div
                              style={{
                                visibility:
                                  this.state.selected === block &&
                                  !this.hideHandler(blocksDict[block])
                                    ? 'visible'
                                    : 'hidden',
                                display: 'inline-block',
                              }}
                              {...provided.dragHandleProps}
                              className="drag handle wrapper"
                            >
                              <Icon name={dragSVG} size="18px" />
                            </div>

                            <EditBlock
                              id={block}
                              index={index}
                              type={blocksDict[block]['@type']}
                              key={block}
                              handleKeyDown={this.handleKeyDown}
                              onAddBlock={this.onAddBlock}
                              onChangeBlock={this.onChangeBlock}
                              onMutateBlock={this.onMutateBlock}
                              onChangeField={this.onChangeField}
                              onDeleteBlock={this.onDeleteBlock}
                              onSelectBlock={this.onSelectBlock}
                              onMoveBlock={this.onMoveBlock}
                              onFocusPreviousBlock={this.onFocusPreviousBlock}
                              onFocusNextBlock={this.onFocusNextBlock}
                              properties={formData}
                              data={blocksDict[block]}
                              pathname={this.props.pathname}
                              block={block}
                              selected={this.state.selected === block}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {!isEmpty(placeholderProps) && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${placeholderProps.clientY}px`,
                        height: `${placeholderProps.clientHeight + 18}px`,
                        background: '#eee',
                        width: `${placeholderProps.clientWidth}px`,
                        borderRadius: '3px',
                      }}
                    />
                  )}
                </div>
              )}
            </Droppable>
            <Portal
              node={__CLIENT__ && document.getElementById('sidebar-metadata')}
            >
              <UiForm
                method="post"
                onSubmit={this.onSubmit}
                error={keys(this.state.errors).length > 0}
              >
                {schema &&
                  map(schema.fieldsets, (item) => [
                    <Segment secondary attached key={item.title}>
                      {item.title}
                    </Segment>,
                    <Segment attached key={`fieldset-contents-${item.title}`}>
                      {map(item.fields, (field, index) => (
                        <Field
                          {...schema.properties[field]}
                          id={field}
                          focus={index === 0}
                          value={this.state.formData[field]}
                          required={schema.required.indexOf(field) !== -1}
                          onChange={this.onChangeField}
                          key={field}
                          error={this.state.errors[field]}
                        />
                      ))}
                    </Segment>,
                  ])}
              </UiForm>
            </Portal>
          </DragDropContext>
        </div>
      )
    ) : (
      <Container>
        <UiForm
          method="post"
          onSubmit={this.onSubmit}
          error={keys(this.state.errors).length > 0}
        >
          <Segment.Group raised>
            {schema && schema.fieldsets.length > 1 && (
              <Tab
                menu={{
                  secondary: true,
                  pointing: true,
                  attached: true,
                  tabular: true,
                  className: 'formtabs',
                }}
                panes={map(schema.fieldsets, (item) => ({
                  menuItem: item.title,
                  render: () => [
                    this.props.title && (
                      <Segment secondary attached key={this.props.title}>
                        {this.props.title}
                      </Segment>
                    ),
                    ...map(item.fields, (field, index) => (
                      <Field
                        {...schema.properties[field]}
                        id={field}
                        fieldSet={item.title.toLowerCase()}
                        focus={index === 0}
                        value={this.state.formData[field]}
                        required={schema.required.indexOf(field) !== -1}
                        onChange={this.onChangeField}
                        key={field}
                        error={this.state.errors[field]}
                      />
                    )),
                  ],
                }))}
              />
            )}
            {schema && schema.fieldsets.length === 1 && (
              <Segment>
                {this.props.title && (
                  <Segment className="primary">{this.props.title}</Segment>
                )}
                {this.props.description && (
                  <Segment secondary>{this.props.description}</Segment>
                )}
                {keys(this.state.errors).length > 0 && (
                  <Message
                    icon="warning"
                    negative
                    attached
                    header={this.props.intl.formatMessage(messages.error)}
                    content={this.props.intl.formatMessage(
                      messages.thereWereSomeErrors,
                    )}
                  />
                )}
                {this.props.error && (
                  <Message
                    icon="warning"
                    negative
                    attached
                    header={this.props.intl.formatMessage(messages.error)}
                    content={this.props.error.message}
                  />
                )}
                {map(schema.fieldsets[0].fields, (field, index) => (
                  <Field
                    {...schema.properties[field]}
                    id={field}
                    value={this.state.formData?.[field]}
                    required={schema.required.indexOf(field) !== -1}
                    onChange={this.onChangeField}
                    key={field}
                    focus={index === 0}
                    error={this.state.errors[field]}
                  />
                ))}
              </Segment>
            )}
            {!this.props.hideActions && (
              <Segment className="actions" clearing>
                {onSubmit && (
                  <Button
                    basic
                    primary
                    floated="right"
                    type="submit"
                    aria-label={
                      this.props.submitLabel
                        ? this.props.submitLabel
                        : this.props.intl.formatMessage(messages.save)
                    }
                    title={
                      this.props.submitLabel
                        ? this.props.submitLabel
                        : this.props.intl.formatMessage(messages.save)
                    }
                    loading={this.props.loading}
                  >
                    <Icon className="circled" name={aheadSVG} size="30px" />
                  </Button>
                )}
                {onCancel && (
                  <Button
                    basic
                    secondary
                    aria-label={this.props.intl.formatMessage(messages.cancel)}
                    title={this.props.intl.formatMessage(messages.cancel)}
                    floated="right"
                    onClick={onCancel}
                  >
                    <Icon className="circled" name={clearSVG} size="30px" />
                  </Button>
                )}
              </Segment>
            )}
          </Segment.Group>
        </UiForm>
      </Container>
    );
  }
}

export default injectIntl(Form, { forwardRef: true });
