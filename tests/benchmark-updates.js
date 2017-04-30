"use strict";

import test from 'ava';
import { createStore } from '../index';

class ItemInList {
    constructor() {
        this.type = 'item';
        this.props = {
            foo: true,
            value: Math.random()
        };
    }
}

let initialData = {
    props: {
        loading: false,
        urls: {
            index: '/',
            api: '/api'
        }
    },
    someList: [
        new ItemInList()
    ]
};

test('Benchmark with more data', (t) => {
    let store = createStore();
    let now = Date.now();

    store.subscribeToUpdates(() => {
        let diff = Date.now() - now;
        t.is(diff < 16.66, true, 'Took more than 1fps');
    });

    // Update the store, 1000 times
    let i = 1000;
    while (--i) {
        initialData.someList.push(new ItemInList());
        now = Date.now();
        store.update(initialData);
    }
});
