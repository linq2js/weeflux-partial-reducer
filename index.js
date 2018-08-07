function callReducer(reducer, state, context) {
  return reducer instanceof Function ? reducer(state, context) : reducer;
}

function createSingleReducerForProp(prop, reducer) {
  return function(state, context) {
    const prevValue = state[prop];
    const nextValue = callReducer(reducer, prevValue, context);
    if (nextValue !== prevValue) {
      return {
        ...state,
        [prop]: nextValue
      };
    }
    return state;
  };
}

function createMultipleReducers(reducers) {
  const pairs = Object.entries(reducers);
  return function(state, context) {
    return pairs.reduce((nextState, [prop, reducer]) => {
      const prevValue = state[prop];
      const nextValue = callReducer(reducer, prevValue, context);
      if (prevValue !== nextValue) {
        // if unchanged, we create new state from original state
        if (nextState === state) {
          nextState = {
            ...state
          };
        }
        nextState[prop] = nextValue;
      }
      return nextState;
    }, state);
  };
}

function createMultipleReducersForProp(prop, reducers) {
  reducers = Object.entries(reducers).reduce((obj, [action, reducer]) => {
    action.split(/\s+/).forEach(action => (reducers[action] = reducer));
    return obj;
  }, {});

  return function(state, context) {
    if (context.action in reducers) {
      const prevValue = state[prop];
      const nextValue = callReducer(
        reducers[context.action],
        prevValue,
        context
      );

      if (nextValue !== prevValue) {
        return {
          ...state,
          [prop]: nextValue
        };
      }
    }
    return state;
  };
}

function createReducerForSpecificAction(prop, action, reducer) {
  const actions = (action instanceof Array
      ? action
      : action.split(/\s+/)
  ).reduce((obj, action) => {
    obj[action] = true;
    return obj;
  }, {});
  return function(state, context) {
    if (context.action in actions) {
      const prevValue = state[prop];
      const nextValue = callReducer(reducer, prevValue, context);
      if (prevValue !== nextValue) {
        return {
          ...state,
          [prop]: nextValue
        };
      }
    }
    return state;
  };
}

export default function(...args) {
  if (args.length === 3) {
    return createReducerForSpecificAction(...args);
  }

  if (args.length === 2) {
    if (args[1] instanceof Function) {
      return createSingleReducerForProp(args[0], args[1]);
    }
    return createMultipleReducersForProp(args[0], args[1]);
  }

  return createMultipleReducers(args[0]);
}
