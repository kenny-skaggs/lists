import { html } from "@arrow-js/core";


export default class {
    constructor(store) {
        this._store = store;
    }
    render = () => html`
        <span
            class="store-name-display"
        >
            <span
                class="name"
                style="background-color: ${this._store.color}20"
            >
                <span
                    class="store-box"
                    style="background-color: ${this._store.color}"
                ></span>
                ${this._store.name}
            </span>
        </span>
    `
}
