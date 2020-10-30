# Settings reference guide

This is a summary of all the configuration options and what they control.

!!! note
    This list is still incomplete, contributions are welcomed!

## navDepth

Navigation levels depth used in the navigation endpoint calls. Increasing this is useful
for implementing fat navigation menus. Defaults to `1`.

## defaultBlockType

The default block type in Volto is "text", which uses the current DraftJS-based implementation for the rich text editor. Future alternative rich text editors will need to use this setting and replace it with their block type. The block definition should also include the `blockHasValue` function, which is needed to activate the Block Chooser functionality. See this function signature in [Blocks > Settings](../blocks/settings.md).

## backendResourceMatch

The Volto Express server, by default, pipes some requests from the backend, for
example image and file transfers, denoted by paths such as `@@images` or
`@download`. This setting enables adding additional such paths. This is a list
of "matchers", functions that receive the Express server request and return
true if the request should be piped to the backend server.

For example, if we'd like to pipe a request such as
`http://localhost:8080/Plone/something/@@ics`, we'd write a matcher like:

```jsx
settings.backendResourceMatch = [
  ...backendResourceMatch,
  (request) => request.path.match(/(.*)\/@@ics/)
]
```
