import { reactive } from "@arrow-js/core";

class State {
    constructor() {
        this._data = reactive({
            store_filter: [],
            isLoadingCount: 0
        });
    }
    setStoreFilter = (list) => this._data.store_filter = list
    getStoreFilter = () => this._data.store_filter
    setIsLoading = (isLoading) => {
        this._data.isLoadingCount += (isLoading ? 1 : -1)
    }
    getIsLoading = () => this._data.isLoadingCount != 0
}

export default new State();
