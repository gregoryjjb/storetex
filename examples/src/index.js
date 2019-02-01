import React from 'react';
import { render} from 'react-dom';
import { createStore, useStore } from '../../src';

const StoreProvider = createStore({ first: 1, second: 2 });

const First = () => {
    const [first, setFirst] = useStore('first');
    
    return (
        <div>
            <p>First is {first}</p>
            <button onClick={() => setFirst(first + 1)}>
                Increment first
            </button>
        </div>
    )
}

const Second = () => {
    const [second, setSecond] = useStore('second');
    const [, setStore] = useStore();
    
    return (
        <div>
            <p>Second is {second}</p>
            <button onClick={() => setStore({ third: 5 })}>
                Increment second
            </button>
        </div>
    )
}

const App = () => (
    <StoreProvider>
        <h1>Store Example</h1>
        <First />
        <Second />
    </StoreProvider>
);
render(<App />, document.getElementById("root"));