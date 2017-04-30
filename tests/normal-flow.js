"use strict";

import test from 'ava';
import { createStore } from '../index';
import is from './utilities/is';

test('Create a store with initial data', (t) => {
    let initialData = { foo: true, baz: { foo: 1 } };
    let store = createStore(initialData);

    t.deepEqual(
        store.getState(), initialData,
        'getState() returned different data'
    );
});

test('Create a store and call update', (t) => {
    let data = { foo: true, baz: { foo: 1 } };
    let store = createStore();

    t.deepEqual(
        store.getState(), {},
        'getState() returned non-empty initialData'
    );

    // Update the store with data
    store.update(data);

    // Should be equal
    t.deepEqual(
        store.getState(), data,
        'getState() returned differnet stateData that was just updated'
    );
});

test('Create a store and subscribe to updates', (t) => {
    let data = { foo: true, baz: { foo: 1 } };
    let store = createStore();

    // Subscriber
    let listener = (newData) => {
        t.deepEqual(
            newData, data,
            'Subscriber should have been called with proper data'
        );
    };

    // Subscribe to updates
    let unsubscribe = store.subscribeToUpdates(listener);

    // Make sure the store registered the subscriber
    t.is(is(unsubscribe), 'function', 'Store should have returned the unsubscriber');

    // Update the store with data
    store.update(data);
});

test('Create a store, subscribe and unsubscribe', (t) => {
    let data = { foo: true, baz: { foo: 1 } };
    let store = createStore();
    let subscriber = () => {
        throw new Error('Subscriber should not been called');
    };

    // Subscribe to updates
    let unsubscribe = store.subscribeToUpdates(subscriber);

    // Call the unsubscriber
    unsubscribe();

    store.update({ prop: true });
});
