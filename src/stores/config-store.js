import createEasyflux from '../../preducs-two';

let configStore = createEasyflux({
    step: 100,
    items: []
}, true);

function updateOrAddModifier(cachedState, state) {
    cachedState.items = cachedState.items.map(item => {

        if (item.id === state.id) {
            return state;
        }

        return item;
    });

    return cachedState;
}

function updateItemsModifier(cachedState, state) {
    cachedState.items = ((cachedState.items && cachedState.items.slice()) || []).concat(state);
    return cachedState;
}

export {
    updateOrAddModifier,
    updateItemsModifier
}

export default configStore;