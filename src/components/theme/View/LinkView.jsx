/**
 * Link View.
 * @module components/theme/View/LinkView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { isExternalLink } from '@plone/volto/helpers';

/**
 * View container class.
 * @class View
 * @extends Component
 */
class LinkView extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    content: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      remoteUrl: PropTypes.string,
    }),
    token: PropTypes.string,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    content: null,
    token: null,
  };

  /**
   * Component will mount
   * @method componentWillMount
   * @returns {undefined}
   */
  UNSAFE_componentWillMount() {
    if (!this.props.token) {
      const { remoteUrl } = this.props.content;
      if (isExternalLink(remoteUrl)) {
        window.location.href = remoteUrl;
      } else {
        this.props.history.replace(remoteUrl);
      }
    }
  }

  /**
   * Component will receive props
   * @method componentWillReceiveProps
   * @param {Object} nextProps Next properties
   * @returns {undefined}
   */
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.pathname !== this.props.pathname && !nextProps.token) {
      console.log('QUO');
      nextProps.history.replace(nextProps.content.remoteUrl);
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    if (!this.props.token) {
      return '';
    }
    return (
      <Container id="page-document">
        <Helmet title={this.props.content.title} />
        <h1 className="documentFirstHeading">{this.props.content.title}</h1>
        {this.props.content.description && (
          <p className="documentDescription">
            {this.props.content.description}
          </p>
        )}
        {this.props.content.remoteUrl && (
          <span>
            The link address is:
            <Link to={this.props.content.remoteUrl}>
              {this.props.content.remoteUrl}
            </Link>
          </span>
        )}
      </Container>
    );
  }
}

export default LinkView;
