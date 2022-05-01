/* eslint-disable vue/multi-word-component-names */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import "primevue/resources/themes/saga-orange/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css";

import Menubar from "primevue/menubar";
import InputText from "primevue/inputtext";
import Password from "primevue/password";
import Divider from "primevue/divider";
import Calendar from "primevue/calendar";
import Dropdown from "primevue/dropdown";
import Checkbox from "primevue/checkbox";
import Textarea from "primevue/textarea";
import Button from "primevue/button";
import Card from "primevue/Card";
import InputNumber from "primevue/inputnumber";
import Dialog from "primevue/dialog";
import DataTable from "primevue/datatable";
import Column from "primevue/column";

const app = createApp(App);

app.use(router);
app.use(PrimeVue);

app.component("Menubar", Menubar);
app.component("InputText", InputText);
app.component("Password", Password);
app.component("Divider", Divider);
app.component("Calendar", Calendar);
app.component("Dropdown", Dropdown);
app.component("Checkbox", Checkbox);
app.component("Textarea", Textarea);
app.component("Button", Button);
app.component("Card", Card);
app.component("InputNumber", InputNumber);
app.component("Dialog", Dialog);
app.component("DataTable", DataTable);
app.component("Column", Column);

app.mount("#app");
