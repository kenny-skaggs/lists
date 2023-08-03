import { html, reactive } from "@arrow-js/core";

import "./main.sass";
import Homepage from "./screens/Homepage";
import Edit from "./screens/Edit";
import nav_bar from "./components/nav_bar";
import router from "./router";
import server from "./services/server";
import store from "./services/store";

const display = reactive({
    page: Homepage.template
});

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
router.resolve();


server.load_items().then((items) => store.set_item_list(items));


const rootElement = document.getElementById('app');
const app = html`
    ${nav_bar.template}

    <main class="container">
        ${() => display.page}
    </main>
`
app(rootElement);
