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
        
        setStore = values => {
            for(let key in values) {
                if(types[key] === undefined) {
                    console.error(`Store error; cannot set '${key}' to '${values[key]}'; no such key`);
                }
                // Typechecking temporarily disabled
                //else if(typeof values[key] !== types[key]) {
                //    console.error(`Store type error; cannot set '${key}' (${types[key]}) to '${values[key]}' (${typeof values[key]})`);
                //    delete values[key];
                //}
                else if(this.props.logging) {
                    console.log(
                        `set %c${key}:`,
                        'background: rgb(0,0,128); color: white; padding: 0 2px;',
                        this.state[key],
                        '->',
                        values[key]
                    );
                }
            }
            
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