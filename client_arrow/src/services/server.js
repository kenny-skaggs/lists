
import { Item } from "../model";


const _items = [
    new Item(1, "bagel chips"),
    new Item(2, "beef jerky"),
    new Item(3, "gochugeauaru"),
    new Item(18, "one"), 
    new Item(20, "two"), 
    new Item(25, "zen"), 
    new Item(32, "foo")
];

const _server_item_list = [
    _items[0], _items[1], _items[2]
];

export default {
    load_items: () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(_server_item_list);
            }, 1000);
        });
    },
    search: (search_text)=> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(
                    _items.filter(
                        (item) => item.name.includes(search_text)
                    ).sort(
                        (a, b) => (a.name < b.name) ? -1 : 1
                    )
                );
            }, 1000);
        });
    },
    add_item: (item) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                _items.push(item);
                resolve();
            }, 1000);
        })
    },
    update_item: (item_update) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const item = _items.find((i) => item_update.id === i.id);
                item.name = item_update.name;
            }, 1000);
        })
    }
};
