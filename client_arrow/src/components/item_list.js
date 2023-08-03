import { html } from "@arrow-js/core";

import ItemView from "./ItemView";
import store from "../services/store";


export default class {
    render = () => {
        return html`
            <div>
                ${store.get_item_list().map(
                    item => (new ItemView(item)).render
                )}
            </div>
        `;
    }
}
