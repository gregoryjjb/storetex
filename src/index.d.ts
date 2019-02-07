import * as React from 'react';

export interface StoreProviderProps {
    logging?: boolean,
};

export class StoreProvider extends React.Component<StoreProviderProps, any> { };

export function createStore(defaultState: object): StoreProvider;

export function withStore(Comp: React.Component): React.Component;

export function useStore(key?: string): any;