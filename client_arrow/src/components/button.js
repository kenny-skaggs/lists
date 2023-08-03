import { html } from "@arrow-js/core";


export default class {
    constructor (text, classes, clickCallback) {
        this._text = text;
        this._classes = classes;
        this._click_callback = clickCallback
    }
    _on_click = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._click_callback();
        return false;
    }
    template = (text, route) => {
        return html`
            <a href="#" role="button" class="${this._classes}"
                @click="${this._on_click}"
            >
                ${this._text}
            </a>`;
    }
}