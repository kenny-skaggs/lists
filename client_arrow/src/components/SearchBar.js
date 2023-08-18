import { html, reactive } from "@arrow-js/core";

import server from "../services/server";
import SearchResultsList from "./SearchResultsList";
import { alphabeticalSort, debounce } from "../notsure/utilities";
import storeInstance from "../services/store";



export default class {
    constructor () {
        this.data = reactive({
            showResults: false,
            searchResults: [],
            searchText: ""
        });
        this._searchResultsDisplay = new SearchResultsList(this.onSearchComplete);
    }
    onSearchComplete = (selected_result) => {
        this.data.showResults = false;
        const element = document.getElementById("searchInput");
        element.value = "";

        if (selected_result === undefined) {
            return;
        }
        storeInstance.addToList(selected_result);
    }
    setNewResults = (result_list) => {
        this.data.searchResults = result_list.map((item) => {
            return {
                'isHighlighted': false,
                'item': item
            }
        });
        if (this.data.searchResults.length > 0) {
            this.data.searchResults[0].isHighlighted = true;
        }
        this._searchResultsDisplay.setResults(this.data.searchResults);
    }
    onEnterKey = () => {
        console.log('enter hit');
    }
    onArrowUp = () => {
        if (this.data.searchResults.length < 2) {
            return;
        }

        let highlightIndex = this.data.searchResults.findIndex(
            (item) => item.isHighlighted
        );

        this.data.searchResults[highlightIndex].isHighlighted = false;

        if (highlightIndex == 0) {
            highlightIndex = this.data.searchResults.length;
        }
        highlightIndex -= 1;
        this.data.searchResults[highlightIndex].isHighlighted = true;
    }
    onArrowDown = () => {
        if (this.data.searchResults.length < 2) {
            return;
        }

        let highlightIndex = this.data.searchResults.findIndex(
            (item) => item.isHighlighted
        );

        this.data.searchResults[highlightIndex].isHighlighted = false;

        highlightIndex += 1;
        if (highlightIndex == this.data.searchResults.length) {
            highlightIndex = 0;
        }
        this.data.searchResults[highlightIndex].isHighlighted = true;
    }
    onSearch = (event) => {
        if (event.code === 'Enter') {
            this.onEnterKey();
            return;
        }
        if (event.code === 'ArrowUp') {
            this.onArrowUp();
            return;
        }
        if (event.code === 'ArrowDown') {
            this.onArrowDown();
            return;
        }

        let search_text = event.target.value;
        let is_search_empty = search_text === "";

        this.data.showResults = !is_search_empty;
        this._searchResultsDisplay.setIsSearching(true);

        if (!is_search_empty) {
            debounce('search', () => {
                this.setNewResults([]);
                server.search(search_text).then((results) => {
                    // Don't process results if search text has been updated
                    const current_search_text = document.getElementById('searchInput').value;
                    if (current_search_text != search_text) {
                        return;
                    }

                    this.setNewResults(alphabeticalSort(results, 'name'));
                    this._searchResultsDisplay.setIsSearching(false);
                });
            });
        }
    }
    render = () => {
        return html`
            <div class="search-controls">
                <div class="search-footer">
                    <div class="results-box" hidden="${() => this.data.showResults === false}">
                        ${() => this._searchResultsDisplay.render()}
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
