import { reactive } from "@arrow-js/core";
import { Item } from "../model";
import server from "./server";
import { alphabeticalSort } from "../notsure/utilities";
import { Store } from "../model";


class StoreService {
    constructor() {
        this._data = reactive({
            item_list: [],
            store_list: []
        });
    }
    get_item_list = () => this._data.item_list
    getStoreList = () => this._data.store_list
    getItem = (item_id) => {
        return this._data.item_list.find((item) => item.id === item_id)
    }
    getStore = (store_id) => this._data.store_list.find((store) => store.id == store_id);
    set_item_list = (item_list) => {
        this._data.item_list = alphabeticalSort(item_list, 'name');
    }
    setStoreList = (store_list) => {
        this._data.store_list = alphabeticalSort(store_list, 'name');
    }
    addToList = (item) => {
        return server.markItemNeeded(item.id, true).then(() => {
            this._data.item_list.push(item);
            this.set_item_list(this._data.item_list);  // to sort it after the add
        });
    }
    remove_item = (item_id) => {
        server.markItemNeeded(item_id, false).then(() => {
            const newList = this._data.item_list.filter((item) => item.id != item_id);
            this.set_item_list(newList);
        });
    }
    createItem = (name, store_ids) => {
        const newItem = new Item(undefined, name, store_ids);
        return server.add_item(newItem).then((itemId) => {
            newItem.id = itemId;
            this.set_item_list([...this._data.item_list, newItem]);
        });
    }
    updateItem = (item_data) => {
        const item = this.getItem(item_data.id);
        item.name = item_data.name;
        item.store_ids = item_data.store_ids;
        return server.update_item(item).then(() => {
            this.set_item_list(this._data.item_list);
        });
    }
    submitStore = (store_data) => {
        let store = undefined;
        let store_list = [...this._data.store_list];
        if (store_data.id === undefined) {
            store = new Store(undefined, store_data.name, store_data.color);
            store_list.push(store);
        } else {
            store = this.getStore(store_data.id);
            store.name = store_data.name;
            store.color = store_data.color;
        }
        return server.submitStore(store).then((store_id) => {
            store.id = store_id;
            this.setStoreList(store_list);
        });
    }
}

const storeInstance = new StoreService();

export default storeInstance;
