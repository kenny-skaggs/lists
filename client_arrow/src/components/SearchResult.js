import { html } from "@arrow-js/core";


export default class {
    constructor (search_result, clickCallback) {
        this.search_result = search_result;
        this._clickCallback = clickCallback;
    }
    onClick = () => {
        this._clickCallback(this.search_result.item);
    }
    getClassList = () => {
        let classes = "search-result-item";
        if (this.search_result.isHighlighted) {
            classes += " highlighted";
        }
        return classes;
    }
    render = () => {
        return html`
            <div
                class="${() => this.getClassList()}"
                @click="${this.onClick}"
            >
                ${this.search_result.item.name}
            </div>
        `
    }
}
