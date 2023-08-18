import { html, reactive } from "@arrow-js/core";
import button from "./button";
import router from "../router";
import modal from "./modal";
import store_filter_selection from "./store_filter_selection";
import storeInstance from "../services/store";
import app_state from "../notsure/app_state";
import { alphabeticalSort } from "../notsure/utilities";


export default class {
    constructor() {
        this.data = reactive({
            modal_display: undefined
        });
    }
    onClick = () => {
        const filter_selection = new store_filter_selection(
            storeInstance.getStoreList(), this.onFilterDone
        );
        const filter_modal = new modal(filter_selection.render());
        this.data.modal_display = filter_modal.render();
    }
    onFilterDone = () => {
        this.data.modal_display = undefined;
    }
    getFilterText = () => {
        const filter_list = [...app_state.getStoreFilter()]
        const store_filter = alphabeticalSort(filter_list, 'name');
        if (store_filter.length == 0) {
            return "all stores";
        }

        return store_filter.map((store) => store.name).join(', ');
    }
    render = () => {
        return html`
            <div>${() => this.data.modal_display}</div>
            <div>
                ${() => new button(`showing ${this.getFilterText()}`, "secondary outline", this.onClick).template()}
            </div>
        `
    }
}
