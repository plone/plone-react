/**
 * Link View.
 * @module components/theme/View/LinkView
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isInternalURL, flattenToAppURL } from '@plone/volto/helpers';
import { Link } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import URLUtils from '@plone/volto/components/manage/AnchorPlugin/utils/URLUtils';

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
    userLoggedIn: PropTypes.bool,
  };

  /**
   * Default properties.
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    content: null,
  };

  componentDidMount() {
    if (!this.props.userLoggedIn) {
      const { remoteUrl } = this.props.content;
      if (isInternalURL(remoteUrl)) {
        this.props.history.replace(flattenToAppURL(remoteUrl));
      } else if (!__SERVER__) {
        window.location.href = flattenToAppURL(remoteUrl);
      }
    }
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { remoteUrl } = this.props.content;
    return (
      <Container id="page-document">
        <h1 className="documentFirstHeading">{this.props.content.title}</h1>
        {this.props.content.description && (
          <p className="documentDescription">
            {this.props.content.description}
          </p>
        )}
        {remoteUrl && (
          <span>
            The link address is:
            {isInternalURL(remoteUrl) ? (
              <Link to={flattenToAppURL(remoteUrl)}>
                {flattenToAppURL(remoteUrl)}
              </Link>
            ) : (
              <>
                {URLUtils.isMail('mailto:' + remoteUrl) ? (
                  <a
                    href={URLUtils.normaliseMail(remoteUrl)}
                    rel="noopener noreferrer"
                  >
                    {remoteUrl}
                  </a>
                ) : (
                  <>
                    {URLUtils.isTelephone(remoteUrl) ? (
                      <a
                        href={URLUtils.normalizeTelephone(remoteUrl)}
                        rel="noopener noreferrer"
                      >
                        {remoteUrl}
                      </a>
                    ) : (
                      <a
                        href={remoteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {remoteUrl}
                      </a>
                    )}
                  </>
                )}
              </>
            )}
          </span>
        )}
      </Container>
    );
  }
}

export default LinkView;
