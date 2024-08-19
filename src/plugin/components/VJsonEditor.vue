<script setup lang="ts">
import { computed, ref, watch, onMounted  } from 'vue';
import type { JsonEditorProps } from '../types/index';

const props = withDefaults(defineProps<JsonEditorProps>(), { 
    modelValue: '',
    readOnly: false,
    width: '100%',
    height: '90vh',
});

const emit = defineEmits([
  'update:modelValue',
]);
watch(() => props.modelValue, onUpdateModelValue);
onMounted(onUpdateModelValue);

const preContainer = ref<HTMLPreElement| null>(null);
const lineNumbers = ref<HTMLDivElement | null>(null);
const isJsonValid = ref(true);
const jsonError = ref('');
const jsonText = ref('');
const isEditable = computed<any>(() => (props.readOnly ? false : true));
const codeContainerStyle = computed(() => {
    const style = {
        height: '90vh',
        width: '100%',
    };
    if (typeof props.height === 'string') {
        style.height = `calc(${props.height} - 60px)`;
    } else {
        style.height = `calc(${props.height}vh - 60px)`;
    }
    if (typeof props.width === 'string') {
        style.width = props.width;
    } else {
        style.width = `${props.width}`;
    }
    return style;
});

function validate() {
    isJsonValid.value = false;
    if (jsonText.value?.length === 0) {
        jsonError.value = 'Please enter message first!';
        return false;
    }
    let obj = null;
    try {
        obj = JSON.parse(jsonText.value);
    } catch (err: any) {
        highlightError(err);
        jsonError.value = err.message;
        return false;
    }
    if (obj) {
        isJsonValid.value = true;
        jsonError.value = '';
        return true;
    }
    else {
        jsonError.value = 'Invalid JSON!';
        return false;
    }
};
function format() {
    if (!validate()) return;

    const obj = JSON.parse(jsonText.value);
    const json = JSON.stringify(obj, null, 2);
    jsonText.value = json;
    updateModelValue();
    jsonFormatInHtml();
};
function copy() {
    return preContainer.value?.textContent ?? '';
};
function updateModelValue() {
    if (jsonText.value !== props.modelValue) {
        emit('update:modelValue', jsonText.value);
    }
};
function onUpdateModelValue() {
    if (jsonText.value === props.modelValue) return;

    jsonText.value = props.modelValue;
    jsonFormatInHtml();
};
function jsonFormatInHtml() {
    if (jsonText.value.includes('\n')) {
        let html = '';
        jsonText.value.split('\n').forEach(x => {
            html += `<div>${escapeHtml(x)}</div>`;
        });
        if (preContainer.value !== null) preContainer.value.innerHTML = html;
    } else if (preContainer.value !== null) preContainer.value.textContent = jsonText.value;
    generateLines();
};
function onInput(event: Event) {
    if (event === null) return;

    var elems = document.querySelectorAll(".v-json-editor-error-line");
    if (elems?.length > 0) {
        elems.forEach(x => {
            x.classList.remove('v-json-editor-error-line');
        });
    }
    const divElement = event.target as HTMLDivElement;
    if (divElement.childNodes.length > 0) {
        for (let br of divElement.querySelectorAll('br')) {
            br.remove();
        }
    }

    // If DIV is ever made empty after removal of BRs
    if (divElement.innerHTML.trim().length === 0) {
        // Re-populate the initial DIV
        divElement.innerHTML = '';
        divElement.appendChild(document.createElement('div'));
    }
    generateLines();

    jsonText.value = preContainer.value?.textContent ?? '';
    updateModelValue();
};
function onPaste(event: ClipboardEvent) {
    event.preventDefault();
    let text = event.clipboardData?.getData('text/plain');
    insertTextAtCursor(text);
    jsonText.value = preContainer.value?.textContent ?? '';
    format();
};
function insertTextAtCursor(text?: string) {
    if (text === null) return;

    let selection = window.getSelection();
    if (!selection?.rangeCount) return;

    let range = selection.getRangeAt(0);
    range.deleteContents();
    
    let textNode = document.createTextNode(text ?? '');
    range.insertNode(textNode);

    // Move the cursor after the inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
};
function generateLines() {
    if (lineNumbers.value == null) return;

    const divElements = preContainer.value?.querySelectorAll('div');
    lineNumbers.value.innerHTML = '';
    if (divElements !== undefined && divElements.length > 0) {
        for (let i = 1; i < divElements.length + 1; i += 1) {
            lineNumbers.value.innerHTML += `<span id="linenumber-${i}">${i}</span>`;
        }
    }
};
function highlightError(error: any) {
    // Find error position and highlight it
    const errorPosition = error.message.match(/at position (\d+)/);
    if (errorPosition) {
        const pos = parseInt(errorPosition[1], 10);
        let jsonString = '';
        const divElements = preContainer.value?.querySelectorAll('div');
        if (divElements !== undefined && divElements.length > 0) {
            for (let index = 0; index < divElements.length; index+=1) {
                const divContent = divElements[index].textContent;
                if (jsonString.length + (divContent?.length ?? 0) >= pos) {
                    const spanLN = document.getElementById(`linenumber-${index + 1}`);
                    if (spanLN) {
                        spanLN.classList.add('v-json-editor-error-line');
                    }
                    let beforeError = jsonText.value.substring(0, pos);
                    beforeError = beforeError.replace(jsonString, '');
                    const errCont = divContent?.replace(beforeError, '') ?? '';
                    const errorChar = errCont.substring(0, 1);
                    const afterError = errCont.substring(1);
                    divElements[index].innerHTML = (`${escapeHtml(beforeError)}<span class="v-json-editor-error-line">${escapeHtml(errorChar)}</span>${escapeHtml(afterError)}`);
                    return;
                } else jsonString += divElements[index].textContent;
            }
        }
    }
};
function escapeHtml(unsafe: any) {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};
</script>
<template>
    <slot name="top" :validate="validate" :format="format" :copy="copy"/>
    <div class="v-json-editor" :style="[codeContainerStyle]">
        <div class="v-json-editor-line-border"></div>
        <div ref="lineNumbers" class="v-json-editor-line-numbers">
            <span id="linenumber-1">1</span>
        </div>
        <pre ref="preContainer"
            :contenteditable="isEditable"
            class="v-json-editor-container"
            @input="onInput"
            @paste="onPaste">
            <div></div>
        </pre>
    </div>
    <p v-if="!isJsonValid" class="v-json-editor-error">{{ jsonError }}</p>
</template>