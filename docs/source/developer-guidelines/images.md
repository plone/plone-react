# Images

Images are rendered with the Volto component `Image`.  
It renders images using Plone scales from [plone.app.imaging](https://github.com/plone/plone.app.imaging) and handles:

- Lazy load of images
- Loads the most correct one for current image size with `srcset`

## Usage

```jsx
import Image from '@plone/volto/components/theme/Image/Image';

  ...

  <Image
    className="listing-image"
    image={item.image}
    aria-hidden="true"
    alt=""
    useOriginal={false}
    maxSize={400}
  />
```

## Props

| prop        | type             | default | description                                                                    |
| ----------- | ---------------- | ------- | ------------------------------------------------------------------------------ |
| image       | object or string |         | Plone image as object or URL                                                   |
| alt         | string           | `''`    | Alternative text for the image                                                 |
| className   | string           |         | CSS class for the image                                                        |
| role        | string           | `img`   | img role attribute                                                             |
| critical    | boolean          | `false` | If true, it will render the actual image on SSR and it will not be lazy loaded |
| maxSize     | number           |         | Maximum size to render, will skip the larger ones                              |
| useOriginal | boolean          | `false` | If true, it will includes the original size in srcset                          |

### image prop

If it is an object, it assumes it is a Plone Image content object and it will render the scales it has inside.
Else if it is a string, it checks if it is an internal URL: if so, it will generate the scales URLs based on the settings in `config.settings.imageScales` which should match the ones in Plone imaging controlpanel (so in Plone registry).
If it is an external URL, it will set it as source for the image.
