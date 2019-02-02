# Storetex

## Note: this library is early in development and not suitable for production use.

*Extremely* simple state management for React.

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