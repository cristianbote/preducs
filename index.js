/**
 * General purpose interceptor for modifying the data
 * @param {object} cached
 * @param {object} state
 * @param {function} [modifier]
 * @returns {object}
 */
function interceptor(cached, state, modifier) {
    if (modifier) {
        return { ...(modifier(cached, state)) };
    }
    return { ...cached, ...state };
}

/**
 * Create an store instance.
 * @param {object} [initialData]
 * @returns {object}
 */
export default function createStore(initialData = {}) {
    return {
        __data: { ...initialData },
        __history: {},
        __listeners: {},
        __id: 0,

        /**
         * Executes the subscribers
         * @param {object} data
         * @private
         */
        __commit(data) {
            Object.keys(this.__listeners)
                .map(id => {
                    this.__listeners[id](data);
                });
        },

        /**
         * Handler to get a unique id. Silly.
         * @returns {number}
         * @private
         */
        __getNextId() {
            return ++this.__id;
        },

        /**
         * Subscribe to store changes and returns the unsubscriber.
         * @param {function} cb Subscriber
         * @returns {function}
         */
        subscribeToUpdates(cb) {
            let id = this.__getNextId();
            this.__listeners[id] = cb;

            return () => {
                delete this.__listeners[id];
            }
        },

        /**
         * Updates the state with the given state and an optional modifier.
         * @param {object} state
         * @param {function} modifier
         */
        update(state = {}, modifier) {
            this.__history = { ...this.__data };
            this.__data = interceptor({ ...this.__data }, state, modifier);

            this.__commit({ ...this.__data });
        },

        /**
         * Retuns a copy of the state
         * @returns {object}
         */
        getState() {
            return { ...this.__data };
        }
    }
}