import { html } from "@arrow-js/core";


export default class {
    constructor(content) {
        this._content = content;
    }
    render = () => {
        return html`
            <dialog open>
                <article>
                    ${this._content}
                </article>
            </dialog>
        `
    }
}
