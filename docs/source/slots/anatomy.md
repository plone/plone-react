# Slots anatomy

The slots are insertion points in the Volto rendering tree structure. You can add a
component, along with its configuration, if any and it will be rendered in that
insertion point. You can control in which route do you want that element appear as well
as the order (position) of the items that you add in the in the slots. Slots are named,
so you can add in the configuration object:

```js
export const slots = {
  aboveContentTitle: [
    // List of components (might have config too, in `props` property)
    { path: '/', component: ExtraComponent, props: {}, exact: true },
  ],
};
```

Slots are inherited by default on all children routes, but you can block inheritance by
defining `exact` property to `true`.

## Slots

- aboveContentTitle
- belowContentTitle
- aboveContentBody
- belowContentBody
- footer

- asideLeftSlot
- asideRightSlot

- afterApp
- afterToolbar

- htmlHead
- htmlBeforeBody
- htmlAfterBody

### Slots definition

You can define new slots anywhere in the tree, then define them in the configuraion
object. This is how you define them in JSX:

```jsx
import {SlotRenderer} from '@plone/volto/components';
...

<SlotRenderer name="aboveContentTitle" />

```

### Slots in addons

You can define slots also in addons:

```js
config.slots.aboveContentTitle.push({path:'/', component: ExtraComponent})
```
