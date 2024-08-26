<script setup lang="ts">
import { computed } from 'vue'
import type { JsonDropProps, JsonProperty, EditJProperty, JEvent, JParentType } from '../types/index'
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
function rootAddProp(type: JParentType) {
  jsonNodeId.value += 1;
  const o: JsonProperty = {
    id: jsonNodeId.value,
    key: '',
    path: '',
    value: type === 'object' ? {} : [],
    type: type,
    isCustom: false,
    isOpen: true,
    disabled: true,
    children: [],
  };
  localAddProp(o);
  jsonModel.value = [o];
};
function localCanAddProp(element: JsonProperty) {
  return element.path?.length === 0 && (element.type === 'object' || 
    (element.type === 'array' && !(element.children?.length === 0 && element.value?.length > 0))
  );
};
function localAddProp(element: JsonProperty) {
  if (element.type === 'array' || element.type === 'object') {
    jsonNodeId.value += 1;
    element.children?.splice(0, 0, {
      id: jsonNodeId.value,
      key: element.type === 'object' ? `Property ${jsonNodeId.value}` : '',
      path: '',
      value: '',
      type: element.type === 'object' ? 'string' : 'object',
      parentType: element.type,
      isCustom: true,
      disabled: false,
      isOpen: true,
      children: [],
    });
  }
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
  item.parentType = props.copyItem.parentType;
  item.children = [];
  item.isCustom = false;
  jEvt.messageType = 'success';
  jEvt.message = 'Pasted succesffully!';
  emit('event', jEvt);
};
</script>

<template>
  <div style="display: flex; flex-direction: row;" v-if="level === 0 && jsonModel?.length === 0">
    <button type="button" @click="rootAddProp('object')">Create Object</button>
    <button type="button" @click="rootAddProp('array')">Create Array</button>
  </div>
  <draggable
      tag="ul"
      item-key="id"
      :list="jsonModel"
      :class="[level === 0 ? 'v-json-formatter': '', type, name]"
      :group="{ name: group }">
      <template #item="{ element, index }">
          <li v-if="isOpen">
              <span>
                  <span class="pre-operator purple">{{ getPreOperator(element) }}</span>
                  <i class="fa-solid"
                    :class="element.isOpen ? 'fa-chevron-down' : 'fa-chevron-right'"
                    @click="element.isOpen = !element.isOpen"
                    v-if="element.children?.length > 0 && (element.type === 'object' || element.type === 'array')"/>
                  <code>
                      <span v-show="element.key?.length > 0" class="blue">{{ element.key }}: </span>
                      <span class="darkgold" v-if="element.path?.length > 0">
                          {{ element.path }}
                      </span>
                      <span class="red" v-else-if="element.type === 'string'">"{{ element.value }}"</span>
                      <span class="green" v-else-if="getPreOperator(element) === '■'">{{ element.value }}</span>
                      <span class="brown" v-else-if="element.type === 'array' && element.children?.length === 0 && element.value?.length > 0">{{ element.value }}</span>
                      <i class="fa-solid fa-plus v-json-formatter-tooltip btn-space" @click="localAddProp(element)" v-if="localCanAddProp(element)">
                        <span class="tooltip">Add</span>
                      </i>
                      <i class="fa-solid fa-pen-to-square v-json-formatter-tooltip btn-space" @click="localEditProp(element, index)" v-if="level !== 0 && !(element.type === 'object' && element.parentType === 'array')">
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
              <v-json-drop v-if="!(element.type === 'array' && element.children?.length === 0 && element.value?.length > 0)"
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