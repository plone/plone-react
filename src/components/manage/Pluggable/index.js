// ported to JS from MIT licensed https://github.com/robik/react-view-slot
// We've renamed Slot => Pluggable, not to clash with Volto slots

import React from 'react';
import sortBy from 'lodash.sortby';
import config from '@plone/volto/registry';

export const context = React.createContext();

export function usePluggable(name) {
  const ctx = React.useContext(context);

  if (!ctx) {
    throw new Error(
      'Using <Pluggable> component or usePluggable hook outside of <PluggablesProvider>',
    );
  }

  return ctx.pluggables[name] || [];
}

/**

**/
export function Pluggable(props) {
  const { name, maxCount, reversed, children, params } = props; // , ...rest
  let pluggables = usePluggable(name);

  if (maxCount !== undefined) {
    pluggables = pluggables.slice(0, maxCount);
  }
  if (reversed !== undefined) {
    pluggables = [...pluggables].reverse();
  }

  if (params && children) {
    throw Error(
      'Cannot specify render function and params props at the same time',
    );
  }

  return React.useMemo(() => {
    if (children) {
      return children(pluggables);
    }

    return React.createElement(
      React.Fragment,
      {},
      pluggables.map((R, i) =>
        React.createElement(R, { key: i.toString(), ...params }),
      ),
    );
  }, [params, pluggables, children]);
}

export function usePlug({ pluggable, id, renderer, dependencies, options }) {
  const pluggableContext = React.useContext(context);
  if (!pluggableContext) {
    throw new Error(
      'Using <Plug> component or usePlug hook outside of <PluggablesProvider>',
    );
  }
  const { setPlug, removePlug } = pluggableContext;
  const { name, order, extra } = options;

  // Could be that a Plug is empty (or it evaluates and have no children)
  if (renderer) {
    Object.assign(renderer, { pluggableName: name, extra, order });
  }

  if (__SERVER__) {
    config.transient.pluggables = {
      ...config.transient.pluggables,
      [pluggable]: sortBy(
        [
          ...(config.transient.pluggables[pluggable] || []).filter(
            (e) => e.id !== id,
          ),
          renderer,
        ],
        (e) => e.order || 0,
      ),
    };
  }

  React.useEffect(
    () => {
      if (renderer) {
        setPlug(pluggable, id, renderer);
        return () => removePlug(pluggable, id);
      }
    },
    dependencies, // eslint-disable-line react-hooks/exhaustive-deps
  );
}

export const Plug = ({
  pluggable,
  id,
  dependencies = [],
  children,
  ...options
}) => {
  const renderer =
    children && (typeof children === 'function' ? children : () => children);
  usePlug({ pluggable, id, renderer, dependencies, options });
  return null;
};

export function createPluggable(name) {
  const pluggable = (props) =>
    React.createElement(Pluggable, { name, ...props });
  pluggable.pluggableName = name;
  pluggable.Plug = createPlugComponent(name);
  return pluggable;
}

function createPlugComponent(pluggableName) {
  const plugComponent = (props) =>
    React.createElement(Plug, { pluggable: pluggableName, ...props });
  plugComponent.displayName = `Pluggables(${pluggableName})`;
  return plugComponent;
}

/**
 * Creates a Pluggable + Plug pair
 */
export function createPluggableAndPlug(name) {
  const boundPluggable = createPluggable(name);
  return [boundPluggable, boundPluggable.Plug];
}

export const PluggablesProvider = ({ children }) => {
  const setPlug = (pluggable, id, renderer) => {
    Object.assign(renderer, { id });

    setPluggables((prevState) => ({
      ...prevState,
      pluggables: {
        ...prevState.pluggables,
        [pluggable]: sortBy(
          [
            ...(prevState.pluggables[pluggable] || []).filter(
              (e) => e.id !== id,
            ),
            renderer,
          ],
          (e) => e.order || 0,
        ),
      },
    }));
  };

  const removePlug = (pluggable, name) => {
    setPluggables((prevState) => ({
      ...prevState,
      pluggables: {
        ...prevState.pluggables,
        [pluggable]: sortBy(
          (prevState.pluggables[pluggable] || []).filter((e) => e.id !== name),
          (e) => e.order || 0,
        ),
      },
    }));
  };

  const initialPluggables = {
    pluggables:
      __SERVER__ && !config.transient.isFirstPass
        ? config.transient.pluggables
        : {},
    setPlug,
    removePlug,
  };

  const [pluggables, setPluggables] = React.useState(initialPluggables);
  return React.createElement(context.Provider, { value: pluggables }, children);
};

export default Pluggable;
