import { html } from "@arrow-js/core";
import button from "../components/button";
import router from "../router";
import store from "../services/store";
import { Store } from "../model";


export default class {
    constructor(store_id) {
        if (store_id === undefined) {
            this.store = new Store(undefined, '');
        } else {
            this.store = store.getStore(store_id);
        }
    }
    closePage = () => {
        router.navigate('/stores');
    }
    onSubmit = () => {
        const name_input = document.getElementById('store-name');
        const color_input = document.getElementById('store-color');

        store.submitStore(
            new Store(this.store.id, name_input.value, color_input.value)
        ).then(this.closePage);
    }
    render = () => html`
        <h2>Edit Store</h2>
        <label for='store-name'>
            Name
            <input type="text" id="store-name" required value="${this.store.name}">
        </label>
        <label for="color">Color
            <input type="color" id="store-color" name="color" value="${this.store.color}">
        </label>
        ${new button('Save', '', this.onSubmit).template()}
        ${new button('Cancel', 'secondary', this.closePage).template()}
    `
}
