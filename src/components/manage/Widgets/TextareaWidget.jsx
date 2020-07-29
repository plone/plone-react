/**
 * TextareaWidget component.
 * @module components/manage/Widgets/TextareaWidget
 */

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon, Label, TextArea } from 'semantic-ui-react';

import { defineMessages, injectIntl } from 'react-intl';
import { FormFieldWrapper } from '@plone/volto/components';

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
  delete: {
    id: 'Delete',
    defaultMessage: 'Delete',
  },
});

/**
 * TextareaWidget component class.
 * @function TextareaWidget
 * @returns {string} Markup of the component.
 */
const TextareaWidget = ({
  id,
  title,
  required,
  description,
  error,
  maxLength,
  value,
  onChange,
  onEdit,
  onDelete,
  intl,
  fieldSet,
  wrapped,
  placeholder,
  focus,
}) => {
  const [lengthError, setlengthError] = useState('');

  const onhandleChange = (id, value) => {
    if (maxLength & value?.length) {
      let remlength = maxLength - value.length;
      if (remlength < 0) {
        setlengthError(`You have exceed word limit by ${Math.abs(remlength)}`);
      } else {
        setlengthError('');
      }
    }
    onChange(id, value);
  };

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

  const textAreaRef = useRef(null);

  useEffect(() => {
    if (focus) {
      textAreaRef.current.focus();
    }
  }, [focus]);

  return (
    <FormFieldWrapper
      id={id}
      title={title}
      description={description}
      required={required}
      error={error}
      fieldSet={fieldSet}
      wrapped={wrapped}
      onEdit={onEdit}
      draggable={true}
      className="textarea"
    >
      {onEdit && (
        <div className="toolbar">
          <button
            className="item ui noborder button"
            onClick={() => onEdit(id, schema)}
          >
            <Icon name="write square" size="large" color="blue" />
          </button>
          <button
            aria-label={this.props.intl.formatMessage(messages.delete)}
            className="item ui noborder button"
            onClick={() => onDelete(id)}
          >
            <Icon name="close" size="large" color="red" />
          </button>
        </div>
      )}
      <TextArea
        id={`field-${id}`}
        ref={textAreaRef}
        name={id}
        value={value || ''}
        disabled={onEdit !== null}
        placeholder={placeholder}
        onChange={({ target }) =>
          onhandleChange(id, target.value === '' ? undefined : target.value)
        }
      />
      {lengthError.length > 0 && (
        <Label key={lengthError} basic color="red" pointing>
          {lengthError}
        </Label>
      )}
    </FormFieldWrapper>
  );
};

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
TextareaWidget.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  onChange: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  wrapped: PropTypes.bool,
  placeholder: PropTypes.string,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
TextareaWidget.defaultProps = {
  description: null,
  maxLength: null,
  required: false,
  error: [],
  value: null,
  onChange: null,
  onEdit: null,
  onDelete: null,
};

export default injectIntl(TextareaWidget);
