import { reactive } from "@arrow-js/core";
import { Item } from "../model";
import server from "./server";


var nextId = 89;

class Store {
    constructor() {
        this._data = reactive({
            item_list: []
        });
    }
    get_item_list = () => this._data.item_list
    getItem = (item_id) => {
        console.log(this._data.item_list, item_id);
        return this._data.item_list.find((item) => item.id === item_id)
    }
    set_item_list = (item_list) => {
        this._data.item_list = item_list.sort((a, b) => (a.name < b.name) ? -1 : 1);
    }
    remove_item = (item_id) => this.set_item_list(
        this._data.item_list.filter((item) => item.id != item_id)
    )
    createItem = (name) => {
        const newItem = new Item(nextId, name);
        nextId += 1;
        this.addItem(newItem);
    }
    addItem = (item) => {
        server.add_item(item);
        this._data.item_list.push(item);
        this.set_item_list(this._data.item_list);  // to sort it after the add
    }
    updateItem = (item_id, item_data) => {
        const item = this.getItem(item_id);
        item.name = item_data.name;
        server.update_item(item);
    }
}

const storeInstance = new Store();

export default storeInstance;
