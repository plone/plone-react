import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';

const TRANSITION_OCCURED = 'transition-occured';

/**
 * @class AnimationWrapper
 * @extends {Component}
 */
class AnimationWrapper extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
      hash: PropTypes.string,
      search: PropTypes.string,
    }).isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    duringTransition: false,
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.setState({
        duringTransition: true,
      });
      return TRANSITION_OCCURED;
    }

    return null;
  }

  /**
   * @param {*} prevProps Previous Props
   * @returns {null} Null
   * @memberof AnimationWrapper
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot === TRANSITION_OCCURED) {
      window.scrollTo(0, 0);

      setTimeout(
        () =>
          this.setState({
            duringTransition: false,
          }),
        200,
      );
    }
  }

  /**
   * @returns {node} Children
   * @memberof AnimationWrapper
   */
  render() {
    return (
      <div
        className={cx('animation-wrapper', {
          entering: this.state.duringTransition,
          entered: !this.state.duringTransition,
        })}
      >
        {this.props.children}
      </div>
    );
  }
}

export default withRouter(AnimationWrapper);
