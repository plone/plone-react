/**
 * Form component.
 * @module components/manage/Form/Form
 */

import { BlocksForm, Field, Icon, Toast } from '@plone/volto/components';
import {
  difference,
  FormValidation,
  getBlocksFieldname,
  getBlocksLayoutFieldname,
  messages,
} from '@plone/volto/helpers';
import aheadSVG from '@plone/volto/icons/ahead.svg';
import clearSVG from '@plone/volto/icons/clear.svg';
import {
  findIndex,
  isEmpty,
  keys,
  map,
  mapValues,
  pickBy,
  without,
  cloneDeep,
} from 'lodash';
import isBoolean from 'lodash/isBoolean';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Portal } from 'react-portal';
import {
  Button,
  Container,
  Form as UiForm,
  Message,
  Segment,
  Tab,
} from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import { BlocksToolbar } from '@plone/volto/components';
import config from '@plone/volto/registry';

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
    isAdminForm: PropTypes.bool,
    title: PropTypes.string,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
    loading: PropTypes.bool,
    hideActions: PropTypes.bool,
    description: PropTypes.string,
    visual: PropTypes.bool,
    blocks: PropTypes.arrayOf(PropTypes.object),
    isFormSelected: PropTypes.bool,
    onSelectForm: PropTypes.func,
    editable: PropTypes.bool,
    onChangeFormData: PropTypes.func,
    requestError: PropTypes.string,
    allowedBlocks: PropTypes.arrayOf(PropTypes.string),
    showRestricted: PropTypes.bool,
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
    isAdminForm: false,
    title: null,
    description: null,
    error: null,
    loading: null,
    hideActions: false,
    visual: false,
    blocks: [],
    pathname: '',
    schema: {},
    isFormSelected: true,
    onSelectForm: null,
    editable: true,
    requestError: null,
    allowedBlocks: null,
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
            '@type': config.settings.defaultBlockType,
          },
        };
      }
    }
    this.state = {
      formData,
      initialFormData: cloneDeep(formData),
      errors: {},
      selected:
        formData.hasOwnProperty(blocksLayoutFieldname) &&
        formData[blocksLayoutFieldname].items.length > 0
          ? formData[blocksLayoutFieldname].items[0]
          : null,
      multiSelected: [],
      isClient: false,
    };
    this.onChangeField = this.onChangeField.bind(this);
    this.onSelectBlock = this.onSelectBlock.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onClickInput = this.onClickInput.bind(this);
  }

  /**
   * On updates caused by props change
   * if errors from Backend come, these will be shown to their corresponding Fields
   * also the first Tab to have any errors will be selected
   * @param {Object} prevProps
   */
  async componentDidUpdate(prevProps, prevState) {
    let { requestError } = this.props;
    let errors = {};
    let activeIndex = 0;

    if (requestError && prevProps.requestError !== requestError) {
      errors = FormValidation.giveServerErrorsToCorrespondingFields(
        requestError,
      );
      activeIndex = FormValidation.showFirstTabWithErrors({
        errors,
        schema: this.props.schema,
      });

      this.setState({
        errors,
        activeIndex,
      });
    }

    if (this.props.onChangeFormData) {
      if (
        JSON.stringify(prevState?.formData) !==
        JSON.stringify(this.state.formData)
      ) {
        this.props.onChangeFormData(this.state.formData);
      }
    }
  }

  /**
   * Tab selection is done only by setting activeIndex in state
   */
  onTabChange(e, { activeIndex }) {
    this.setState({ activeIndex });
  }

  /**
   * If user clicks on input, the form will be not considered pristine
   * this will avoid onBlur effects without interraction with the form
   * @param {Object} e event
   */
  onClickInput(e) {
    this.setState({ isFormPristine: false });
  }

  /**
   * Validate fields on blur
   * @method onBlurField
   * @param {string} id Id of the field
   * @param {*} value Value of the field
   * @returns {undefined}
   */
  onBlurField(id, value) {
    if (!this.state.isFormPristine) {
      const errors = FormValidation.validateFieldsPerFieldset({
        schema: this.props.schema,
        formData: this.state.formData,
        formatMessage: this.props.intl.formatMessage,
      });

      this.setState({
        errors,
      });
    }
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.setState({ isClient: true });
  }

  static getDerivedStateFromProps(props, state) {
    let newState = { ...state };
    if (!props.isFormSelected) {
      newState.selected = null;
    }

    return newState;
  }

  /**
   * Change field handler
   * Remove errors for changed field
   * @method onChangeField
   * @param {string} id Id of the field
   * @param {*} value Value of the field
   * @returns {undefined}
   */
  onChangeField(id, value) {
    this.setState((prevState) => {
      const { errors, formData } = prevState;
      delete errors[id];
      return {
        errors,
        formData: {
          ...formData,
          // We need to catch also when the value equals false this fixes #888
          [id]:
            value || (value !== undefined && isBoolean(value)) ? value : null,
        },
      };
    });
  }

  /**
   * Select block handler
   * @method onSelectBlock
   * @param {string} id Id of the field
   * @param {string} isMultipleSelection true if multiple blocks are selected
   * @returns {undefined}
   */
  onSelectBlock(id, isMultipleSelection, event) {
    let multiSelected = [];
    let selected = id;

    if (isMultipleSelection) {
      selected = null;
      const blocksLayoutFieldname = getBlocksLayoutFieldname(
        this.state.formData,
      );

      const blocks_layout = this.state.formData[blocksLayoutFieldname].items;

      if (event.shiftKey) {
        const anchor =
          this.state.multiSelected.length > 0
            ? blocks_layout.indexOf(this.state.multiSelected[0])
            : blocks_layout.indexOf(this.state.selected);
        const focus = blocks_layout.indexOf(id);

        if (anchor === focus) {
          multiSelected = [id];
        } else if (focus > anchor) {
          multiSelected = [...blocks_layout.slice(anchor, focus + 1)];
        } else {
          multiSelected = [...blocks_layout.slice(focus, anchor + 1)];
        }
      }

      if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
        multiSelected = this.state.multiSelected || [];
        if (!this.state.multiSelected.includes(this.state.selected)) {
          multiSelected = [...multiSelected, this.state.selected];
          selected = null;
        }
        if (this.state.multiSelected.includes(id)) {
          selected = null;
          multiSelected = without(multiSelected, id);
        } else {
          multiSelected = [...multiSelected, id];
        }
      }
    }

    this.setState({
      selected,
      multiSelected,
    });

    if (this.props.onSelectForm) {
      if (event) event.nativeEvent.stopImmediatePropagation();
      this.props.onSelectForm();
    }
  }

  /**
   * Cancel handler
   * It prevents event from triggering submit, reset form if props.resetAfterSubmit
   * and calls this.props.onCancel
   * @method onCancel
   * @param {Object} event Event object.
   * @returns {undefined}
   */
  onCancel(event) {
    if (event) {
      event.preventDefault();
    }
    if (this.props.resetAfterSubmit) {
      this.setState({
        formData: this.props.formData,
      });
    }
    this.props.onCancel(event);
  }

  /**
   * Submit handler also validate form and collect errors
   * @method onSubmit
   * @param {Object} event Event object.
   * @returns {undefined}
   */
  onSubmit(event) {
    if (event) {
      event.preventDefault();
    }

    const errors = FormValidation.validateFieldsPerFieldset({
      schema: this.props.schema,
      formData: this.state.formData,
      formatMessage: this.props.intl.formatMessage,
    });

    if (keys(errors).length > 0) {
      const activeIndex = FormValidation.showFirstTabWithErrors({
        errors,
        schema: this.props.schema,
      });
      this.setState(
        {
          errors,
          activeIndex,
        },
        () => {
          Object.keys(errors).forEach((err) =>
            toast.error(
              <Toast error title={err} content={errors[err].join(', ')} />,
            ),
          );
        },
      );
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
    return {
      ...pickBy(this.state.formData, (value, key) =>
        fieldsModified.includes(key),
      ),
      ...(this.state.formData['@static_behaviors'] && {
        '@static_behaviors': this.state.formData['@static_behaviors'],
      }),
    };
  };

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

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { settings } = config;
    const { schema: originalSchema, onCancel, onSubmit } = this.props;
    const { formData } = this.state;
    const schema = this.removeBlocksLayoutFields(originalSchema);

    return this.props.visual ? (
      // Removing this from SSR is important, since react-beautiful-dnd supports SSR,
      // but draftJS don't like it much and the hydration gets messed up
      this.state.isClient && (
        <div className="ui container">
          <BlocksToolbar
            formData={this.state.formData}
            selectedBlock={this.state.selected}
            selectedBlocks={this.state.multiSelected || []}
            onChangeBlocks={(newBlockData) =>
              this.setState({
                formData: {
                  ...formData,
                  ...newBlockData,
                },
              })
            }
            onSetSelectedBlocks={(blockIds) =>
              this.setState({ multiSelected: blockIds })
            }
            onSelectBlock={this.onSelectBlock}
          />
          <BlocksForm
            onChangeFormData={(newFormData) =>
              this.setState({
                formData: {
                  ...formData,
                  ...newFormData,
                },
              })
            }
            onChangeField={this.onChangeField}
            onSelectBlock={this.onSelectBlock}
            properties={formData}
            pathname={this.props.pathname}
            selectedBlock={this.state.selected}
            multiSelected={this.state.multiSelected}
            manage={this.props.isAdminForm}
            allowedBlocks={this.props.allowedBlocks}
            showRestricted={this.props.showRestricted}
            editable={this.props.editable}
            isMainForm={this.props.editable}
          />
          {this.state.isClient && this.props.editable && (
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
                          fieldSet={item.title.toLowerCase()}
                          formData={this.state.formData}
                          focus={false}
                          value={this.state.formData?.[field]}
                          required={schema.required.indexOf(field) !== -1}
                          onChange={this.onChangeField}
                          onBlur={this.onBlurField}
                          onClick={this.onClickInput}
                          key={field}
                          error={this.state.errors[field]}
                        />
                      ))}
                    </Segment>,
                  ])}
              </UiForm>
            </Portal>
          )}
        </div>
      )
    ) : (
      <Container>
        <UiForm
          method="post"
          onSubmit={this.onSubmit}
          error={keys(this.state.errors).length > 0}
          className={settings.verticalFormTabs ? 'vertical-form' : ''}
        >
          <fieldset className="invisible" disabled={!this.props.editable}>
            <Segment.Group raised>
              {schema && schema.fieldsets.length > 1 && (
                <>
                  {settings.verticalFormTabs && this.props.title && (
                    <Segment secondary attached key={this.props.title}>
                      {this.props.title}
                    </Segment>
                  )}
                  <Tab
                    menu={{
                      secondary: true,
                      pointing: true,
                      attached: true,
                      tabular: true,
                      className: 'formtabs',
                      vertical: settings.verticalFormTabs,
                    }}
                    grid={{ paneWidth: 9, tabWidth: 3, stackable: true }}
                    onTabChange={this.onTabChange}
                    activeIndex={this.state.activeIndex}
                    panes={map(schema.fieldsets, (item) => ({
                      menuItem: item.title,
                      render: () => [
                        !settings.verticalFormTabs && this.props.title && (
                          <Segment secondary attached key={this.props.title}>
                            {this.props.title}
                          </Segment>
                        ),
                        ...map(item.fields, (field, index) => (
                          <Field
                            {...schema.properties[field]}
                            id={field}
                            formData={this.state.formData}
                            fieldSet={item.title.toLowerCase()}
                            focus={index === 0}
                            value={this.state.formData?.[field]}
                            required={schema.required.indexOf(field) !== -1}
                            onChange={this.onChangeField}
                            onBlur={this.onBlurField}
                            onClick={this.onClickInput}
                            key={field}
                            error={this.state.errors[field]}
                          />
                        )),
                      ],
                    }))}
                  />
                </>
              )}
              {schema && schema.fieldsets.length === 1 && (
                <Segment>
                  {this.props.title && (
                    <Segment className="primary">
                      <h1 style={{ fontSize: '16px' }}> {this.props.title}</h1>
                    </Segment>
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
                  {map(schema.fieldsets[0].fields, (field) => (
                    <Field
                      {...schema.properties[field]}
                      id={field}
                      value={this.state.formData?.[field]}
                      required={schema.required.indexOf(field) !== -1}
                      onChange={this.onChangeField}
                      onBlur={this.onBlurField}
                      onClick={this.onClickInput}
                      key={field}
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
                      aria-label={this.props.intl.formatMessage(
                        messages.cancel,
                      )}
                      title={this.props.intl.formatMessage(messages.cancel)}
                      floated="right"
                      onClick={this.onCancel}
                    >
                      <Icon className="circled" name={clearSVG} size="30px" />
                    </Button>
                  )}
                </Segment>
              )}
            </Segment.Group>
          </fieldset>
        </UiForm>
      </Container>
    );
  }
}

export default injectIntl(Form, { forwardRef: true });
