import React, { Component, useContext } from 'react';

const StoreContext = React.createContext({ store: {}, setStore: () => {} });

/**
 * Create a new Store Context
 * @param {object} defaultState Default state structure
 */
export const createStore = defaultState => {
    const types = {};
    for (let key in defaultState) {
        types[key] = typeof defaultState[key];
    }
    
    class StoreProvider extends Component {
        state = {
            ...defaultState,
        };

        error = (...args) => this.props.logging ? console.error(...args) : undefined;
        log = (...args) => this.props.logging ? console.log(...args) : undefined;
        
        setStore = values => {
            let newValues = {};

            for(let key in values) {
                if(types[key] === undefined) {
                    this.error(`Store error; cannot set '${key}' to '${values[key]}'; no such key`);
                }
                else if(typeof values[key] !== types[key]) {
                    this.error(`Store type error; cannot set '${key}' (${types[key]}) to '${values[key]}' (${typeof values[key]})`);
                }
                else {
                    this.log(
                        `set %c${key}:`,
                        'background: rgb(0,0,128); color: white; padding: 0 2px;',
                        this.state[key],
                        '->',
                        values[key]
                    );

                    newValues[key] = values[key];
                }
            }

            this.setState({ ...newValues });
            
        }
        
        render() {
            return (
                <StoreContext.Provider
                    value={{
                        error: this.error,
                        store: { ...this.state },
                        setStore: this.setStore,
                    }}>
                    {this.props.children}
                </StoreContext.Provider>
            );
        }
    }

    StoreProvider.defaultProps = {
        logging: true,
    };
    
    return StoreProvider;
}

/**
 * Higher-order component to inject store and setStore into props
 * @param {node} Comp Component to wrap
 */
export const withStore = Comp => props => {
    return (
        <StoreContext.Consumer>
            {({ store, setStore }) => (
                <Comp {...props} store={store} setStore={setStore} />
            )}
        </StoreContext.Consumer>
    )
}

/**
 * Hook to use a value from the store
 * @param {string} key Key of value to watch; leave blank for whole store
 */
export const useStore = (key) => {
    const { store, setStore, error } = useContext(StoreContext);
    if(key === undefined) {
        return [
            store,
            setStore,
        ];
    } else {
        if(store[key] === undefined) {
            error(`Store error; cannot get '${key}'; no such key`);
            return [
                undefined,
                value => error(`Store error; cannot set '${key}' to '${value}'; no such key`),
            ];
        }
        else {
            return [
                store[key],
                value => setStore({ [key]: value }),
            ];
        }
    }
}