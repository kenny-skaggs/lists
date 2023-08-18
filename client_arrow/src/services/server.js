import { io } from "socket.io-client";

import { Item, Store } from "../model";
import app_state from "../notsure/app_state";
import { alphabeticalSort } from "../notsure/utilities";


const _stores = [
    new Store(1, "cost co", "#1177aa"),
    new Store(2, "natural grocers", "#885522")
];

const socket = io("localhost:5000");

const sendRequest = (showLoading = false) => {
    if (showLoading) {
        app_state.setIsLoading(true);
    }
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
            if (showLoading) {
                app_state.setIsLoading(false);
            }
        }, 1000);
    });
}

const socketPromise = (
    {event_name, payload = undefined, set_loading_state = false}
) => {
    if (set_loading_state) {
        app_state.setIsLoading(true);
    }
    return new Promise((resolve, reject) => {
        let emitArgs = [event_name];
        if (payload !== undefined) {
            emitArgs.push(payload);
        }
        socket.emit(...emitArgs, (response) => {
            if (set_loading_state) {
                app_state.setIsLoading(false);
            }
            resolve(response);
        });
    });
}



export default {
    load_items: () => {
        return socketPromise({
            event_name: 'load_item_list',
            set_loading_state: true
        }).then((list) => list.map((item) => {
            return new Item(item.id, item.name, item.locations);
        }));
    },
    search: (search_text)=> {
        return socketPromise({
            event_name: 'search',
            payload: search_text
        }).then((list) => list.map((item) => {
            return new Item(item.id, item.name);
        }));
    },
    add_item: (item) => {
        return socketPromise({
            event_name: 'upsert_item',
            set_loading_state: true,
            payload: {
                name: item.name,
                isNeeded: true,
                locations: item.store_ids
            }
        });
    },
    update_item: (item) => {
        return socketPromise({
            event_name: 'upsert_item',
            set_loading_state: true,
            payload: {
                id: item.id,
                name: item.name,
                locations: item.store_ids
            }
        });
    },
    markItemNeeded: (itemId, isNeeded) => {
        return socketPromise({
            event_name: isNeeded ? 'need_item' : 'do_not_need_item',
            payload: itemId,
            set_loading_state: true
        });
    },
    submitStore: (store_data) => {
        return socketPromise({
            event_name: 'upsert_location',
            set_loading_state: true,
            payload: store_data
        });
    },
    load_stores: () => {
        return socketPromise({
            event_name: 'load_locations',
            set_loading_state: true
        });
    },
};
