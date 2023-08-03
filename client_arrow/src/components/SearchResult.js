import { html } from "@arrow-js/core";

import tracking from "../notsure/item_tracking";


export default class {
    constructor (search_result, clickCallback) {
        this.search_result = search_result;
        this._clickCallback = clickCallback;
    }
    onClick = () => {
        tracking.addItem(this.search_result);
        this._clickCallback();
    }
    render = () => {
        return html`
            <div class="search-result-item" @click="${this.onClick}">${this.search_result.name}</div>
        `
    }
}
