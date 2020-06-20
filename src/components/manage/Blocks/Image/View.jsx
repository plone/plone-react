/**
 * View image block.
 * @module components/manage/Blocks/Image/View
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { settings } from '~/config';

import { flattenToAppURL, isInternalURL } from '@plone/volto/helpers';

/**
 * View image block class.
 * @class View
 * @extends Component
 */
const View = ({ data, detached }) => (
  <p
    className={cx(
      'block image align',
      {
        center: !Boolean(data.align),
        detached,
      },
      data.align,
    )}
  >
    {data.url && (
      <>
        {(() => {
          const image = (
            <picture>
              <source
                srcSet={`
            ${flattenToAppURL(data.url)}/@@images/image/mini 200w,
            ${flattenToAppURL(data.url)}/@@images/image/preview 400w,
            ${flattenToAppURL(data.url)}/@@images/image/large 800w,
            ${flattenToAppURL(data.url)}/@@images/image 1200w,
            ${flattenToAppURL(data.url)}/@@images/image 1600w
            `}
                sizes={
                  data.align === 'full'
                    ? '100vw'
                    : data.align === 'left' || data.align === 'right'
                    ? '(min-width: 1200px) calc(1127px * 0.333), (min-width: 992px) calc(933px * 0.333), (min-width: 768px) calc(723px * 0.333), calc((100vw - (1em * 2)) * 0.5)'
                    : '(min-width: 1200px) 1127px, (min-width: 992px) 933px, (min-width: 768px) 723px, calc(100vw - (1em * 2))'
                }
              />
              <img
                className={cx({ 'full-width': data.align === 'full' })}
                src={
                  data.url.includes(settings.apiPath)
                    ? `${flattenToAppURL(data.url)}/@@images/image`
                    : data.url
                }
                alt={data.alt || ''}
              />
            </picture>
          );
          if (data.href) {
            if (!isInternalURL(data.href)) {
              return (
                <a
                  target={data.openLinkInNewTab ? '_blank' : null}
                  href={data.href}
                >
                  {image}
                </a>
              );
            } else {
              return (
                <Link
                  to={flattenToAppURL(data.href)}
                  target={data.openLinkInNewTab ? '_blank' : null}
                >
                  {image}
                </Link>
              );
            }
          } else {
            return image;
          }
        })()}
      </>
    )}
  </p>
);

/**
 * Property types.
 * @property {Object} propTypes Property types.
 * @static
 */
View.propTypes = {
  data: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default View;
