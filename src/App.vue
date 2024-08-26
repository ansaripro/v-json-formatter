<script setup lang="ts">
import { ref } from 'vue';

const jsonString = ref('');
const model = ref([]);
jsonString.value = JSON.stringify(JSON.parse(`{
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
}`));

</script>

<template>
  <div style="padding: 10px;">
    <div style="padding:6px 10px;background-color:rgb(219, 219, 219);">
      Demo
    </div>
    <v-json-drag-n-drop 
      height="90vh"
      group="jFormatter"
      title="Demo"
      drag-panel-title="Drag"
      drop-panel-title="Drop"
      :json-string="jsonString"
      v-model="model" />
  </div>
</template>
