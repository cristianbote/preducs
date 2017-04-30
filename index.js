/**
 * General purpose interceptor for modifying the data
 * @param {object} cached
 * @param {object} state
 * @param {function} [modifier]
 * @returns {object}
 */
function interceptor(cached, state, modifier) {
    if (modifier) {
        let out = modifier(cached, state);

        // If this is a promise-based modifier return the promise
        if (out.then) {
            return out;
        }

        return { ...(out) };
    }
    return { ...cached, ...state };
}

/**
 * Create an store instance.
 * @param {object} [initialData]
 * @returns {object}
 */
export default function createStore(initialData = {}) {
    let data = { ...initialData };
    let listeners = {};
    let id = 0;

    /**
     * Executes the subscribers
     * @param {object} data
     * @private
     */
    const commit = (data) => {
        Object.keys(listeners)
            .map(id => {
                listeners[id](data);
            });
    };

    /**
     * Handler to get a unique id. Silly.
     * @returns {number}
     * @private
     */
    const getNextId = () => ++id;

    return {

        /**
         * Subscribe to store changes and returns the unsubscriber.
         * @param {function} cb Subscriber
         * @returns {function}
         */
        subscribeToUpdates(cb) {
            let id = getNextId();
            listeners[id] = cb;

            return () => {
                delete listeners[id];
            }
        },

        /**
         * Updates the state with the given state and an optional modifier.
         * @param {object} state
         * @param {function} modifier
         */
        update(state = {}, modifier) {
            data = interceptor({ ...data }, state, modifier);

            // If we have a promise here
            if (data.then) {
                // Handle the resolve
                data.then(res => {
                    commit({ ...res });
                }, () => {
                    commit({ ...state });
                });
            } else {
                commit({...data});
            }
        },

        /**
         * Retuns a copy of the state
         * @returns {object}
         */
        getState() {
            return { ...data };
        }
    }
}