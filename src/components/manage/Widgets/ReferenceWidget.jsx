/**
 * ReferenceWidget component.
 * @module components/manage/Widgets/ReferenceWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Label, Dropdown, Popup, Icon } from 'semantic-ui-react';
import { compact, concat, fromPairs, map, values, uniqBy } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import { settings } from '~/config';
import { FormFieldWrapper } from '@plone/volto/components';
import { resetSearchContent, searchContent } from '@plone/volto/actions';

const messages = defineMessages({
  no_results_found: {
    id: 'No results found.',
    defaultMessage: 'No results found.',
  },
  no_value: {
    id: 'No value',
    defaultMessage: 'No value',
  },
});

/**
 * ReferenceWidget component class.
 * @class ReferenceWidget
 * @extends Component
 */
export class ReferenceWidget extends Component {
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
    multiple: PropTypes.bool,
    error: PropTypes.arrayOf(PropTypes.string),
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.object,
    ]),
    onChange: PropTypes.func.isRequired,
    resetSearchContent: PropTypes.func.isRequired,
    searchContent: PropTypes.func.isRequired,
    search: PropTypes.arrayOf(
      PropTypes.shape({
        '@id': PropTypes.string,
        '@type': PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
      }),
    ),
    wrapped: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    error: [],
    search: [],
    value: null,
    multiple: true,
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Actions
   */
  constructor(props) {
    super(props);
    this.onSearchChange = this.onSearchChange.bind(this);

    this.state = {
      choices: props.value
        ? props.multiple
          ? fromPairs(
              map(props.value, (value) => [
                value['@id'],
                {
                  key: value['@id'],
                  text: value['@id']?.replace(settings.apiPath, ''),
                  value: value['@id'],
                  label: {
                    content: value.title,
                  },
                  data: value,
                },
              ]),
            )
          : {
              [props.value['@id']]: {
                key: props.value['@id'],
                text: props.value?.replace(settings.apiPath, ''),
                value: props.value['@id'],
                label: {
                  content: props.value.title,
                },
                data: props.value,
              },
              novalue: {
                key: 'novalue',
                text: this.props.intl.formatMessage(messages.no_value),
                value: 'novalue',
                data: null,
              },
            }
        : {},
    };
  }

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  UNSAFE_componentWillMount() {
    this.props.resetSearchContent();
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({
      choices: {
        ...fromPairs(
          map(
            uniqBy(
              map(
                compact(concat(nextProps.value, nextProps.search)),
                (item) => ({
                  ...item,
                  '@id': item['@id'].replace(settings.apiPath, ''),
                }),
              ),
              '@id',
            ),
            (value) => [
              value['@id'],
              {
                key: value['@id'],
                text: value['@id']?.replace(settings.apiPath, ''),
                value: value['@id'],
                label: {
                  content: value.title,
                },
                data: value,
              },
            ],
          ),
        ),
        novalue: {
          key: 'novalue',
          text: this.props.intl.formatMessage(messages.no_value),
          value: 'novalue',
          data: null,
        },
      },
    });
  }

  /**
   * On search change handler
   * @method onSearchChange
   * @param {object} event Event object.
   * @param {object} data Event data.
   * @returns {undefined}
   */

  onSearchChange(event, data) {
    if (data.searchQuery && data.searchQuery !== '') {
      this.props.searchContent('', {
        Title: `*${data.searchQuery}*`,
      });
    } else {
      this.props.resetSearchContent();
    }
  }
  renderLabel = (item, index, defaultProps) => {
    return (
      <Popup
        key={item.value}
        content={
          <>
            <Icon name="home" /> {item.value}
          </>
        }
        trigger={
          defaultProps && (
            <Label active={defaultProps.active}>
              {item.label.content}
              <Icon
                name="delete"
                onClick={(event) => {
                  defaultProps.onRemove(event, defaultProps);
                }}
              />
            </Label>
          )
        }
      />
    );
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, title, value, multiple, onChange } = this.props;

    return (
      <FormFieldWrapper {...this.props}>
        <Dropdown
          options={values(this.state.choices)}
          placeholder={title}
          search
          selection
          fluid
          noResultsMessage={this.props.intl.formatMessage(
            messages.no_results_found,
          )}
          multiple={multiple}
          value={
            multiple
              ? value
                ? map(value, (item) =>
                    item && item['@id']
                      ? item['@id'].replace(settings.apiPath, '')
                      : item,
                  )
                : []
              : value
              ? value['@id']?.replace(settings.apiPath, '')
              : ''
          }
          onChange={(event, data) => {
            return onChange(
              id,
              multiple
                ? map(data.value, (item) => this.state.choices[item].data)
                : this.state.choices[data.value].data,
            );
          }}
          onSearchChange={this.onSearchChange}
          renderLabel={this.renderLabel}
        />
      </FormFieldWrapper>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state) => ({
      search: state.search.items,
    }),
    { resetSearchContent, searchContent },
  ),
)(ReferenceWidget);
