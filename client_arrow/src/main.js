import { html, reactive } from "@arrow-js/core";

import "./main.sass";
import Homepage from "./screens/Homepage";
import Edit from "./screens/Edit";
import nav_bar from "./components/nav_bar";
import router from "./router";
import server from "./services/server";
import store from "./services/store";
import StoreListPage from "./screens/StoreListPage";
import StoreEdit from "./screens/StoreEdit";
import loading_overlay from "./components/loading_overlay";
import app_state from "./notsure/app_state";

const display = reactive({
    page: Homepage.template
});
const loadingOverlayRender = new loading_overlay().render();

router.on('/', function () {
    display.page = Homepage.template;
});
router.on('/home', function () {
    display.page = Homepage.template;
});
router.on('/edit', function () {
    const edit_page = new Edit();
    display.page = edit_page.render();
});
router.on(/edit\/(.*)/, (match) => {
    const item_id = parseInt(match.data[0]);
    const edit_page = new Edit(item_id);
    display.page = edit_page.render();
});
router.on('/stores', () => {
    const stores_page = new StoreListPage();
    display.page = stores_page.render();
});
router.on('/store', (match) => {
    const store_edit_page = new StoreEdit();
    display.page = store_edit_page.render();
});
router.on(/store\/(.*)/, (match) => {
    const store_id = parseInt(match.data[0]);
    const store_edit_page = new StoreEdit(store_id);
    display.page = store_edit_page.render();
});
router.resolve();


server.load_items().then((items) => store.set_item_list(items));
server.load_stores().then((stores) => store.setStoreList(stores));


const rootElement = document.getElementById('app');
const app = html`
    ${nav_bar.template}

    <main class="container">
        ${() => display.page}
    </main>

    ${() => {
        if (app_state.getIsLoading()) {
            return loadingOverlayRender;
        } else {
            return '';
        }
    }}
`
app(rootElement);
