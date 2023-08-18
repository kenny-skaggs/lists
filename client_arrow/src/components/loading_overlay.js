import { html } from "@arrow-js/core";


export default class {
    render = () => html`
        <dialog open>
            <div aria-busy="true" class="loading-spinner"></div>
        </dialog>
    `;
}