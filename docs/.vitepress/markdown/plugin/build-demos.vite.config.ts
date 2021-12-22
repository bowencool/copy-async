import vue from '@vitejs/plugin-vue';
import { mergeConfig, UserConfig } from 'vite';
import config from '../../../vite.config';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';
import { genHtml } from './genIframe';

// config.plugins = config.plugins?.filter((p) => {
//   if (!p) return false;
//   if (Array.isArray(p)) return true;
//   return p.name !== 'demo-iframe';
// });

const demos: Record<string, { entry: string; title?: string }> = JSON.parse(
  readFileSync(__dirname + '/demos.json', 'utf-8'),
);

const dir = resolve(process.cwd(), '~demos');

existsSync(dir) || execSync('mkdir -p ' + dir);
// execSync(`rm ${dir}/*.html`);

const iframeConfig: UserConfig = {
  plugins: [
    vue(),
    // todo 合并
    {
      name: 'demo-iframe-build',
      resolveId(id) {
        if (id.match(/\/~demos\/(\w+)\.html/)) {
          // console.log('resolveId', id);
          return id;
        }
        return undefined;
      },
      /** for build */
      load(id) {
        if (id.match(/\/~demos\/(\w+)\.html/)) {
          const demoName = RegExp.$1;
          // console.log('load', id);
          const demos = JSON.parse(readFileSync(__dirname + '/demos.json', 'utf-8'));
          const meta = demos[demoName];
          if (meta) {
            meta.title = meta.title || demoName;
            return genHtml(meta);
          }
        }
        return undefined;
      },
    },
  ],
  // base: '/~demos/',
  build: {
    emptyOutDir: false,
    outDir: 'docs/.vitepress/dist',
    // outDir: resolve(process.cwd(), 'docs/.vitepress/dist/~demos'),
    rollupOptions: {
      input: {},
    },
  },
};

const input = iframeConfig.build.rollupOptions.input;

Object.entries(demos).forEach(([demoName, meta]) => {
  // console.log(demoName, meta);
  const htmlEntry = `${dir}/${demoName}.html`;
  if (Array.isArray(input)) {
    input.push(htmlEntry);
  } else {
    input[demoName] = htmlEntry;
  }
});

export default mergeConfig(config, iframeConfig);
