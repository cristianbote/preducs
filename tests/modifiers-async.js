"use strict";

import test from 'ava';
import createStore from '../index';

test('Promise based modifiers', (t) => {
    let initialData = { foo: true, baz: { foo: 1 } };

    // Define the modifier
    let modifier = (cached, data) => {
        t.notDeepEqual(cached, data, 'Cached and passed in data do match');

        return new Promise((resolve) => {
            resolve({ ...data, modified: true });
        });
    };

    // New store
    let store = createStore();

    store.subscribeToUpdates((data) => {
        t.is(data.modified, true, 'Modifier did not worked');
    });

    // Update the store
    store.update(initialData, modifier);
});

test('Error flow for async modifiers', (t) => {
    let initialData = { foo: true, baz: { foo: 1 } };

    // Define the modifier
    let modifier = (cached, data) => {
        t.notDeepEqual(cached, data, 'Cached and passed in data do match');

        return new Promise((resolve, reject) => {
            reject();
        });
    };

    // New store
    let store = createStore();

    store.subscribeToUpdates((data) => {
        t.is(data.modified, false, 'Modifier did not worked');
    });

    // Update the store
    store.update(initialData, modifier);
});
