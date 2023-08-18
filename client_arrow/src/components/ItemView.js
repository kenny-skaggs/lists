import { html } from "@arrow-js/core";
import store from "../services/store";
import router from "../router";
import button from "./button";
import storeDisplay from "./store_name_display";

export default class {
    constructor(item) {
        this.item = item;
    }
    onItemClick = () => store.remove_item(this.item.id)
    onEditClick = (event) => {
        router.navigate(`/edit/${this.item.id}`);
    }
    getStoreIconDisplay = () => {
        return this.item.store_ids.map((id) => {
            const str = store.getStore(id);
            if (str !== undefined) {
                return new storeDisplay(str).render();
            }

            return '';
        })
    }
    render = () => {
        return html`
            <div class="item-row" @click="${this.onItemClick}">
                <span class="name">${this.item.name}</span>
                <div class='store-list-hint'>
                    ${this.getStoreIconDisplay()}
                </div>
                ${new button('Edit', 'secondary outline', this.onEditClick).template()}
            </div>
        `;
    }
}
