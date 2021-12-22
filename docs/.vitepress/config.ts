import MarkdownIt from 'markdown-it';
import { UserConfig } from 'vitepress';
import markdownItCheckbox from 'markdown-it-checkbox';
import markdownItDemo from './markdown/plugin/markdown-it-demo';
import path from 'path';
import fs from 'fs';
const INPUT_PATH = path.resolve(__dirname, '../../packages');

export const config: UserConfig = {
  // mpa: true,
  // base: '/docs',
  lang: 'zh-CN',
  title: 'Todo',
  description: 'todo',

  // https://vitepress.vuejs.org/guide/markdown.html#advanced-configuration
  markdown: {
    lineNumbers: true,
    // options for markdown-it-toc
    // toc: { includeLevel: [1, 2] },
    config: (md: MarkdownIt) => {
      // use more markdown-it plugins!
      md.use(markdownItCheckbox);
      md.use(markdownItDemo);
    },
  },

  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/intro', activeMatch: '^/guide/' },
      {
        text: '组件',
        link: '/',
        activeMatch: '^/$|^/components/',
      },
      // {
      //   text: '发布日志',
      //   // link: '/changelog',
      //   link: 'https://',
      // },
      // {
      //   text: 'Gitlab',
      //   link: 'https://',
      // },
    ],
    sidebar: {
      '/components/': getComponentsSidebar(),
      '/guide': getGuideSidebar(),
      '/': getComponentsSidebar(),
    },
  },
};

function getGuideSidebar() {
  return [
    {
      text: '介绍',
      children: [
        { text: '介绍', link: '/guide/intro' },
        // { text: '开始使用', link: '/guide/getting-started' },
        // { text: '配置', link: '/guide/configuration' },
        { text: '贡献/开发指南', link: '/guide/contribution' },
        // { text: 'Todos', link: '/guide/todos' },
      ],
    },
  ];
}

function getComponentsSidebar() {
  let components = [];
  fs.readdirSync(`${INPUT_PATH}`)
    .filter((name) => !name.includes('.'))
    .forEach((name) => {
      let mdFile = `readme.md`;
      if (!fs.existsSync(`${INPUT_PATH}/${name}/${mdFile}`)) {
        mdFile = fs.readdirSync(`${INPUT_PATH}/${name}`).find((file) => file.endsWith('.md'));
      }
      if (mdFile) {
        const text = name.replace(/[-_]([a-z])/g, (_, $1) => $1.toUpperCase());
        const link = `/components/${name}/${mdFile.replace(/\.md$/, '')}`;
        components.push({
          text: text.replace(/^[a-z]/, ($1) => $1.toUpperCase()),
          link,
        });
      }
    });
  // return components;
  return [
    {
      text: '组件',
      children: components,
    },
  ];
}
