import createPreducs from '../preducs';

// Define store model
const defaultStoreModel = {
    items: [
        { name: 'Buy milk', checked: true }
    ]
};

// Define modifiers if needed
const interceptors = {

    update: (fresh, cached) => {
        let out = { ...cached };
        let cachedItem = out.items.filter(item => {
            return item.name === fresh.name;
        })[0];

        if (cachedItem) {
            cachedItem.checked = fresh.checked;
        } else {
            out.items.push(fresh);
        }

        return out;
    }

};

// Finally, our pedux
const initialStore = createPreducs(defaultStoreModel, interceptors);

export default initialStore;