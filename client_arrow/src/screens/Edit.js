import { html } from "@arrow-js/core";

import router from "../router";
import Button from "../components/button";
import store from "../services/store";
import { Item } from "../model";


export default class {
    constructor(item_id) {
        this._item_id = item_id;

        if (this._item_id !== undefined) {
            const item = store.getItem(this._item_id);
            this._name = item.name;
        } else {
            this._name = "";
        }
    }
    onSubmit = () => {
        const name_input = document.getElementById('item-name');

        if (this._isEditingItem()) {
            store.updateItem(this._item_id, new Item(this._item_id, name_input.value));
        } else {
            store.createItem(name_input.value);
        }
        this.onClose();
    }
    onClose = () => {
        router.navigate('/');
    }
    _isEditingItem = () => this._item_id !== undefined
    render = () => {
        return html`
            <label for="item-name">
                Item Name
                <input type="text" id="item-name" required value="${this._name}">
            </label>
            <div class="float-right">
                ${new Button(
                    this._isEditingItem() ? 'Save' : 'Add', "", this.onSubmit
                ).template()}
                ${new Button('Cancel', "secondary", this.onClose).template()}
            </div>
        `
    }
}
