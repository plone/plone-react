/**
 * ArrayWidget component.
 * @module components/manage/Widgets/ArrayWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import loadable from '@loadable/component';
import { defineMessages, injectIntl } from 'react-intl';
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

const AsyncCreatable = loadable.lib(() =>
  import('react-select/async-creatable'),
);

const messages = defineMessages({
  select: {
    id: 'Select…',
    defaultMessage: 'Select…',
  },
  no_options: {
    id: 'No options',
    defaultMessage: 'No options',
  },
});

/**
 * TokenWidget component class.
 * @class TokenWidget
 * @extends Component
 */
export class TokenWidget extends Component {
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
    choices: PropTypes.arrayOf(PropTypes.object),
    loading: PropTypes.bool,
    items: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    widgetOptions: PropTypes.shape({
      vocabulary: PropTypes.object,
    }),
    value: PropTypes.arrayOf(PropTypes.string),
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
      selectedOption: props.value
        ? props.value.map((item) => ({ label: item, value: item }))
        : [],
    };
  }

  /**
   * Component did mount
   * @method componentDidMount
   * @returns {undefined}
   */
  componentDidMount() {
    this.props.getVocabulary(this.vocabBaseUrl);
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
   * Load options from the vocabulary endpoint
   * @method loadOptions
   * @param {string} search Search query.
   * @param {string} previousOptions The previous options rendered.
   * @param {string} additional Additional arguments to pass to the next loadOptions.
   * @returns {undefined}
   */
  loadOptions(search) {
    return this.props.getVocabulary(this.vocabBaseUrl, search).then((resolve) =>
      this.props.choices.map((item) => ({
        label: item.value,
        value: item.value,
      })),
    );
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
        <AsyncCreatable>
          {({ default: AsyncCreatableSelect }) => (
            <AsyncCreatableSelect
              className="react-select-container"
              classNamePrefix="react-select"
              defaultOptions={this.props.choices || []}
              styles={customSelectStyles}
              theme={selectTheme}
              components={{ DropdownIndicator, Option }}
              isMulti
              value={selectedOption || []}
              loadOptions={this.loadOptions}
              onChange={this.handleChange}
              placeholder={this.props.intl.formatMessage(messages.select)}
              noOptionsMessage={() =>
                this.props.intl.formatMessage(messages.no_options)
              }
            />
          )}
        </AsyncCreatable>
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
      if (vocabState) {
        return {
          choices: vocabState.items
            ? vocabState.items.map((item) => ({
                label: item.value,
                value: item.value,
              }))
            : [],
          itemsTotal: vocabState.itemsTotal,
          loading: Boolean(vocabState.loading),
        };
      }
      return {};
    },
    { getVocabulary },
  ),
)(TokenWidget);
