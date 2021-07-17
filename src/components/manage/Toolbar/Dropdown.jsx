/**
 * Dropdown components
 * @module components/manage/Toolbar/Dropdown
 */

import { doesNodeContainClick } from 'semantic-ui-react/dist/commonjs/lib';
import React, { Component } from 'react';
import { BodyClass } from '@plone/volto/helpers';
import { Portal } from 'react-portal';

/**
 * A response dropdown popup (a toolbar aside component)
 */
export class DropdownMenu extends Component {
  state = {
    pushed: false,
  };

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const {
      // position = 'top',
      name,
      theToolbar,
      showMenu,
      loadedComponentName,
      pusherRef,
    } = this.props;

    return showMenu && loadedComponentName === name ? (
      <>
        <BodyClass
          // This sets the scroll locker in the body tag in mobile
          className="has-toolbar-menu-open"
        />
        <Portal node={document.querySelector('.toolbar-content')}>
          <div
            className="pusher-puller"
            ref={(node) => (pusherRef.current = node)}
            style={{
              transform: theToolbar.current ? `translateX(0px)` : null,
            }}
          >
            <div
              className="menu-more pastanaga-menu"
              style={{
                flex: this.props.theToolbar.current
                  ? `0 0 ${
                      this.props.theToolbar.current.getBoundingClientRect()
                        .width
                    }px`
                  : null,
              }}
            >
              <header>
                <h2>{this.props.title}</h2>
                {this.props.headerActions}
              </header>
              <div className="pastanaga-menu-list">
                <ul>
                  <li>{this.props.children}</li>
                </ul>
              </div>
            </div>
          </div>
        </Portal>
      </>
    ) : (
      ''
    );
  }
}

/**
 * A dropdown trigger button, to be included as a Toolbar action
 */
export const DropdownWithButton = (props) => {
  const { icon, label, name, toggleMenu, loadedComponentName } = props;
  const pusherRef = React.useRef();
  const { showMenu } = props;

  const handleClickOutside = React.useCallback(
    (e) => {
      if (showMenu && loadedComponentName === name) {
        if (doesNodeContainClick(pusherRef.current, e)) {
          return;
        } else {
          toggleMenu(e, null, { loadedComponentName: name });
        }
      }
    },
    [showMenu, toggleMenu, name, loadedComponentName],
  );

  React.useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside, false);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, false);
    };
  }, [handleClickOutside]);

  return (
    <>
      <button
        className="dropdown-btn"
        aria-label={label}
        onClick={(e) => {
          // selector null triggers the alternate code path in
          // Toolbar.loadComponent

          props.toggleMenu(e, null, { loadedComponentName: name });
        }}
        tabIndex={0}
        id={`toolbar-${name}`}
      >
        {icon}
      </button>
      <DropdownMenu {...props} pusherRef={pusherRef} />
    </>
  );
};
