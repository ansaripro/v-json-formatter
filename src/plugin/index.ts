import './style.css';
import { App } from 'vue';
import type * as Types from './types/index';
import VJsonDrag  from "./components/VJsonDrag.vue";
import VJsonDrop  from "./components/VJsonDrop.vue";
import VJsonDragNDrop from "./components/VJsonDragNDrop.vue";
import VJsonEditor from "./components/VJsonEditor.vue";

const VJsonFormatterPlugin = {
  install: (app: App) => {
    app.component('VJsonDrag', VJsonDrag);
    app.component('VJsonDrop', VJsonDrop);
    app.component('VJsonDragNDrop', VJsonDragNDrop);
    app.component('VJsonEditor', VJsonEditor);
  }
};

export default VJsonFormatterPlugin;

export { VJsonDrag, VJsonDrop, VJsonDragNDrop, VJsonEditor, Types };