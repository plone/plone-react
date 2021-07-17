# critical.css (above the fold) optimizations

A very important technique to improve the perceived initial load performance of
a website is to
[inline the CSS](https://www.smashingmagazine.com/2015/08/understanding-critical-css/)
that is used for the first thing the visitors see, the so-called "above the
fold" content.

With a CMS like Plone and its Volto frontend, it is difficult to decide, at
"build time" what exactly represents that optimal "above the fold" CSS. This
CSS could come from various addons installed, it depends on the blocks
activated on the frontpage, etc. So this CSS is something that's very specific
to every deployed website and, if maximum performance is desired, the critical
CSS could be specific to each page in a CMS.

Fortunately there are ways to automate extracting the critical CSS. One such
tool is provided from the Plone [critical-css-cli](https://github.com/plone/critical-css-cli)
repository which can generate a `critical.css` file from a live website. This
tool uses internally [critical](https://github.com/addyosmani/critical) and
a [headless Chrome instance](https://pptr.dev/) to extract the critical css
from a running website.

Run it like:

```
critical-cli -h
critical-cli https://example.com/ -o critical.css
```

You can pass multiple URLs and screen dimmensions and the extracted CSS will be
optimized (duplicate rules will be eliminated, etc). See the [Advanced preset
of cssnano](https://cssnano.co/docs/optimisations) for details. One last
optimization applied strips all `@import` declarations from the generated CSS.

After that, copy this file to the `public/critical.css` path (configurable
through `settings.serverConfig.criticalCssPath`). When this file exists, Volto
changes the way the CSS files are loaded. By default, the CSS is loaded with
two elements in the `<head>`:

```
<link rel="preload" href="static/1234.chunk.css" as="style"/>
<link rel="stylesheet" href="1234.chunk.css" />
```

With critical.css present, the file content is inlined into a `<style>` tag in
the HTML and the `<link rel="stylesheet" />` links are moved to the bottom of
the generated HTML.

The ideal scenario when dealing with the critical css is to generate it for
each possible page, but this complicates the overall architecture: storage,
invalidations, async workers, etc have to be taken into account. In case you
want to implement this type of scenario, look at
[Penthouse](https://github.com/pocketjoso/penthouse) and override the
`settings.serverConfig.readCriticalCss` function with your own implementation.

# caching webpack assets and prefetch using a service worker

In production environments sometimes we get this nasty "ChunkLoadError" or "Failed to load chunk". This error originates when a chunk changed its name based on the content and when a browser requests it, the old chunk would not be there.

The idea is to cache chunknames using a worker and let the user to load it from `cache first` to avoid the error.

Volto uses [offline-plugin](https://github.com/NekR/offline-plugin) which is a webpack plugin to provide PWA support for projects.
It creates a `sw.js`(by default) service worker file on the build time, which have all webpack assets output as minified.
