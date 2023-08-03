import { html } from "@arrow-js/core";
import store from "../services/store";
import router from "../router";
import button from "./button";

export default class {
    constructor(item) {
        this.item = item;
    }
    onItemClick = () => store.remove_item(this.item.id)
    onEditClick = (event) => {
        router.navigate(`/edit/${this.item.id}`);
    }
    render = () => {
        return html`
            <div class="item-row" @click="${this.onItemClick}">
                ${this.item.name}
                ${new button('Edit', 'secondary outline', this.onEditClick).template()}
            </div>
        `;
    }
}
