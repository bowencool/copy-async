import type { Plugin, ViteDevServer } from 'vite';
import { readFileSync } from 'fs';
import { genHtml } from './genIframe';

export default function demoIframe(): Plugin {
  return {
    name: 'demo-iframe-dev',
    configureServer(server: ViteDevServer) {
      return () => {
        server.middlewares.use(async (req, res, next) => {
          // console.log('req', req.url);
          // if not demo html, next it.
          if (req.url?.match(/^\/~demos\/(\w+)\.html/)) {
            const demoName = RegExp.$1;
            // console.log('接到 demo iframe 请求', demoName);
            const demos = JSON.parse(readFileSync(__dirname + '/demos.json', 'utf-8'));
            const meta = demos[demoName];
            if (!meta?.entry) {
              res.statusCode = 404;
              res.end('not found');
              return;
            }
            meta.title = meta.title || demoName;
            // todo support html file
            let content = genHtml(meta);
            content = await server.transformIndexHtml?.(req.url, content, req.originalUrl);
            res.end(content);
          } else {
            await next();
          }
        });
      };
    },
    /** for build */
    // closeBundle() {
    //   console.log('closeBundle', process.env.NODE_ENV);
    // },
  };
}
