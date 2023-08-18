import { html } from "@arrow-js/core";

import router from "../router";
import Button from "../components/button";
import store from "../services/store";
import { Item } from "../model";
import storeDisplay from "../components/store_name_display";


export default class {
    constructor(item_id) {
        this._item_id = item_id;

        if (this._item_id !== undefined) {
            this._item = store.getItem(this._item_id);
            this._name = this._item.name;
            this._store_ids = this._item.store_ids;
        } else {
            this._item = undefined;
            this._name = "";
            this._store_ids = [];
        }
    }
    onSubmit = () => {
        const name_input = document.getElementById('item-name');

        if (this._isEditingItem()) {
            store.updateItem(
                new Item(this._item_id, name_input.value, this._store_ids)
            ).then(this.onClose);
        } else {
            store.createItem(name_input.value, this._store_ids).then(this.onClose);
        }
    }
    onClose = () => {
        router.navigate('/');
    }
    _isEditingItem = () => this._item_id !== undefined
    onStoreInput = (store_id) => {
        return (event) => {
            const isChecked = event.target.checked;
            if (isChecked) {
                this._store_ids = [...this._store_ids, store_id];
            } else {
                this._store_ids = this._store_ids.filter((id) => id != store_id);
            }
        }
    }
    getStoreIsChecked = (store) => this._store_ids.includes(store.id)
    getStoreSelection = () => {
        return html`
            <section class="store-list-display">
                ${() => {
                    return store.getStoreList().map((store) => {
                        const filter_id = `store-${store.id}`
                        return html`
                            <label for="${filter_id}">
                                <input type="checkbox"
                                    id="${filter_id}"
                                    @input="${this.onStoreInput(store.id)}"
                                    checked="${() => this.getStoreIsChecked(store)}"
                                >
                                ${new storeDisplay(store).render()}
                            </label>
                        `
                    })
                }}
            </section>
        `
    }
    getTitleText = () => {
        if (this._isEditingItem()) {
            return `Edit '${this._item.name}'`;
        } else {
            return 'Add New Item';
        }
    }
    render = () => {
        return html`
            <section class='page-title'>
                ${this.getTitleText()}
            </section>
            <section>
                <label for="item-name">
                    Item Name
                    <input type="text" id="item-name" required value="${this._name}">
                </label>
                ${() => this.getStoreSelection()}
            </section>
            <div class="float-right">
                ${new Button(
                    this._isEditingItem() ? 'Save' : 'Add', "", this.onSubmit
                ).template()}
                ${new Button('Cancel', "secondary", this.onClose).template()}
            </div>
        `
    }
}
