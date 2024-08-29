import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/v-json-formatter/',
  title: 'v-json-formatter',
  description: 'Documentation for v-json-formatter',
  themeConfig: {
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Components', link: '/componentdocs/vjsondragndrops' },
      { text: 'API', link: '/api/vdatatableplus' },
      { text: 'GitHub', link: 'https://github.com/ansaripro/v-json-formatter' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Getting Started', link: '/getting-started/' },
        ],
      },
      {
        text: 'Components',
        items: [
          { text: 'VJsonDragNDrop', link: '/componentdocs/vjsondragndrops' },
          { text: 'VJsonDrag', link: '/componentdocs/vjsondrag' },
          { text: 'VJsonDrop', link: '/componentdocs/vjsondrop' },
          { text: 'VJsonEditor', link: '/componentdocs/vjsoneditor' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'VJsonDragNDrop', link: '/api/vjsondragndrops' },
          { text: 'VJsonDrag', link: '/api/vjsondrag' },
          { text: 'VJsonDrop', link: '/api/vjsondrop' },
          { text: 'VJsonEditor', link: '/api/vjsoneditor' },
        ],
      },
    ],
  },
  theme: {
    extend: '@vitepress/theme',
  },
  head: [
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css'
      }
    ]
  ]
});