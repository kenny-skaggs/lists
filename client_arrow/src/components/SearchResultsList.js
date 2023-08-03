import { html, reactive } from "@arrow-js/core";

import SearchResult from "./SearchResult";
import Button from "./button";
import router from "../router";


export default class {
    constructor (doneCallback) {
        this.data = reactive({
            results: []
        });
        this._doneCallback = doneCallback;
    }
    setResults = (results) => {
        this.data.results = results;
    }
    onResultClicked = () => {
        this._doneCallback();
    }
    onAddClicked = () => {
        router.navigate('/edit');
        this._doneCallback();
    }
    getResultsDisplay = () => {
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
            ${new Button('Add New Item', 'secondary outline float-right', this.onAddClicked).template()}
            ${() => this.getResultsDisplay()}
        `;
    }
}
