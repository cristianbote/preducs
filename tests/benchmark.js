"use strict";

import test from 'ava';
import { createStore } from '../index';

test('Benchmark how fast the subscriber is called', (t) => {
    let initialData = { foo: true, list: [] };
    let store = createStore();
    let now;

    store.subscribeToUpdates((data) => {
        let diff = Date.now() - now;
        t.is(diff < 16.66, true, 'Took more than 1fps');
        t.deepEqual(data, initialData, 'Data is different from initialData');
    });

    // Update the store
    now = Date.now();
    store.update(initialData);
});
