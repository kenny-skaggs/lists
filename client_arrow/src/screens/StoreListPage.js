import { html } from "@arrow-js/core";

import button from "../components/button";
import router from "../router";
import store from "../services/store";
import store_name_display from "../components/store_name_display";


export default class {
    onBackClicked = () => {
        router.navigate('/');
    }
    onEditClicked = (store) => {
        return () => router.navigate(`/store/${store.id}`);
    }
    onAddClicked = () => router.navigate('/store')
    getStoreDisplay = (store) => {
        return html`
            <div class="row">
                ${new store_name_display(store).render()}
                ${new button("Edit", 'secondary outline', this.onEditClicked(store)).template()}
            </div>
        `;
    }
    render = () => {
        return html`
            <h2>Stores</h2>
            <article>
                ${() => store.getStoreList().map(
                    store => this.getStoreDisplay(store)
                )}
                <footer>
                    ${new button('Add', '', this.onAddClicked).template()}
                    ${new button('Done', 'secondary', this.onBackClicked).template()}
                </footer>
            </article>
        `
    }
}
