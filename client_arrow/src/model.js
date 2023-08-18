
export class Item {
    constructor(id, name, store_ids = []) {
        this.id = id;
        this.name = name;
        this.store_ids = store_ids;
    }
}

export class Store {
    constructor(id, name, color) {
        this.id = id;
        this.name = name;
        this.color = color;
    }
}
