# Getting Started

## Pre-Requisite / Dependencies

[Vue 3](https://vuejs.org/)<br/>
[Vuedraggable](https://github.com/SortableJS/vue.draggable.next) version 4.1.0 or latest (vuedraggable@next)<br/>

## Installation

```
npm i v-json-formatter
```

## Global Plugin Registration
```vue
<script setup>
import 'v-json-formatter/dist/style.css'
import VJsonFormatterPlugin from 'v-json-formatter';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App)
app.use(VJsonFormatterPlugin);
app.mount('#app');
</script>
```

## Global Component Registration
```vue
<script setup>
import 'v-json-formatter/dist/style.css'
import { VJsonDrag, VJsonDrop, VJsonDragNDrop, VJsonEditor } from 'v-json-formatter';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App)

// Add all these component(s) except if you're going to design your own VJsonDragNDrop component
app.component('VJsonDrag', VJsonDrag);
app.component('VJsonDrop', VJsonDrop);
app.component('VJsonEditor', VJsonEditor);
app.component('VJsonDragNDrop', VJsonDragNDrop);

app.mount('#app');
</script>
```

## Local Registration
```vue
<template>
  <v-datatable-plus
    :headers="headers"
    :items="items"/>
</template>

<script setup>
import 'v-datatable-plus/dist/style.css'
import { VDatatablePlus, FilterType, FilterMode } from  'v-datatable-plus';

const headers = ref([
// ...
]);
const items = ref([
// ...
])
</script>
```

::: code-group
```vue [App.vue]
<template>
  <div id="app"/>
</template>

<script setup>
import { VDataTable } from 'vuetify/components';
</script>
```
:::


## FilterType
::: raw
<table>
    <thead>
        <tr>
            <th>Types</th>
            <th>String Value</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>IsEqualTo</td>
            <td>'eq'</td>
        </tr>
        <tr>
            <td>IsNotEqualTo</td>
            <td>'neq'</td>
        </tr>
        <tr>
            <td>StartWith</td>
            <td>'starts'</td>
        </tr>
        <tr>
            <td>Contains</td>
            <td>'contains'</td>
        </tr>
        <tr>
            <td>NotContains</td>
            <td>'notcontains'</td>
        </tr>
        <tr>
            <td>EndWith</td>
            <td>'ends'</td>
        </tr>
    </tbody>
</table>
:::

## FilterMode
::: raw
<table>
    <thead>
        <tr>
            <th>Modes</th>
            <th>String Value</th>
            <th>Detail</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Selection</td>
            <td>'selection'</td>
            <td>Set when you need dropdown filter and set filter properties against headers props</td>
        </tr>
        <tr>
            <td>Types</td>
            <td>'types'</td>
            <td></td>
        </tr>
    </tbody>
</table>
:::