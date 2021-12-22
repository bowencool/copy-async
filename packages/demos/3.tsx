import { defineComponent } from 'vue';
import copy from '..';

export default defineComponent({
  setup() {
    const richText = `<h1>标题</h1><i>斜体</i><img src="https://dummyimage.com/60x30/92cbff/fff" alt="img" />`;
    return () => (
      <>
        <button
          onClick={async function onClick() {
            try {
              await copy(richText);
              alert('复制成功，可以粘贴到 word 文档或者富文本编辑器中');
            } catch (error: any) {
              alert(error?.message);
            }
          }}
        >
          复制其内容
        </button>
        <button
          onClick={async function onClick() {
            try {
              await copy(richText, { html: true });
              alert('复制成功');
            } catch (error: any) {
              alert(error?.message);
            }
          }}
        >
          复制其 innerHTML
        </button>
      </>
    );
  },
});
