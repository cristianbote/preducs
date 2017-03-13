export const TYPES = {
    UPDATE: 'update',
    REMOVE: 'REMOVE',
    DUMP: 'dump'
};

/**
 * Creates the store with data
 * @param {object} initialData
 * @param {object} interceptors
 * @returns {{data: {}, listeners: {all: Array}, interceptors: {}, update: update, remove: remove, dump: dump, subscribe: subscribe, trigger: trigger}}
 */
export default function createPreducs(initialData, interceptors = {}) {
    return {
        data: { ...initialData },
        listeners: { all: [] },
        interceptors: {...interceptors},

        /**
         * Update the store data
         * @param {object} item
         */
        update: function update(item) {
            let promise;
            let moder = this.interceptors[TYPES.UPDATE];

            if (moder) {
                promise = new Promise((resolve, reject) => {
                    resolve(moder(item, this.data));
                });
            } else {
                this.data = { ...item };
                promise = Promise.resolve(this.data);
            }

            promise
                .then(res => {
                    this.data = res;
                })
                .then((res) => {
                    this.trigger(TYPES.UPDATE, this.data);
                });
        },

        /**
         * Removes an item from the store, based on a key
         * @param {object} item
         */
        remove: function remove(item) {
            let promise;
            let moder = this.interceptors[TYPES.REMOVE];

            if (moder) {
                promise = new Promise((resolve, reject) => {
                    resolve(moder(item, this.data));
                });
            } else {
                delete this.data[item.key];
                promise = Promise.resolve(this.data);
            }

            promise
                .then(res => {
                    this.data = res;
                })
                .then((res) => {
                    this.trigger(TYPES.REMOVE, this.data);
                });
        },

        /**
         * Dumps the data into the store.
         * @param {object} data
         */
        dump: function dump(data) {
            let promise;
            let moder = this.interceptors[TYPES.DUMP];

            if (moder) {
                promise = new Promise((resolve, reject) => {
                    resolve(moder(data, this.data));
                });
            } else {
                this.data = { ...data };
                promise = Promise.resolve(this.data);
            }

            promise
                .then(res => {
                    this.data = res;
                })
                .then((res) => {
                    this.trigger(TYPES.DUMP, this.data);
                });
        },

        /**
         * Subscribe to store changes
         * @param {function} listener
         * @param {string} key
         */
        subscribe: function subscribe(listener, key) {
            let bucket = this.listeners.all;

            if (key) {
                bucket = this.listeners[key] || (this.listeners[key] = []);
            }

            bucket.push(listener);
        },

        /**
         * Triggers the store changes
         * @param {string} type
         * @param {object} data
         * @param {object} [item]
         */
        trigger: function trigger(type, data, item) {
            let all = this.listeners.all.slice();
            let bucket = this.listeners[type] || [];
            let i = 0;
            let l = all.length;

            // Concat both trigger options
            all = all.concat(bucket);

            for (; i < l; i += 1) {
                all[i](type, data, item);
            }
        }
    }
}