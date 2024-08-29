<script setup>
import VJsonDrag from '../components/VJsonDrag.vue'
</script>

# VJsonDrag

## API
[VJsonDrag](/api/vjsondrag)

## Usage
::: code-group
```vue
<template>
  <v-json-drag
    group="jdrag"
    expand-icon="fa-solid fa-chevron-down"
    collapsed-icon="fa-solid fa-chevron-right"
    copy-icon="fa-regular fa-copy"
    v-model="model"
    @copy="onCopy" />
</template>
```
```JS
<script setup lang="ts">
import { ref } from 'vue';

const model = ref([
  {
    id: 1,
    key: '',
    value: {"prop":"test"},
    type: 'object',
    isCustom: false,
    path: '$.prop',
    parentType: null,
    disabled: false,
    isOpen: true,
    children: [{
      id: 2,
      key: 'prop',
      value: 'test',
      type: 'string',
      isCustom: false,
      path: '$.prop',
      parentType: 'object',
      disabled: false,
      isOpen: false,
      children: [],
    }],
  }
]);
function onCopy(obj: any) {
  alert(`Copy Key: ${obj.key}`);
}
</script>
```
::: 

## Preview

::: raw
<client-only>
  <VJsonDrag/>
</client-only>
:::