import DefaultTheme from 'vitepress/theme';
import VJsonFormatterPlugin from 'v-json-formatter';
import 'v-json-formatter/dist/style.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(VJsonFormatterPlugin);
  }
};