"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function () {
  if (arguments.length === 3) {
    return createReducerForSpecificAction.apply(undefined, arguments);
  }

  if (arguments.length === 2) {
    if ((arguments.length <= 1 ? undefined : arguments[1]) instanceof Function) {
      return createSingleReducerForProp(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
    }
    return createMultipleReducersForProp(arguments.length <= 0 ? undefined : arguments[0], arguments.length <= 1 ? undefined : arguments[1]);
  }

  return createMultipleReducers(arguments.length <= 0 ? undefined : arguments[0]);
};

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function callReducer(reducer, state, context) {
  return reducer instanceof Function ? reducer(state, context) : reducer;
}

function createSingleReducerForProp(prop, reducer) {
  return function (state, context) {
    var prevValue = state[prop];
    var nextValue = callReducer(reducer, prevValue, context);
    if (nextValue !== prevValue) {
      return _extends({}, state, _defineProperty({}, prop, nextValue));
    }
    return state;
  };
}

function createMultipleReducers(reducers) {
  var pairs = Object.entries(reducers);
  return function (state, context) {
    return pairs.reduce(function (nextState, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          prop = _ref2[0],
          reducer = _ref2[1];

      var prevValue = state[prop];
      var nextValue = callReducer(reducer, prevValue, context);
      if (prevValue !== nextValue) {
        // if unchanged, we create new state from original state
        if (nextState === state) {
          nextState = _extends({}, state);
        }
        nextState[prop] = nextValue;
      }
      return nextState;
    }, state);
  };
}

function createMultipleReducersForProp(prop, reducers) {
  reducers = Object.entries(reducers).reduce(function (obj, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        action = _ref4[0],
        reducer = _ref4[1];

    action.split(/\s+/).forEach(function (action) {
      return reducers[action] = reducer;
    });
    return obj;
  }, {});

  return function (state, context) {
    if (context.action in reducers) {
      var prevValue = state[prop];
      var nextValue = callReducer(reducers[context.action], prevValue, context);

      if (nextValue !== prevValue) {
        return _extends({}, state, _defineProperty({}, prop, nextValue));
      }
    }
    return state;
  };
}

function createReducerForSpecificAction(prop, action, reducer) {
  var actions = (action instanceof Array ? action : action.split(/\s+/)).reduce(function (obj, action) {
    obj[action] = true;
    return obj;
  }, {});
  return function (state, context) {
    if (context.action in actions) {
      var prevValue = state[prop];
      var nextValue = callReducer(reducer, prevValue, context);
      if (prevValue !== nextValue) {
        return _extends({}, state, _defineProperty({}, prop, nextValue));
      }
    }
    return state;
  };
}
//# sourceMappingURL=index.js.map