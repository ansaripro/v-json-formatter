<script setup lang="ts">
import { ref } from 'vue';

const model = ref([]);
const globalId = ref(0);
function editProp(obj: any) {
  alert(`Edit Key: ${obj.key}`);
}
function event(obj: any) {
  alert(`Event Key: ${obj.key}`);
}
</script>

<template>
  <div class="v-json-formmatter">
    <v-json-drop
      group="jdrop"
      expand-icon="fa-solid fa-chevron-down"
      collapsed-icon="fa-solid fa-chevron-right"
      copy-icon="fa-regular fa-copy"
      paste-icon="fa-solid fa-paste"
      add-icon="fa-solid fa-plus"
      edit-icon="fa-solid fa-pen-to-square"
      delete-icon="fa-regular fa-trash-can"
      v-model:global-id="globalId"
      v-model="model"
      @edit-property="editProp"
      @event="event" />
  </div>
</template>