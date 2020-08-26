/**
 * QuerystringWidget component.
 * @module components/manage/Widgets/QuerystringWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import {
  Button,
  Form,
  Grid,
  Icon as OldIcon,
  Input,
  Label,
} from 'semantic-ui-react';
import { filter, remove, toPairs, groupBy, isEmpty, map } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { getQuerystring } from '@plone/volto/actions';
import { Icon } from '@plone/volto/components';
import { format, parse } from 'date-fns';
import loadable from '@loadable/component';

import clearSVG from '@plone/volto/icons/clear.svg';

import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

const Select = loadable(() => import('react-select'));

const messages = defineMessages({
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
  selectCriteria: {
    id: 'Select criteria',
    defaultMessage: 'Select criteria',
  },
});

/**
 * QuerystringWidget component class.
 * @class QuerystringWidget
 * @extends Component
 */
export class QuerystringWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    required: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.array,
    focus: PropTypes.bool,
    onChange: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    getQuerystring: PropTypes.func.isRequired,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    error: [],
    value: null,
    onChange: null,
    onEdit: null,
    onDelete: null,
    focus: false,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs EditComponent
   */
  constructor(props) {
    super(props);
    this.state = {
      visual: false,
    };
    this.onChangeValue = this.onChangeValue.bind(this);
    this.getWidget = this.getWidget.bind(this);
  }

  /**
   * Component did mount lifecycle method
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    // Initialization of the query value since it's null from the schema, and it does not
    // get a default value of []
    if (this.props.value === null) {
      this.props.onChange(this.props.id, []);
    }
    if (this.props.focus) {
      this.node.focus();
    }
    this.props.getQuerystring();
  }

  /**
   * Get correct widget
   * @method getWidget
   * @param {Object} row Row object.
   * @param {number} index Row index.
   * @returns {Object} Widget.
   */
  getWidget(row, index) {
    const props = {
      fluid: true,
      value: row.v,
      onChange: (data) => this.onChangeValue(index, data.target.value),
    };
    const values = this.props.indexes[row.i].values;

    switch (this.props.indexes[row.i].operators[row.o].widget) {
      case null:
        return <span />;
      case 'DateWidget':
        return (
          <Form.Field width={4}>
            <Input
              type="date"
              {...props}
              value={format(parse(row.v), 'YYYY-MM-DD')}
            />
          </Form.Field>
        );
      case 'DateRangeWidget': // 2 date inputs
        return (
          <React.Fragment>
            <Form.Field width={2}>
              <Input
                type="date"
                {...props}
                value={format(parse(row.v[0]), 'YYYY-MM-DD')}
                onChange={(data) =>
                  this.onChangeValue(index, [data.target.value, row.v[1]])
                }
              />
            </Form.Field>
            <Form.Field width={2}>
              <Input
                type="date"
                {...props}
                value={format(parse(row.v[1]), 'YYYY-MM-DD')}
                onChange={(data) =>
                  this.onChangeValue(index, [row.v[0], data.target.value])
                }
              />
            </Form.Field>
          </React.Fragment>
        );
      case 'RelativeDateWidget':
        return (
          <Form.Field width={4}>
            <Input step={1} type="number" {...props} />
          </Form.Field>
        );
      case 'MultipleSelectionWidget':
        return (
          <Form.Field width={4}>
            <Select
              {...props}
              className="react-select-container"
              classNamePrefix="react-select"
              options={
                values
                  ? map(toPairs(values), (value) => ({
                      label: value[1].title,
                      value: value[0],
                    }))
                  : []
              }
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              onChange={(data) => {
                this.onChangeValue(
                  index,
                  map(data, (item) => item.value),
                );
              }}
              isMulti={true}
              value={map(row.v, (value) => ({
                label: values?.[value]?.title || value,
                value,
              }))}
            />
          </Form.Field>
        );
      case 'ReferenceWidget':
      default:
        return (
          <Form.Field width={4}>
            <Input {...props} />
          </Form.Field>
        );
    }
  }

  /**
   * Change value handler
   * @method onChangeValue
   * @param {Number} index Index of the row.
   * @param {String|Array} value Value of the row.
   * @returns {undefined}
   */
  onChangeValue(index, value) {
    this.props.onChange(
      this.props.id,
      map(this.props.value, (row, i) =>
        index === i
          ? {
              ...row,
              v: value,
            }
          : row,
      ),
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      id,
      title,
      required,
      description,
      error,
      value,
      onChange,
      onEdit,
      onDelete,
      indexes,
      intl,
    } = this.props;

    const schema = {
      fieldsets: [
        {
          id: 'default',
          title: intl.formatMessage(messages.default),
          fields: ['title', 'id', 'description', 'required'],
        },
      ],
      properties: {
        id: {
          type: 'string',
          title: intl.formatMessage(messages.idTitle),
          description: intl.formatMessage(messages.idDescription),
        },
        title: {
          type: 'string',
          title: intl.formatMessage(messages.title),
        },
        description: {
          type: 'string',
          widget: 'textarea',
          title: intl.formatMessage(messages.description),
        },
        required: {
          type: 'boolean',
          title: intl.formatMessage(messages.required),
        },
      },
      required: ['id', 'title'],
    };

    return (
      <Form.Field
        inline
        required={required}
        error={error.length > 0}
        className={description ? 'help' : ''}
      >
        <Grid>
          <Grid.Row stretched>
            <Grid.Column width="4">
              <div className="wrapper">
                <label htmlFor={`field-${id}`}>
                  {onEdit && (
                    <i
                      aria-hidden="true"
                      className="grey bars icon drag handle"
                    />
                  )}
                  {title}
                </label>
              </div>
            </Grid.Column>
            <Grid.Column width="8">
              {onEdit && (
                <div className="toolbar">
                  <button
                    onClick={() => onEdit(id, schema)}
                    className="item ui noborder button"
                  >
                    <OldIcon name="write square" size="large" color="blue" />
                  </button>
                  <button
                    onClick={() => onDelete(id)}
                    className="item ui noborder button"
                  >
                    <Icon name={clearSVG} size="24px" className="close" />
                  </button>
                </div>
              )}
              {indexes &&
                !isEmpty(indexes) &&
                map(value, (row, index) => (
                  <Form.Group key={index}>
                    <Form.Field width={4}>
                      <Select
                        id={`field-${id}`}
                        name={id}
                        disabled={onEdit !== null}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={map(
                          toPairs(
                            groupBy(toPairs(indexes), (item) => item[1].group),
                          ),
                          (group) => ({
                            label: group[0],
                            options: map(
                              filter(group[1], (item) => item[1].enabled),
                              (field) => ({
                                label: field[1].title,
                                value: field[0],
                              }),
                            ),
                          }),
                        )}
                        styles={customSelectStyles}
                        theme={selectTheme}
                        components={{ DropdownIndicator, Option }}
                        value={{
                          value: row.i,
                          label: indexes[row.i].title,
                        }}
                        onChange={(data) =>
                          onChange(
                            id,
                            map(value, (curRow, curIndex) =>
                              curIndex === index
                                ? {
                                    i: data.value,
                                    o: indexes[data.value].operations[0],
                                    v: '',
                                  }
                                : curRow,
                            ),
                          )
                        }
                      />
                    </Form.Field>
                    <Form.Field width="3">
                      <Select
                        id={`field-${id}`}
                        name={id}
                        disabled={onEdit !== null}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={map(
                          indexes[row.i].operations,
                          (operation) => ({
                            value: operation,
                            label: indexes[row.i].operators[operation].title,
                          }),
                        )}
                        styles={customSelectStyles}
                        theme={selectTheme}
                        components={{ DropdownIndicator, Option }}
                        value={{
                          value: row.o,
                          label: indexes[row.i].operators[row.o].title,
                        }}
                        onChange={(data) =>
                          onChange(
                            id,
                            map(value, (curRow, curIndex) =>
                              curIndex === index
                                ? {
                                    i: row.i,
                                    o: data.value,
                                    v: '',
                                  }
                                : curRow,
                            ),
                          )
                        }
                      />
                    </Form.Field>
                    {this.getWidget(row, index)}
                    <Button
                      onClick={(event) => {
                        onChange(
                          id,
                          remove(value, (v, i) => i !== index),
                        );
                        event.preventDefault();
                      }}
                      style={{
                        background: 'none',
                        paddingRight: 0,
                        paddingLeft: 0,
                      }}
                    >
                      <Icon name={clearSVG} size="24px" className="close" />
                    </Button>
                  </Form.Group>
                ))}
              <Form.Group>
                <Form.Field width={4}>
                  <Select
                    id={`field-${id}`}
                    name={id}
                    disabled={onEdit !== null}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder={this.props.intl.formatMessage(
                      messages.selectCriteria,
                    )}
                    options={map(
                      toPairs(
                        groupBy(toPairs(indexes), (item) => item[1].group),
                      ),
                      (group) => ({
                        label: group[0],
                        options: map(
                          filter(group[1], (item) => item[1].enabled),
                          (field) => ({
                            label: field[1].title,
                            value: field[0],
                          }),
                        ),
                      }),
                    )}
                    styles={customSelectStyles}
                    theme={selectTheme}
                    components={{ DropdownIndicator, Option }}
                    value={null}
                    onChange={(data) => {
                      onChange(id, [
                        ...(value || []),
                        {
                          i: data.value,
                          o: indexes[data.value].operations[0],
                          v: '',
                        },
                      ]);
                    }}
                  />
                </Form.Field>
              </Form.Group>
              {map(error, (message) => (
                <Label key={message} basic color="red" pointing>
                  {message}
                </Label>
              ))}
            </Grid.Column>
          </Grid.Row>
          {description && (
            <Grid.Row stretched>
              <Grid.Column stretched width="12">
                <p className="help">{description}</p>
              </Grid.Column>
            </Grid.Row>
          )}
        </Grid>
      </Form.Field>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      indexes: state.querystring.indexes,
    }),
    { getQuerystring },
  ),
)(QuerystringWidget);
