/**
 * SelectWidget component.
 * @module components/manage/Widgets/SelectWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { map, intersection } from 'lodash';
import { defineMessages, injectIntl } from 'react-intl';
import {
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
} from '@plone/volto/helpers';
import { FormFieldWrapper } from '@plone/volto/components';
import { getVocabulary, getVocabularyTokenTitle } from '@plone/volto/actions';
import { normalizeValue } from './SelectUtils';

import {
  customSelectStyles,
  DropdownIndicator,
  Option,
  selectTheme,
} from '@plone/volto/components/manage/Widgets/SelectStyling';
import { injectLazyLibs } from '@plone/volto/helpers/Loadable/Loadable';

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
  close: {
    id: 'Close',
    defaultMessage: 'Close',
  },
  choices: {
    id: 'Choices',
    defaultMessage: 'Choices',
  },
  required: {
    id: 'Required',
    defaultMessage: 'Required',
  },
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  no_value: {
    id: 'No value',
    defaultMessage: 'No value',
  },
  no_options: {
    id: 'No options',
    defaultMessage: 'No options',
  },
});

/**
 * SelectWidget component class.
 * @function SelectWidget
 * @returns {string} Markup of the component.
 */
class SelectWidget extends Component {
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
    getVocabulary: PropTypes.func.isRequired,
    getVocabularyTokenTitle: PropTypes.func.isRequired,
    choices: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    ),
    loading: PropTypes.bool,
    items: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    widgetOptions: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
      PropTypes.bool,
    ]),
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onClick: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    itemsTotal: PropTypes.number,
    wrapped: PropTypes.bool,
    noValueOption: PropTypes.bool,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    description: null,
    required: false,
    items: {
      vocabulary: null,
    },
    widgetOptions: {
      vocabulary: null,
    },
    error: [],
    choices: [],
    loading: false,
    value: null,
    onChange: () => {},
    onBlur: () => {},
    onClick: () => {},
    onEdit: null,
    onDelete: null,
    noValueOption: true,
  };

  state = {
    // TODO: also take into account this.props.defaultValue?
    selectedOption: normalizeValue(this.props.choices, this.props.value),
    search: '',
  };

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (!this.props.choices && this.props.vocabBaseUrl) {
      this.props.getVocabulary(this.props.vocabBaseUrl);
    }
  }

  /**
   * Initiate search with new query
   * @method loadOptions
   * @param {string} search Search query.
   * @param {string} previousOptions The previous options rendered.
   * @param {string} additional Additional arguments to pass to the next loadOptions.
   * @returns {undefined}
   */
  loadOptions = (search, previousOptions, additional) => {
    let hasMore = this.props.itemsTotal > previousOptions.length;
    const offset = this.state.search !== search ? 0 : additional.offset;
    this.setState({ search });

    if (hasMore || this.state.search !== search) {
      this.props.getVocabulary(this.props.vocabBaseUrl, search, offset);

      return {
        options:
          intersection(previousOptions, this.props.choices).length ===
          this.props.choices.length
            ? []
            : this.props.choices,
        hasMore: hasMore,
        additional: {
          offset: offset === additional.offset ? offset + 25 : offset,
        },
      };
    }
    // We should return always an object like this, if not it complains:
    return { options: [] };
  };

  /**
   * Handle the field change, store it in the local state and back to simple
   * array of tokens for correct serialization
   * @method handleChange
   * @param {array} selectedOption The selected options (already aggregated).
   * @returns {undefined}
   */
  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onChange(this.props.id, selectedOption.value);
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { id, choices, onChange } = this.props;
    // Make sure that both disabled and isDisabled (from the DX layout feat work)
    const disabled = this.props.disabled || this.props.isDisabled;
    const Select = this.props.reactSelect.default;
    const AsyncPaginate = this.props.reactSelectAsyncPaginate.AsyncPaginate;

    return (
      <FormFieldWrapper {...this.props}>
        {this.props.vocabBaseUrl ? (
          <>
            <AsyncPaginate
              isDisabled={disabled}
              className="react-select-container"
              classNamePrefix="react-select"
              options={this.props.choices || []}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              value={this.state.selectedOption}
              loadOptions={this.loadOptions}
              onChange={this.handleChange}
              additional={{
                offset: 25,
              }}
              placeholder={this.props.intl.formatMessage(messages.select)}
              noOptionsMessage={() =>
                this.props.intl.formatMessage(messages.no_options)
              }
            />
          </>
        ) : (
          <Select
            id={`field-${id}`}
            key={this.props.choices}
            name={id}
            isDisabled={disabled}
            className="react-select-container"
            classNamePrefix="react-select"
            isMulti={
              this.props.isMulti
                ? this.props.isMulti
                : id === 'roles' || id === 'groups'
            }
            options={[
              ...map(choices, (option) => ({
                value: option[0],
                label:
                  // Fix "None" on the serializer, to remove when fixed in p.restapi
                  option[1] !== 'None' && option[1] ? option[1] : option[0],
              })),
              // Only set "no-value" option if there's no default in the field
              // TODO: also if this.props.defaultValue?
              ...(this.props.noValueOption && !this.props.default
                ? [
                    {
                      label: this.props.intl.formatMessage(messages.no_value),
                      value: 'no-value',
                    },
                  ]
                : []),
            ]}
            styles={customSelectStyles}
            theme={selectTheme}
            components={{ DropdownIndicator, Option }}
            value={this.state.selectedOption}
            onChange={(selectedOption) => {
              this.setState({ selectedOption });
              return onChange(
                id,
                selectedOption && selectedOption.value !== 'no-value'
                  ? selectedOption.value
                  : undefined,
              );
            }}
          />
        )}
      </FormFieldWrapper>
    );
  }
}

export const SelectWidgetComponent = injectIntl(SelectWidget);

export default compose(
  injectIntl,
  injectLazyLibs(['reactSelect', 'reactSelectAsyncPaginate']),
  connect(
    (state, props) => {
      const vocabBaseUrl = !props.choices
        ? getVocabFromHint(props) ||
          getVocabFromField(props) ||
          getVocabFromItems(props)
        : '';
      const vocabState = state.vocabularies[vocabBaseUrl];

      // If the schema already has the choices in it, then do not try to get the vocab,
      // even if there is one
      if (props.choices) {
        return {
          choices: props.choices,
        };
      } else if (vocabState) {
        return {
          vocabBaseUrl,
          vocabState,
          choices: vocabState.items,
          itemsTotal: vocabState.itemsTotal,
          loading: Boolean(vocabState.loading),
        };
        // There is a moment that vocabState is not there yet, so we need to pass the
        // vocabBaseUrl to the component.
      } else if (vocabBaseUrl) {
        return {
          vocabBaseUrl,
        };
      }
      return {};
    },
    { getVocabulary, getVocabularyTokenTitle },
  ),
)(SelectWidget);
