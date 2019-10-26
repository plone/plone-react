/**
 * Icon component.
 * @module components/theme/Icon/Icon
 */
import React from 'react';
import PropTypes from 'prop-types';

const defaultSize = '36px';

/**
 * Component to display an Icon.
 * @function Field
 * @param {Object} props Component properties.
 * @param {string} props.name Name source object.
 * @param {string} props.size Size of the Icon (in px).
 * @param {string} props.color Color of the Icon.
 * @param {string} props.className className to add to the component.
 * @param {string} props.title Title (a11y).
 * @returns {string} Markup of the component.
 */
const Icon = ({ name, size, color, className, title, onClick }) => (
  <svg
    xmlns={name.attributes && name.attributes.xmlns}
    viewBox={name.attributes && name.attributes.viewBox}
    style={{ height: size, width: 'auto', fill: color || 'currentColor' }}
    className={className ? `icon ${className}` : 'icon'}
    onClick={onClick}
    dangerouslySetInnerHTML={{
      __html: title ? `<title>${title}</title>${name.content}` : name.content,
    }}
  />
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
Icon.propTypes = {
  name: PropTypes.shape({
    xmlns: PropTypes.string,
    viewBox: PropTypes.string,
    content: PropTypes.string,
  }).isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

/**
 * Default properties.
 * @property {Object} defaultProps Default properties.
 * @static
 */
Icon.defaultProps = {
  size: defaultSize,
  color: null,
  className: null,
  title: null,
  onClick: null,
};

export default Icon;
