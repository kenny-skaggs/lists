import { html } from "@arrow-js/core";

import ItemList from "../components/item_list";
import store_list from "../components/store_list";
import SearchBar from "../components/SearchBar";

const item_list = new ItemList();
const search_bar = new SearchBar();


export default {
    template: html`
        <section>${store_list.template}</section>
        <section>${item_list.render}</section>

        <div class="search-spacer"> </div>
        <div class="search-footer">
            ${search_bar.render}
        </div>
    `
}
