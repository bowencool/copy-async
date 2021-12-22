import { defineComponent, ref } from 'vue';
import copy from '..';

export default defineComponent({
  setup() {
    const domRef = ref();

    return () => (
      <>
        <fieldset>
          <legend>选中区域</legend>
          <div ref={domRef}>
            <h1>标题</h1>
            <i>斜体</i>
            <img src="https://dummyimage.com/60x30/92cbff/fff" alt="img" />
          </div>
        </fieldset>
        <button
          onClick={async function onClick() {
            try {
              await copy(domRef.value);
              alert('复制成功');
            } catch (error: any) {
              alert(error?.message);
            }
          }}
        >
          复制
        </button>
        <button
          onClick={async function onClick() {
            try {
              await copy(domRef.value, { html: true });
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
