<script setup lang="ts">
import { computed } from 'vue'
import type { JsonDragProps, JsonProperty } from '../types/index'
import Draggable from 'vuedraggable';

const props = withDefaults(defineProps<JsonDragProps>(), { 
    text: '{}',
    // internal props
    level: 0,
    name: 'jdrag',
    type: '',
});

const emit = defineEmits([
    'update:modelValue',
    'copy',
]);

const jsonModel = computed({
  get() {
    return props.modelValue || [];
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

function getPreOperator(obj: JsonProperty) {
  let operator = '■';
  if (obj) {
      switch (obj.type) {
          case 'object':
              operator = '{ }';
              break;
          case 'array':
              operator = '[ ]';
              break;
          default:
              break;
      }
  }
  return operator;
};
function propClone(obj: JsonProperty): JsonProperty {
  return {
      id: obj.id,
      key: obj.key,
      value: obj.value,
      path: obj.path,
      type: obj.type,
      parentType: obj.parentType,
      isOpen: true,
      children: recursiveItems(obj.children),
  } as JsonProperty;
};
function recursiveItems(items?: JsonProperty[]) {
  if ((items?.length ?? 0) > 0) {
    return items?.map(x => {
      const obj = {
        id: x.id,
        key: x.key,
        value: x.value,
        type: x.type,
        parentType: x.parentType,
        isOpen: true,
        children: recursiveItems(x.children),
      } as JsonProperty;
      if (x.path) {
        const res = /[^.]*$/.exec(x.path);
        if (res != null && res.length > 0) obj.path = res[0];
      }
      return obj;
    });
  }
};
function onCopy(item: JsonProperty) {
  emit('copy', item);
};
</script>

<template>
  <draggable
      tag="ul"
      item-key="id"
      filter=".disabled-prop"
      :list="jsonModel"
      :class="[level === 0 ? 'v-json-formatter': '', type, name]"
      :group="{ name: group, pull: 'clone', put: false }"
      :sort="false"
      :clone="propClone">
      <template #item="{ element, index }">
          <li :class="{ 'disabled-prop': element.disabled }">
              <span>
                  <span class="pre-operator purple">{{ getPreOperator(element) }}</span>
                  <i class="fa-solid"
                    :class="element.isOpen ? 'fa-chevron-down' : 'fa-chevron-right'"
                    @click="element.isOpen = !element.isOpen"
                    v-if="element.children?.length > 0"/>
                  <code>
                      <span v-show="element.key?.length > 0" class="blue">{{ element.key }}: </span>
                      <span class="red" v-if="element.type === 'string'">"{{ element.value }}"</span>
                      <span class="green" v-else-if="getPreOperator(element) === '■'">{{ element.value }}</span>
                      <span class="brown" v-else-if="element.type === 'array' && element.children?.length === 0 && element.value?.length > 0">{{ element.value }}</span>
                      <i class="fa-regular fa-copy v-json-formatter-tooltip btn-space" @click="onCopy(element)" v-if="element.key !== '*'">
                        <span class="tooltip">Copy path</span>
                      </i>
                  </code>
              </span>
              <v-json-drag v-if="element.isOpen && element.children?.length > 0"
                  :name="`${name}-${index}`"
                  :type="element.type"
                  :group="group" 
                  :level="level + 1"
                  v-model="element.children"
                  @copy="onCopy"/>
          </li>
      </template>
  </draggable>
</template>