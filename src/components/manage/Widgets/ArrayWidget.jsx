/**
 * ArrayWidget component.
 * @module components/manage/Widgets/ArrayWidget
 */

import React, { Component } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isObject, intersection } from 'lodash';
import { compose } from 'redux';
import { connect } from 'react-redux';
import loadable from '@loadable/component';

import {
  getVocabFromHint,
  getVocabFromField,
  getVocabFromItems,
} from '@plone/volto/helpers';
import { getVocabulary } from '@plone/volto/actions';

import {
  Option,
  DropdownIndicator,
  selectTheme,
  customSelectStyles,
} from '@plone/volto/components/manage/Widgets/SelectStyling';

import { FormFieldWrapper } from '@plone/volto/components';

const AsyncPaginate = loadable(() => import('react-select-async-paginate'));
const CreatableSelect = loadable(() => import('react-select/creatable'));

const messages = defineMessages({
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
 * ArrayWidget component class.
 * @class ArrayWidget
 * @extends Component
 */
export class ArrayWidget extends Component {
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
    value: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    ),
    onChange: PropTypes.func.isRequired,
    itemsTotal: PropTypes.number,
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
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs Actions
   */
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    this.loadOptions = this.loadOptions.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.vocabBaseUrl =
      getVocabFromHint(props) ||
      getVocabFromField(props) ||
      getVocabFromItems(props);
    this.state = {
      search: '',
      selectedOption: props.value
        ? props.value.map((item) =>
            isObject(item)
              ? { label: item.title || item.token, value: item.token }
              : { label: item, value: item },
          )
        : [],
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    if (
      !this.props.items?.choices &&
      !this.props.choices &&
      this.vocabBaseUrl
    ) {
      this.props.getVocabulary(this.vocabBaseUrl);
    }
  }

  /**
   * Initiate search with new query
   * @param {string} query Search query.
   * @returns {undefined}
   */
  search(query) {
    if (query.length > 1) {
      this.props.getVocabulary(this.vocabBaseUrl, query);
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
  loadOptions(search, previousOptions, additional) {
    let hasMore = this.props.itemsTotal > previousOptions.length;
    if (hasMore) {
      const offset = this.state.search !== search ? 0 : additional.offset;

      this.props.getVocabulary(this.vocabBaseUrl, search, offset);
      this.setState({ search });

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
    return null;
  }

  /**
   * Handle the field change, store it in the local state and back to simple
   * array of tokens for correct serialization
   * @method handleChange
   * @param {array} selectedOption The selected options (already aggregated).
   * @returns {undefined}
   */
  handleChange(selectedOption) {
    this.setState({ selectedOption });

    this.props.onChange(
      this.props.id,
      selectedOption ? selectedOption.map((item) => item.value) : null,
    );
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { selectedOption } = this.state;

    return (
      <FormFieldWrapper {...this.props}>
        {!this.props.items?.choices && this.vocabBaseUrl ? (
          <AsyncPaginate
            className="react-select-container"
            classNamePrefix="react-select"
            options={this.props.choices || []}
            styles={customSelectStyles}
            theme={selectTheme}
            components={{ DropdownIndicator, Option }}
            isMulti
            value={selectedOption || []}
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
        ) : (
          <CreatableSelect
            className="react-select-container"
            classNamePrefix="react-select"
            options={
              this.props.choices
                ? [
                    ...this.props.choices.map((option) => ({
                      value: option[0],
                      label:
                        // Fix "None" on the serializer, to remove when fixed in p.restapi
                        option[1] !== 'None' && option[1]
                          ? option[1]
                          : option[0],
                    })),
                    {
                      label: this.props.intl.formatMessage(messages.no_value),
                      value: 'no-value',
                    },
                  ]
                : [
                    {
                      label: this.props.intl.formatMessage(messages.no_value),
                      value: 'no-value',
                    },
                  ]
            }
            styles={customSelectStyles}
            theme={selectTheme}
            components={{ DropdownIndicator, Option }}
            value={selectedOption || []}
            placeholder={this.props.intl.formatMessage(messages.select)}
            onChange={this.handleChange}
            isMulti
          />
        )}
      </FormFieldWrapper>
    );
  }
}

export default compose(
  injectIntl,
  connect(
    (state, props) => {
      const vocabBaseUrl =
        getVocabFromHint(props) ||
        getVocabFromField(props) ||
        getVocabFromItems(props);
      const vocabState = state.vocabularies[vocabBaseUrl];
      // If the schema already has the choices in it, then do not try to get the vocab,
      // even if there is one
      if (props.items?.choices) {
        return {
          choices: props.items.choices,
        };
      } else if (vocabState) {
        return {
          choices: vocabState.items,
          itemsTotal: vocabState.itemsTotal,
          loading: Boolean(vocabState.loading),
        };
      }
      return {};
    },
    { getVocabulary },
  ),
)(ArrayWidget);
