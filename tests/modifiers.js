"use strict";

import test from 'ava';
import createStore from '../index';
import is from './utilities/is';

test('Create a store with initial data and modifiers', (t) => {
    let initialData = { foo: true, baz: { foo: 1 } };

    // Define the modifier
    let modifier = (cached, data) => {
        t.notDeepEqual(cached, data, 'Cached and passed in data do match');

        return { ...data, modified: true };
    };

    // New store
    let store = createStore();

    store.subscribeToUpdates((data) => {
        t.is(data.modified, true, 'Modifier did not worked');
    });

    // Update the store
    store.update(initialData, modifier);
});
