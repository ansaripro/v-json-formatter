<script setup>
  import VJsonEditor from '../components/VJsonEditor.vue';
</script>

# VJsonEditor

## API
[VJsonEditor](/api/vjsoneditor)

## Usage
::: code-group
```vue
<template>
	<v-json-editor v-model="model">
		<template #top="props">
			<div>
				<h1>JSON Editor</h1>
				<div>
					<button type="button" class="btn" @click="props.copy">
						<i class="fa-regular fa-copy"></i>
						Copy
					</button>
					<button type="button" class="btn" @click="props.validate">
						<i class="fa-solid fa-spell-check"></i>
						Validate
					</button>
					<button type="button" class="btn" @click="props.format">
						<i class="fa-solid fa-code"></i>
						Format
					</button>
				</div>
			</div>
		</template>
	</v-json-editor>
	<h1>Result:</h1>
	<code>
		{{ model }}
	</code>
</template>
```
```JS
<script setup lang="ts">
import { ref } from 'vue';

const model = ref('');
</script>
```
```CSS
<style>
h1 {
	font-weight: bold;
	padding: 0 8px 8px 0;
}
.btn {
	border: 1px solid rgb(0, 0, 0, 0.2);
	border-radius: 2px;
	padding: 0 8px;
	margin: 0 5px 5px 0;
}
</style>
```
:::

## Preview
Note: Due to Vitepress style, component style can be overlap and preview can be different than actual.

::: raw
<client-only>
  <v-json-editor/>
</client-only>
:::