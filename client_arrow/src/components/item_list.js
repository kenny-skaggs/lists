import { html } from "@arrow-js/core";

import ItemView from "./ItemView";
import store from "../services/store";
import app_state from "../notsure/app_state";


export default class {
    itemIsVisible = (item) => {
        const store_filter_list = app_state.getStoreFilter();
        if (store_filter_list.length === 0) {
            return true;
        }

        return store_filter_list.some((store) => item.store_ids.includes(store.id));
    }
    render = () => {
        return html`
            <div>
                ${store.get_item_list().filter(this.itemIsVisible).map(
                    item => (new ItemView(item)).render
                )}
            </div>
        `;
    }
}
