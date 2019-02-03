import React from 'react';
import { mount } from 'enzyme';

import { createStore, useStore, withStore } from './index';

const generalTest = (Context, Child) => {

    const wrapper = mount(
        <Context logging={false}>
            <Child id="first" />
            <Child id="second" />
        </Context>
    );

    expect(wrapper.find('#first').contains('first is 1')).toBeTruthy();
    expect(wrapper.find('#second').contains('second is 2')).toBeTruthy();

    wrapper.find('#incrementfirst').simulate('click');

    expect(wrapper.find('#first').contains('first is 2')).toBeTruthy();
    expect(wrapper.find('#second').contains('second is 2')).toBeTruthy();

    wrapper.find('#incrementsecond').simulate('click');
    wrapper.find('#incrementsecond').simulate('click');

    expect(wrapper.find('#first').contains('first is 2')).toBeTruthy();
    expect(wrapper.find('#second').contains('second is 4')).toBeTruthy();

    wrapper.unmount();
};

const setup = () => {
    const StoreContext = createStore({ first: 1, second: 2 });
    //const wrapper = shallow(<StoreContext />);

    const HookTest = ({ id }) => {
        const [get, set] = useStore(id);

        return (
            <div>
                <p id={id}>{`${id} is ${get}`}</p>
                <button id={'increment' + id} onClick={() => set(get + 1)} />
            </div>
        );
    };

    const WholeStoreHookTest = ({ id }) => {
        const [store, setStore] = useStore();

        return (
            <div>
                <p id={id}>{`${id} is ${store[id]}`}</p>
                <button id={'increment' + id} onClick={() => setStore({ [id]: store[id] + 1 })} />
            </div>
        );
    };

    const HocTest = withStore(({ id, store, setStore }) => (
        <div>
            <p id={id}>{`${id} is ${store[id]}`}</p>
            <button id={'increment' + id} onClick={() => setStore({ [id]: store[id] + 1 })} />
        </div>
    ));

    class HocClassTest extends React.Component {
        render() {
            const { store, setStore, id } = this.props;

            return (
                <div>
                    <p id={id}>{`${id} is ${store[id]}`}</p>
                    <button id={'increment' + id} onClick={() => setStore({ [id]: store[id] + 1 })} />
                </div>
            )
        }
    }

    return { StoreContext, HookTest, WholeStoreHookTest, HocTest, HocClassTest: withStore(HocClassTest) };
}

describe('Store Context Tests', () => {
    it('updates with key hooks', () => {
        const { StoreContext, HookTest } = setup();
    
        generalTest(StoreContext, HookTest);
    });

    it('updates with store hooks', () => {
        const { StoreContext, WholeStoreHookTest } = setup();
    
        generalTest(StoreContext, WholeStoreHookTest);
    })

    it('updates with HOC', () => {
        const { StoreContext, HocTest } = setup();

        generalTest(StoreContext, HocTest);
    });

    it('updates with class component HCO', () => {
        const { StoreContext, HocClassTest } = setup();

        generalTest(StoreContext, HocClassTest);
    });
});

describe('Type Checking Tests', () => {
    it('prevents setting new keys', () => {
        const StoreContext = createStore({ pass: 'pass' });

        const Child = () => {
            const [fail, setFail] = useStore('fail');

            return (
                <div>
                    <p>{`fail is ${fail}`}</p>
                    <button onClick={() => setFail('fail')} />;
                </div>
            );
        };

        const wrapper = mount(
            <StoreContext logging={false}>
                <Child />
            </StoreContext>
        );

        wrapper.find('button').simulate('click');
        expect(wrapper.find('p').contains('fail is undefined')).toBeTruthy();

        wrapper.unmount();
    });

    it('prevents setting wrong type', () => {
        const StoreContext = createStore({ num: 1234 });

        const Child = () => {
            const [num, setNum] = useStore('num');

            return (
                <div>
                    <p>{`num is ${num}`}</p>
                    <button onClick={() => setNum('string')} />;
                </div>
            );
        };

        const wrapper = mount(
            <StoreContext logging={false}>
                <Child />
            </StoreContext>
        );

        console.log(wrapper.debug());

        expect(wrapper.find('p').contains('num is 1234')).toBeTruthy();
        wrapper.find('button').simulate('click');
        expect(wrapper.find('p').contains('num is 1234')).toBeTruthy();
        
        wrapper.unmount();
    })
})