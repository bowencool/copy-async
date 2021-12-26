# copy-async

复制文本、富文本到剪切板

# usage

```bash
npm i copy-rich-text
```

```js{3-6}
import copy from 'copy-rich-text';

await copy('hello world');
await copy('<h1>hello world</h1>');
await copy(document.querySelector('#rich-text'));
await copy(document.querySelector('#rich-text'), { html: true });
```

# demos

<demo src="./demos/1.vue" />

<demo src="./demos/3.tsx" title="复制图文内容" />

<demo src="./demos/2.tsx" title="传入 dom" />

# api

<<< es/index.d.ts

<<< es/copy.d.ts

```

```
