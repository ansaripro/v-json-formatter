<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { JsonDragNDropProps, JsonProperty, JTypes, PropertyTypeItem, EditDialog, EditJProperty, ViewDialog, JEvent } from '../types/index';
import VJsonEditor from './VJsonEditor.vue';
import VJsonDrag from './VJsonDrag.vue';
import VJsonDrop from './VJsonDrop.vue';

const props = withDefaults(defineProps<JsonDragNDropProps>(), {
});

const emit = defineEmits([
    'jeditor:copy',
    'update:modelValue',
    'event',
]);

const globalId = ref(0);
const copyContainer = ref<JsonProperty>();
const items = ref<JsonProperty[]>([]);
const editObj = reactive<EditDialog>({
    isCustom: false,
    key: '',
    value: '',
});
const viewObj = ref<ViewDialog>({
    isEdit: false,
    modelValue: '',
});
const dialogObj = reactive({
    type: 'editProp',
    viewObj: {
        text: null,
        isEdit: false,
    },
    show: false,
    result: undefined,
});
const dialogTypes = reactive<PropertyTypeItem[]>([
    {
        key: 'string',
        type: 'string',
        title: 'String',
        canEdit: true,
        hide: false,
    },
    {
        key: 'number',
        type: 'number',
        title: 'Number',
        canEdit: true,
        hide: false,
    },
    {
        key: 'boolean',
        type: 'boolean',
        title: 'Boolean',
        canEdit: true,
        hide: false,
    },
    {
        key: 'object',
        type: 'object',
        title: 'Object',
        canEdit: false,
        hide: false,
    },
    {
        key: 'childObject',
        type: 'object',
        title: 'Object',
        typeNature: 'object',
        canEdit: false,
        hide: true,
    },
    {
        key: 'arrayOfValues',
        type: 'array',
        title: 'Array of values',
        canEdit: true,
        typeNature: 'value',
        hide: false,
    },
    {
        key: 'arrayOfObjects',
        type: 'array',
        title: 'Array of Objects',
        typeNature: 'object',
        canEdit: false,
        hide: false,
    },
]);

const jsonModel = computed<JsonProperty[]>({
    get() {
        return props.modelValue || [];
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

items.value = props.jsonString ? convert('dragItems', convertJSON(props.jsonString), '$') : [];
if (props.placeholderItems && props.placeholderItems.length > 0) {
    props.placeholderItems.forEach((x) => {
        if (x.title?.length > 0 && x.token.length > 0) {
            const obj: PropertyTypeItem = {
                key: `placeholder-${dialogTypes.length + 1}`,
                type: x.type,
                title: x.title,
                placeholderToken: x.token,
                canEdit: false,
                hide: false,
            };
            dialogTypes.push(obj);
        }
    });
}

watch(() => props.jsonString, (value) => {
    items.value = value ? convert('dragItems', convertJSON(value), '$') : [];
},
    { deep: true });

function getContainerStyle() {
    let h = '300px';
    if (props.height) {
        if (typeof props.height === 'string') {
            h = props.height;
        } else {
            h = `${props.height}px`;
        }
    }
    return `width:100%;height:${h};`;
};
function getPanelStyle() {
    let h = '300px';
    if (props.height) {
        if (typeof props.height === 'string') {
            h = props.height;
        } else {
            h = `${props.height}px`;
        }
    }
    return `height:calc(${h} - 55px);overflow:auto`;
};
function convertJSON(json: string, skipResetId: boolean = false) {
    if (!skipResetId) globalId.value = 0;

    let obj = {};
    try {
        obj = JSON.parse(json);
    } catch { /* empty */ }
    return obj;
};
function getJType(obj: any): JTypes {
    const t = typeof obj;
    let jType: JTypes;
    switch (t) {
        case 'boolean':
        case 'number':
            jType = t;
            break;
        case 'object':
            jType = Array.isArray(obj) ? 'array' : t;
            break;
        case 'bigint':
            jType = 'number';
            break;
        default:
            jType = 'string';
            break;
    }
    return jType;
};
function convert(convertType: string, pJson: any, rootPath: string): JsonProperty[] {
    let jObj;
    if (Array.isArray(pJson)) {
        globalId.value += 1;
        return [{
            id: globalId.value,
            key: '*',
            disabled: true,
            path: convertType === 'dragItems' ? '[*]' : '',
            value: pJson[0],
            type: 'array',
            typeNature: 'object',
            isCustom: convertType !== 'dragItems',
            isOpen: true,
            children: convert(convertType, pJson[0], `${rootPath}[*]`),
        }];
    } else jObj = pJson;

    const result: JsonProperty[] = [];
    const props = Object.getOwnPropertyNames(jObj);
    props.forEach(p => {
        const t = getJType(pJson[p]);
        if (t !== 'object' && t !== 'array') {
            globalId.value += 1;
            result.push({
                id: globalId.value,
                key: p,
                path: convertType === 'dragItems' ? `${rootPath}.${p}` : '',
                value: jObj[p],
                type: t,
                disabled: false,
                isCustom: convertType !== 'dragItems',
                isOpen: false,
                children: [],
            });
        }
    });
    if (result.length !== props.length) {
        props.forEach(p => {
            const t = getJType(pJson[p]);
            if ((t === 'object' || t === 'array') && (convertType !== 'dragItems' || rootPath !== '$' || isChildVisible(p))) {
                globalId.value += 1;
                const o: JsonProperty = {
                    id: globalId.value,
                    key: p,
                    type: t,
                    path: convertType === 'dragItems' ? `${rootPath}.${p}` : '',
                    value: jObj[p],
                    isCustom: convertType !== 'dragItems',
                    disabled: false,
                    isOpen: jObj[p] ? true : false,
                    children: [],
                };
                if (t === 'array') {
                    o.isOpen = jObj[p].length > 0;
                    if (jObj[p].length > 0) {
                        if (typeof jObj[p][0] === 'object') {
                            o.typeNature = 'object';
                            o.children = convert(convertType, jObj[p], `${rootPath}.${p}`);
                        } else o.typeNature = 'value';
                    }
                } else o.children = convert(convertType, jObj[p], `${rootPath}.${p}`);
                result.push(o);
            }
        });
    }
    return result;
};
function isChildVisible(_: string) {
    return true;
    // if (!props.defaultHideChildProperties) return true;

    // let flag = false;
    // if (props.visibleChildProperties.length > 0) {
    //     props.visibleChildProperties.forEach(p => {
    //         if (p === pName || `${p}s` === pName) {
    //             flag = true;
    //             return;
    //         }
    //     });
    // }
    // return flag;
};
function onCopy(item: JsonProperty) {
    copyContainer.value = item;
}
function editProp(obj: EditJProperty) {
    editObj.refObj = undefined;
    editObj.refObj = obj.element;
    editObj.key = obj.element.key;
    editObj.isCustom = obj.element.isCustom;
    if (obj.element.type === 'array') {
        editObj.selectedType = dialogTypes.find(x => x.key === obj.element.typeNature);
        editObj.value = obj.element.typeNature === 'value' ? JSON.stringify(obj.element.value) : '';
    } else if ((obj.element.path?.length ?? 0) > 0) {
        editObj.selectedType = dialogTypes.find(x => x.placeholderToken === obj.element.path);
        if (!editObj.selectedType) editObj.selectedType = dialogTypes.find(x => x.type === obj.element.type);
        editObj.value = obj.element.value;
    } else {
        editObj.selectedType = dialogTypes.find(x => x.key === obj.element.typeNature);
        if (!editObj.selectedType) editObj.selectedType = dialogTypes.find(x => x.type === obj.element.type);
        editObj.value = obj.element.value;
    }
    dialogObj.type = 'editProp';
    dialogObj.show = true;
};
function onEditPropSave() {
    if (!editObj.refObj || !editObj.selectedType) return;
    editObj.refObj.key = editObj.key;
    if (editObj.isCustom) {
        editObj.refObj.path = '';
        editObj.refObj.type = editObj.selectedType.type;
        editObj.refObj.typeNature = editObj.selectedType.typeNature;
        editObj.refObj.children = [];

        switch (editObj.selectedType.key) {
            case 'number':
                editObj.refObj.value = Number(editObj.value);
                break;
            case 'arrayOfObjects':
                globalId.value += 1;
                editObj.refObj.children = [
                    {
                        id: globalId.value,
                        key: '',
                        disabled: true,
                        path: '',
                        value: {},
                        type: 'object',
                        typeNature: 'object',
                        isCustom: true,
                        isOpen: true,
                        children: [],
                    }
                ];
                editObj.refObj.value = [{}];
                break;
            case 'arrayOfValues':
                try {
                    editObj.refObj.value = JSON.parse(editObj.value);
                } catch {
                    editObj.refObj.value = null;
                }
                break;
            default:
                if (editObj.selectedType.placeholderToken) {
                    editObj.refObj.path = editObj.selectedType.placeholderToken;
                    editObj.refObj.value = null;
                } else {
                    editObj.refObj.value = editObj.value;
                }
                break;
        }
    }
    dialogObj.show = false;
};
function onImport(func: Function) {
    if (!func()) return;

    const obj = convertJSON(viewObj.value.modelValue, true);
    if (obj) jsonModel.value = convert('importJSON', obj, '');
    else {
        const jEvt: JEvent = {
            name: 'JEditor:Import',
            messageType: 'error',
            message: 'Invalid JSON!'
        };
        emit('event', jEvt);
        return;
    }
    dialogObj.show = false;
};
function importJson() {
    viewObj.value.isEdit = true;
    viewObj.value.modelValue = JSON.stringify({ sample: 'sample' }, null, 2);
    dialogObj.type = 'viewJson';
    dialogObj.show = true;
};
function viewJson(panel: string) {
    const jEvt: JEvent = { name: `${panel}:ViewJSON` };
    if (panel === 'JDrag') {
        if (items.value.length === 0) {
            jEvt.messageType = 'warning';
            jEvt.message = 'JSON not found!';
            emit('event', jEvt);
            return;
        }
        const jObj: any = {};
        items.value.forEach(x => {
            jObj[x.key] = x.value;
        });
        viewObj.value.modelValue = JSON.stringify(jObj, null, 2);
        viewObj.value.isEdit = false;
        dialogObj.type = 'viewJson';
        dialogObj.show = true;
    } else if (panel === 'JDrop') {
        if (jsonModel.value.length === 0) {
            jEvt.messageType = 'warning';
            jEvt.message = 'JSON not found!';
            emit('event', jEvt);
            return;
        }
        const jObj: any = {};
        jsonModel.value.forEach(x => {
            if ((x.path?.length ?? 0) > 0) jObj[x.key] = viewJsonChilds(x, x.children) ?? x.path;
            else jObj[x.key] = viewJsonChilds(x, x.children) ?? x.value;
        });
        viewObj.value.modelValue = JSON.stringify(jObj, null, 2);
        viewObj.value.isEdit = false;
        dialogObj.type = 'viewJson';
        dialogObj.show = true;
    }
};
function viewJsonChilds(prop: JsonProperty, children: JsonProperty[]): any {
    if (prop.type === 'array' && children?.length > 0) {
        const arr: any[] = [];
        children.forEach(x => {
            const o = viewJsonChilds(x, x.children);
            if (o !== null) arr.push(o);
        });
        return arr;
    } else if (children?.length > 0) {
        const obj: any = {};
        children.forEach(x => {
            if ((x.path?.length ?? 0) > 0) obj[x.key] = viewJsonChilds(x, x.children) ?? x.path;
            else obj[x.key] = viewJsonChilds(x, x.children) ?? x.value;
        });
        return obj;
    }
    return null;
}

</script>
<template>
    <div class="v-json-formmatter">
        <div class="container" :style="getContainerStyle()">
            <div class="left-panel border">
                <div class="title-bar">
                    <div>
                        <slot name="dragPanelTitle">
                            <h6>{{ dragPanelTitle }}</h6>
                        </slot>
                    </div>
                    <div>
                        <slot name="dragPanelCommands" />
                        <button type="button" @click="viewJson('JDrag')">Json</button>
                    </div>
                </div>
                <div class="divider" />
                <div class="panel" :style="getPanelStyle()">
                    <v-json-drag ref="jdrag" :group="group" v-model="items"
                        @copy="onCopy" />
                </div>
            </div>
            <div class="right-panel border">
                <div class="title-bar">
                    <div>
                        <slot name="dropPanelTitle">
                            <h6>{{ dropPanelTitle }}</h6>
                        </slot>
                    </div>
                    <div>
                        <slot name="dropPanelCommands" />
                        <button type="button" @click="jsonModel = []">Clear</button>
                        <button type="button" @click="importJson">Import</button>
                        <button type="button" @click="viewJson('JDrop')">Json</button>
                    </div>
                </div>
                <div class="divider" />
                <div class="panel" :style="getPanelStyle()">
                    <v-json-drop ref="jdrop" :group="group" :copy-item="copyContainer" v-model:global-id="globalId" v-model="jsonModel"
                        @edit-property="editProp" @event="emit('event', $event)" />
                </div>
            </div>
        </div>
    </div>
    
    <Transition name="modal">
        <div v-if="dialogObj.show" class="v-json-modal-mask">
            <div class="modal-container" :style="dialogObj.type === 'editProp' ? 'width:50vw;' : ''">
                <div v-if="dialogObj.type === 'editProp'" title="JSON PROPERTY">
                    <div class="modal-row row-space">
                        <span>EDIT PROPERTY</span>
                    </div>
                    <div class="divider" />
                    <div class="modal-row row-space justify-space-between">
                        <div>
                            <label for="vJsonPropertyName">Name</label>
                            <input id="vJsonPropertyName" type="text" v-model="editObj.key" :disabled="editObj.key === '*'" />
                        </div>
                        <div>
                            <label for="vJsonSelectType">Type</label>
                            <select id="vJsonSelectType" v-model="editObj.selectedType"
                                :disabled="!editObj.isCustom"
                                :items="dialogTypes">
                                <template v-for="dt in dialogTypes">
                                    <option v-if="!dt.hide" :value="dt">{{ dt.title }}</option>
                                </template>
                            </select>
                        </div>
                    </div>
                    <div class="modal-row row-space" v-if="editObj.isCustom && editObj.selectedType?.canEdit === true">
                        <label for="VJsonValue">Value</label>
                        <select id="VJsonValue" v-model="editObj.value" v-if="editObj.selectedType.type === 'boolean'">
                            <option :value="true">True</option>
                            <option :value="false">False</option>
                        </select>
                        <input id="VJsonValue" v-else v-model="editObj.value" :type="editObj.selectedType.type === 'number' ? 'number' : 'text'" />
                    </div>
                    <div class="modal-row action-row">
                        <button type="button" @click="onEditPropSave">
                            <i class="fa-regular fa-floppy-disk"></i>
                            Update
                        </button>
                        <button type="button" @click="dialogObj.show = false">
                            <i class="fa-regular fa-circle-xmark"></i>
                            Close
                        </button>
                    </div>
                </div>
                <div v-else-if="dialogObj.type === 'viewJson'">
                    <v-json-editor :read-only="!viewObj.isEdit" v-model="viewObj.modelValue">
                        <template #top="props">
                            <slot name="editor-top" :validate="props.validate" :format="props.format" :copy="props.copy" :import="onImport">
                                <div class="modal-row justify-space-between">
                                    <span>{{ viewObj.isEdit ? 'IMPORT' : 'VIEW' }} JSON</span>
                                    <div class="button-group">
                                        <button type="button" @click="emit('jeditor:copy', props.copy)">
                                            <i class="fa-regular fa-copy"></i>
                                            Copy
                                        </button>
                                        <button type="button" @click="props.validate()">
                                            <i class="fa-solid fa-spell-check"></i>
                                            Validate
                                        </button>
                                        <button type="button" @click="props.format()">
                                            <i class="fa-solid fa-code"></i>
                                            Format
                                        </button>
                                        <button type="button" v-if="viewObj.isEdit" @click.stop="onImport(props.validate)">
                                            <i class="fa-regular fa-circle-down"></i>
                                            Import
                                        </button>
                                        <button type="button" @click="dialogObj.show = false">
                                            <i class="fa-regular fa-circle-xmark"></i>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </slot>
                        </template>
                    </v-json-editor>
                </div>
            </div>
        </div>
    </Transition>
</template>