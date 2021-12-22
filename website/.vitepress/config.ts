import MarkdownIt from 'markdown-it';
import { UserConfig } from 'vitepress';
import markdownItCheckbox from 'markdown-it-checkbox';
import markdownItDemo from './markdown/plugin/markdown-it-demo';

export const config: UserConfig = {
  base: process.env.NODE_ENV === 'production' ? '/copy-async/' : '/',
  lang: 'zh-CN',
  title: process.env.npm_package_name,
  description: process.env.npm_package_description,

  // https://vitepress.vuejs.org/guide/markdown.html#advanced-configuration
  markdown: {
    lineNumbers: true,
    config: (md: MarkdownIt) => {
      md.use(markdownItCheckbox);
      md.use(markdownItDemo);
    },
  },

  themeConfig: {
    sidebar: false,
    nav: [
      { text: '指南', link: '/', exact: true },
      {
        text: '发布日志',
        link: '/changelog',
      },
      {
        text: 'Github',
        link: 'https://github.com/bowencool/copy-async',
      },
    ],
  },
};
