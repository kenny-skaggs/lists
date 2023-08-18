import { html } from "@arrow-js/core";
import app_state from "../notsure/app_state";
import storeDisplay from "./store_name_display";


export default class {
    constructor(store) {
        this._store = store;
    }
    onChange = (event) => {
        let store_filter = app_state.getStoreFilter();
        if (event.target.checked) {
            store_filter = [...store_filter, this._store];
        } else {
            store_filter = store_filter.filter((store) => store.id != this._store.id);
        }
        app_state.setStoreFilter(store_filter);
    }
    isChecked = () => {
        const filtered_ids = app_state.getStoreFilter().map(
            (store) => store.id
        );
        return filtered_ids.includes(this._store.id);
    }
    render = () => {
        const filter_id = `store-filter-${this._store.id}`
        return html`
            <label for="${filter_id}">
                <input type="checkbox" id="${filter_id}" @input="${this.onChange}" checked="${this.isChecked}">
                ${new storeDisplay(this._store).render()}
            </label>
        `
    }
}
