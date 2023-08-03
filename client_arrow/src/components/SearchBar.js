import { html, reactive } from "@arrow-js/core";

import server from "../services/server";
import SearchResultsList from "./SearchResultsList";



export default class {
    constructor () {
        this.data = reactive({
            showResults: false,
            searchText: ""  // wtf: can't clear this if it starts as an empty string
        });
        this._searchResults = new SearchResultsList(this.onSearchComplete);
    }
    onSearchComplete = () => {
        this.data.showResults = false;

        const element = document.getElementById("searchInput");
        element.value = "";
        console.log('search complete')
    }
    onSearch = (event) => {
        let search_text = event.target.value;
        let is_search_empty = search_text === "";

        this.data.showResults = !is_search_empty;

        if (!is_search_empty) {
            this._searchResults.setResults([]);
            server.search(search_text).then((results) => {
                this._searchResults.setResults(results);
            });
        }
    }
    render = () => {
        return html`
            <div class="search-controls">
                <div class="search-footer">
                    <div class="results-box" hidden="${() => this.data.showResults === false}">
                        ${this._searchResults.render()}
                    </div>
                    <input
                        id="searchInput"
                        value="${() => this.data.searchText}"
                        type="search" @keyUp="${this.onSearch}" 
                        placeholder="What is desired?"
                    />
                </div>
            </div>
        `;
    }
}
