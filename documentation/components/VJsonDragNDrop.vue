<script setup lang="ts">
import { ref } from 'vue';

const jsonString = ref('');
const model = ref([]);
jsonString.value = `{
  "glossary": {
    "title": "example glossary",
    "GlossDiv": {
      "title": "S",
      "GlossArray": [
        {
          "title": "y",
          "example": [1,2,3]
        }
      ],
      "GlossList": {
        "GlossEntry": {
          "ID": "SGML",
          "SortAs": "SGML",
          "GlossTerm": "Standard Generalized Markup Language",
          "Acronym": "SGML",
          "Abbrev": "ISO 8879:1986",
          "GlossDef": {
            "para": "A meta-markup language, used to create markup languages such as DocBook.",
            "GlossSeeAlso": ["GML", "XML"]
          },
          "GlossSee": "markup"
        }
      }
    }
  }
}`;
</script>

<template>
  <v-json-drag-n-drop 
    height="90vh"
    group="jFormatter"
    expand-icon="fa-solid fa-chevron-down"
    collapsed-icon="fa-solid fa-chevron-right"
    copy-icon="fa-regular fa-copy"
    paste-icon="fa-solid fa-paste"
    add-icon="fa-solid fa-plus"
    edit-icon="fa-solid fa-pen-to-square"
    delete-icon="fa-regular fa-trash-can"
    save-icon="fa-regular fa-floppy-disk"
    cancel-icon="fa-regular fa-circle-xmark"
    validate-icon="fa-solid fa-spell-check"
    format-icon="fa-solid fa-code"
    import-icon="fa-regular fa-circle-down"
    title="Demo"
    drag-panel-title="Drag"
    drop-panel-title="Drop"
    :json-string="jsonString"
    v-model="model" />
</template>
