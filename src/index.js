import React, { Component, useContext } from 'react';

const StoreContext = React.createContext({ store: {}, setStore: () => {} });

export const createStore = defaultState => {
    const types = {};
    for (let key in defaultState) {
        types[key] = typeof defaultState[key];
    }
    
    console.log('TYPES', types);
    
    class StoreProvider extends Component {
        state = {
            ...defaultState,
        };
        
        setStore = values => {
            for(let key in values) {
                if(types[key] === undefined) {
                    console.error(`Store error; cannot set '${key}' to '${values[key]}'; no such key`);
                }
                else if(typeof values[key] !== types[key]) {
                    console.error(`Store type error; cannot set '${key}' (${types[key]}) to '${values[key]}' (${typeof values[key]})`);
                    delete values[key];
                }
                else {
                    console.log(
                        `set %c${key}:`,
                        'background: rgb(0,0,128); color: white; padding: 0 2px;',
                        this.state[key],
                        '->',
                        values[key]
                    );
                }
            }
            
            //console.log('SetStore:', this.state, '->', newState);
            
            this.setState({ ...values });
        }
        
        render() {
            return (
                <StoreContext.Provider
                    value={{
                        store: { ...this.state },
                        setStore: this.setStore,
                    }}>
                    {this.props.children}
                </StoreContext.Provider>
            );
        }
    }
    
    return StoreProvider;
}

export const withStore = Comp => props => {
    return (
        <StoreContext.Consumer>
            {({ store, setStore }) => (
                <Comp {...props} store={store} setStore={setStore} />
            )}
        </StoreContext.Consumer>
    )
}

export const useStore = (key) => {
    const { store, setStore } = useContext(StoreContext);
    if(key === undefined) {
        return [
            store,
            setStore,
        ];
    } else {
        return [
            store[key],
            value => setStore({ [key]: value }),
        ];
    }
}