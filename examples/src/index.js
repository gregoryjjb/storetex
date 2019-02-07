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
    
    return (
        <div>
            <p>Second is {second}</p>
            <button onClick={() => setSecond(second + 1)}>
                Increment second
            </button>
        </div>
    )
}

const WrongKey = () => {
    const [get, set] = useStore('nonexistantKey');

    return (
        <div>
            <p>Try to set a value that doesn't exist</p>
            <button onClick={() => set('newValue')}>
                Set 'nonexistantKey' to 'newValue'
            </button>
        </div>
    )
}

const WrongType = () => {
    const [get, set] = useStore('first');

    return (
        <div>
            <p>Try to set 'first' to a string</p>
            <button onClick={() => set('newValue')}>
                Set to 'MyString'
            </button>
        </div>
    )
}

const App = () => (
    <StoreProvider logging={true}>
        <h1>Store Example</h1>
        <First />
        <Second />
        <WrongKey />
        <WrongType />
    </StoreProvider>
);
render(<App />, document.getElementById("root"));