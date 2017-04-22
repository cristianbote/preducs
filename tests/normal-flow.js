"use strict";

import test from 'ava';
import createStore from '../index';
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
    let initialId = store.__id;

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
    t.not(store.__id, initialId, 'Store should have registered the subscriber');
    t.is(is(unsubscribe), 'function', 'Store should have returned the unsubscriber');

    // Let's see if the registered subscriber matches the one passed in
    t.is(
        store.__listeners[Object.keys(store.__listeners)[0]],
        listener,
        'Registered subscriber does not match the passed in subscriber'
    );

    // Update the store with data
    store.update(data);
});

test('Create a store, subscribe and unsubscribe', (t) => {
    let data = { foo: true, baz: { foo: 1 } };
    let store = createStore();
    let subscriber = () => {};

    // Subscribe to updates
    let unsubscribe = store.subscribeToUpdates(subscriber);

    // Let's see if the registered subscriber matches the one passed in
    t.is(
        store.__listeners[Object.keys(store.__listeners)[0]],
        subscriber,
        'Registered subscriber does not match the passed in subscriber'
    );

    // Call the unsubscriber
    unsubscribe();

    t.is(Object.keys(store.__listeners).length, 0, 'There are still listeners where it should not have');
});
