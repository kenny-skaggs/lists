import { html } from "@arrow-js/core";
import storeInstance from "../services/store";


export default class {
    constructor (search_result, clickCallback) {
        this.search_result = search_result;
        this._clickCallback = clickCallback;
    }
    onClick = () => {
        storeInstance.addToList(this.search_result);
        this._clickCallback();
    }
    render = () => {
        return html`
            <div class="search-result-item" @click="${this.onClick}">${this.search_result.name}</div>
        `
    }
}
