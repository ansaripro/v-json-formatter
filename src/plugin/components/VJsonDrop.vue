<script setup lang="ts">
import { computed } from 'vue'
import type { JsonDropProps, JsonProperty, EditJProperty, JEvent } from '../types/index'
import Draggable from 'vuedraggable';

const props = withDefaults(defineProps<JsonDropProps>(), { 
    // internal props
    level: 0,
    name: 'jdrag',
    type: '',
    isOpen: true,
    globalId: 0,
});

const emit = defineEmits([
  'update:modelValue',
  'update:globalId',
  'editProperty',
  'event',
]);

const jsonModel = computed<JsonProperty[]>({
  get() {
    return props.modelValue || [];
  },
  set(value) {
    emit('update:modelValue', value);
  }
});

const jsonNodeId = computed<number>({
  get() {
    return props.globalId || 0;
  },
  set(value) {
    emit('update:globalId', value);
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
function rootAddProp() {
  const arr = jsonModel.value;
  jsonNodeId.value += 1;
  const obj: JsonProperty = {
      id: jsonNodeId.value,
      key: `Property ${jsonNodeId.value}`,
      path: '',
      value: '',
      type: 'string',
      isCustom: true,
      isOpen: true,
      disabled: false,
      children: [],
  };
  arr.splice(0, 0, obj);
  jsonModel.value = arr;
};
function localCanAddProp(element: JsonProperty) {
  return element.path?.length === 0 && (element.type === 'object' || element.typeNature === 'object');
};
function localAddProp(element: JsonProperty) {
  jsonNodeId.value += 1;
  let obj: JsonProperty;
  if (element.type !== 'array') {
    obj = {
      id: jsonNodeId.value,
      key: `Property ${jsonNodeId.value}`,
      path: '',
      value: '',
      type: 'string',
      isCustom: true,
      disabled: false,
      isOpen: true,
      children: [],
    };
  } else {
    obj = {
      id: jsonNodeId.value,
      key: '',
      path: '',
      value: '',
      type: 'object',
      typeNature: 'object',
      isCustom: true,
      disabled: false,
      isOpen: true,
      children: [],
    };
  }
  element.children.splice(0, 0, obj);
};
function localEditProp(element: JsonProperty, index: number) {
  editProp({
      element: element,
      index: index,
      level: props.level,
  });
};
function editProp(obj: EditJProperty) { 
  emit('editProperty', obj);
};
function localDeleteProp(index: number) {
  const arr = jsonModel.value;
  arr.splice(index, 1);
  jsonModel.value = arr;
};
function onPastePath(item: JsonProperty) {
  const jEvt: JEvent = {
    name: 'Paste'
  };
  if (!props.copyItem) {
    jEvt.messageType = 'warning';
    jEvt.message = 'Please copy an item!';
    emit('event', jEvt);
    return;
  }
  if (item.type === 'array' && props.copyItem.type !== 'array') {
    jEvt.messageType = 'warning';
    jEvt.message = 'Copied property is not an array!';
    emit('event', jEvt);
  }
  item.id = props.copyItem.id;
  item.path = props.copyItem.path;
  item.value = props.copyItem.value;
  item.type = props.copyItem.type;
  item.typeNature = props.copyItem.typeNature;
  item.children = [];
  item.isCustom = false;
  jEvt.messageType = 'success';
  jEvt.message = 'Pasted succesffully!';
  emit('event', jEvt);
};
</script>

<template>
  <i class="fa-solid fa-plus" style="margin-left: -7px;" @click="rootAddProp" v-if="level === 0"/>
  <draggable
      tag="ul"
      item-key="id"
      :list="jsonModel"
      :class="[level === 0 ? 'v-json-formatter': '', type, name]"
      :group="{ name: group }">
      <template #item="{ element, index }">
          <li v-if="isOpen">
              <span>
                  <span class="pre-operator" :class="getPreOperator(element) === '■'? 'cyan' : 'blue'">{{ getPreOperator(element) }}</span>
                  <i class="fa-solid"
                    :class="element.isOpen ? 'fa-chevron-down' : 'fa-chevron-right'"
                    @click="element.isOpen = !element.isOpen"
                    v-if="element.children?.length > 0 && (element.type === 'object' || element.typeNature === 'object')"/>
                  <code>
                      <span v-show="element.key?.length > 0" class="red">{{ element.key }}: </span>
                      <span class="purple" v-if="element.path?.length > 0">
                          {{ element.path }}
                      </span>
                      <span class="indigo" v-else-if="element.type === 'string'">"{{ element.value }}"</span>
                      <span class="light-green" v-else-if="getPreOperator(element) === '■'">{{ element.value }}</span>
                      <span class="brown" v-else-if="element.typeNature === 'value'">{{ element.value }}</span>
                      <i class="fa-solid fa-plus v-json-formatter-tooltip btn-space" @click="localAddProp(element)" v-if="localCanAddProp(element)">
                        <span class="tooltip">Add</span>
                      </i>
                      <i class="fa-solid fa-pen-to-square v-json-formatter-tooltip btn-space" @click="localEditProp(element, index)" v-if="!(element.type === 'object' && element.typeNature === 'object')">
                        <span class="tooltip">Edit</span>
                      </i>
                      <i class="fa-solid fa-paste v-json-formatter-tooltip btn-space" @click="onPastePath(element)" v-if="element.isCustom && element.children?.length === 0">
                        <span class="tooltip">Paste path</span>
                      </i>
                      <i class="fa-regular fa-trash-can v-json-formatter-tooltip btn-space" @click="localDeleteProp(index)">
                        <span class="tooltip">Delete</span>
                      </i>
                  </code>
              </span>
              <v-json-drop v-if="!(element.isArray && element.typeNature === 'value')"
                  :name="`${name}-${index}`"
                  :type="element.type"
                  :group="element.path?.length === 0 ? group : element.key"
                  :level="level + 1"
                  :is-open="element.isOpen"
                  :copy-item="props.copyItem"
                  v-model="element.children"
                  v-model:global-id="jsonNodeId"
                  @edit-property="editProp"
                  @event="emit('event', $event)"/>
          </li>
      </template>
  </draggable>
</template>