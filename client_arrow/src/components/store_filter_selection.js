import { html } from "@arrow-js/core";
import store from "../services/store";
import button from "./button";
import store_filter_option from "./store_filter_option";
import router from "../router";


export default class {
    constructor(stores, done_callback) {
        this._stores = stores;
        this._done_callback = done_callback;
    }
    onManageStores = (event) => {
        event.preventDefault();
        router.navigate('/stores');
    }
    render = () => {
        return html`
            <a href="#" @click="${this.onManageStores}">Manage Stores</a>
            <hr>
            <div class='store-list-display'>
                ${() => store.getStoreList().map(
                    store => new store_filter_option(store).render()
                )}
            </div>
            <footer>
                ${new button("Done", "primary", this._done_callback).template()}
            </footer>
        `;
    }
}