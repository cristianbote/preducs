# preducs

Tiny library to manage your application state. It supports interceptors(modifiers) to handle and modify data on the fly.

## How to use it
Check out the `tests` folder for usages, but this is the common usage.

```javascript
import createStore from 'preducs';

// Create the store
let store = createStore({
    loading: true // Your data
});

// Subscribe to updates
let unsubscribe = store.subscribeToUpdates((state) => {
    console.log('I got updated', state);
    
    // Unsubscribe the current listener
    unsubscribe();
});

// Update the store, with a call to a api
store.update({
    loading: false
}, (currentState, newState) => {
    return fetch('/api/endpoint')
        .then(res => {
            return {
                ...newState,
                ...res.json()
            }
        });
});

```
And that's about it!

## Instal it
`npm install preducs`
