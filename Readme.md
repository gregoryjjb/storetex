# Storetex

> **Note:** this library is early in development and not suitable for production use.

*Extremely* simple state management for React, compatible with hooks.

[![npm version](https://img.shields.io/npm/v/storetex.svg?colorB=rgb%28203%2C%2056%2C%2055%29&style=flat-square)](https://www.npmjs.com/package/storetex) [![Build Status](https://img.shields.io/travis/com/gregoryjjb/storetex.svg?style=flat-square)](https://travis-ci.com/gregoryjjb/storetex) ![](https://img.shields.io/npm/l/storetex.svg?style=flat-square)

-----

## Usage

Create a Store Provider:

```javascript
import { createStore } from 'storetex';

const StoreProvider = createStore({ first: 1, second: 2 });
```

Wrap your App in the Provider:

```javascript
render(
    <StoreProvider logging={true}>
        <App />
    </StoreProvider>,
    document.getElementById("root")
);
```

And then access the store anywhere in your app, using a hook:

```javascript
import { useStore } from 'storetex';

const App = () => {
    // Get/set single values in the store
    const [first, setFirst] = useStore('first');

    // Or get/set the whole store in one go
    const [store, setStore] = useStore();

    return (
        <div>
            <p>My first value: {first}</p>
            <button onClick={() => setFirst(first + 1)}>
                Increment first
            </button>
        </div>
    )
}
```

Or using a Higher-Order Component:

```javascript
import { withStore } from 'storetex';

const App = withStore(({ store, setStore}) => (
    <div>
        <p>My first value: {store.first}</p>
        <button onClick={() => setStore({ first: store.first + 1 })}>
            Increment first
        </button>
    </div>
));
```

## Type Safety

Stortex will not insert a value into the store if it is either the wrong type or the key did not previously exist. For instance, if you have:

```
const StoreContext = createStore({ str: 'value', num: 10 });
```

Then the following will fail:

```
// Wrong type
setStore({ str: 567 });
setStore({ num: '10' });

// Doesn't exist
setStore({ what: 'who' });
```

Validation happens on a key-by-key basis, so other values passed in will still be updated if they are okay.

Since `null` is considered to be an object in Javascript, only set an initial value to `null` if you want that key to be an object in the future, not a literal.