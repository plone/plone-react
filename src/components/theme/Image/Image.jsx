import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getImageAttributes } from '@plone/volto/helpers';

/**
 * Image component
 * @param {object | string} image - Plone image as object or url
 * @param {string} alt - Alternative text for image
 * @param {string} className - CSS class attribute
 * @param {string} role - img role attribute
 * @param {boolean} critical - whether to lazy load the image
 * @param {number} maxSize - maximum size to render
 * @param {boolean} useOriginal - whether to render original size
 */
const Image = ({
  image,
  alt = '',
  className,
  role = 'img',
  critical = false,
  maxSize,
  useOriginal = false,
  ...imageProps
}) => {
  const { src, srcSet } = getImageAttributes(image, { maxSize, useOriginal });
  const [isClient, setIsClient] = useState(false);
  const [srcset, setSrcset] = useState(
    critical && srcSet ? srcSet.join(', ') : null,
  );

  useEffect(() => {
    setIsClient(true);
    if (!srcset && srcSet?.length > 0) setSrcset(srcSet.join(', '));
  }, [srcSet, srcSet?.length, srcset]);

  return (
    <>
      <picture>
        {srcset && (isClient || critical) && <source srcSet={srcset} />}
        <img
          src={src}
          alt={alt}
          className={className}
          role={role}
          loading="lazy"
          style={{ width: '100%', objectFit: 'cover' }}
          {...imageProps}
        />
      </picture>
      {!critical && (
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <img
                src="${src}"
                ${srcSet?.length && `srcset="${srcSet.join(', ')}"`}
                alt="${alt}"
                className="${className}"
                role="${role}"
                loading="lazy"
                style="width: 100%; object-fit: cover;"
            `,
          }}
        />
      )}
    </>
  );
};

Image.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  alt: PropTypes.string,
  className: PropTypes.string,
  role: PropTypes.string,
  critical: PropTypes.bool,
  maxSize: PropTypes.number,
  useOriginal: PropTypes.bool,
};

export default Image;
