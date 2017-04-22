"use strict";

import test from 'ava';
import createStore from '../index';
import is from './utilities/is';

const apiDefinition = {
    '__data': 'object',
    '__history': 'object',
    '__listeners': 'object',
    '__id': 'number',
    '__commit': 'function',
    '__getNextId': 'function',
    'subscribeToUpdates': 'function',
    'update': 'function',
    'getState': 'function'
};

test('Should expose createStore function', (t) => {
    t.is(typeof createStore, 'function', 'createStore is not a function');
});

test('API Keys check', (t) => {
    let store = createStore();
    let apiKeys = Object.keys(apiDefinition);
    let keys = Object.keys(store);

    t.deepEqual(apiKeys, keys, 'API has changed');
});

test('API Type check', (t) => {
    let store = createStore();
    let apiKeys = Object.keys(apiDefinition);

    apiKeys.forEach(key => {
        t.is(is(store[key]), apiDefinition[key], `${key} has different type`);
    });
});