"use strict";
import fetch from 'node-fetch';
import test from 'ava';
import { createStore } from '../index';

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


test('Fetch modifiers', (t) => {
    let initialData = { loading: true, error: null };
    let apiEndpoint = 'https://baconipsum.com/api/?type=all-meat&paras=1&start-with-lorem=1';

    // Define the modifier
    let modifier = (cached, data) => {
        return fetch(apiEndpoint)
            .then(res => {
                return {
                    ...res.json,
                    loading: false
                }
            }, error => {
                return {
                    loading: false,
                    error: true
                }
            });
    };

    // New store
    let store = createStore();

    store.subscribeToUpdates((data) => {
        t.is(data.loading, false, 'Modifier did not worked');
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
