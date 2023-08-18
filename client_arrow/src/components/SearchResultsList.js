import { html, reactive } from "@arrow-js/core";

import SearchResult from "./SearchResult";
import Button from "./button";
import router from "../router";


export default class {
    constructor (doneCallback) {
        this.data = reactive({
            results: [],
            isSearching: true
        });
        this._doneCallback = doneCallback;
    }
    setIsSearching = (isSearching) => this.data.isSearching = isSearching;
    setResults = (results) => {
        this.data.results = results;
    }
    onResultClicked = (clicked_result) => {
        this._doneCallback(clicked_result);
    }
    onAddClicked = () => {
        router.navigate('/edit');
        this._doneCallback();
    }
    getResultsDisplay = () => {
        if (this.data.isSearching) {
            return html`<span aria-busy="true"></span>`
        }

        if (this.data.results.length == 0) {
            return html`<em>Not Found</em>`
        } else {
            return this.data.results.map(
                result => new SearchResult(result, this.onResultClicked).render()
            );
        }
    }
    render = () => {
        return html`
            <div class='results'>
                ${() => this.getResultsDisplay()} 
            </div>
            ${new Button('Add New Item', 'secondary outline add-new', this.onAddClicked).template()}
        `;
    }
}
