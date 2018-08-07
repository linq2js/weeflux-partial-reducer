# weeflux-partial-reducer
A partital reducer creator for weeflux

```js
import flux from 'weeflux';
import partial from 'weeflux-partial-reducer';

// reducer for text prop
flux(partial('text', actions.textChanged, (state, { payload }) => payload));

flux(
  partial(
    // reducer for profile prop
    'profile',
    // handle multiple actions with one reducer
    [actions.profileLoaded, actions.profileFailed, actions.profileLoading],
    (state, { payload }) => payload
  )
);
```
