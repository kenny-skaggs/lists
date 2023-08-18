import { html } from "@arrow-js/core";

import ItemList from "../components/item_list";
import store_list from "../components/store_list";
import SearchBar from "../components/SearchBar";

const item_list = new ItemList();
const search_bar = new SearchBar();


const store_list_button = new store_list();

export default {
    template: html`
        <section class="row">
            <span class='page-title'>Groceries</span>
            ${store_list_button.render()}
        </section>
        <section>${item_list.render}</section>

        <div class="search-spacer"> </div>
        <div class="search-footer">
            ${search_bar.render}
        </div>
    `
}
