export type CopyOptions = {
  /**
   * @description 当传入 string 时，复制原始 html 字符串。
   * @description 当传入 HTMLElement 时，复制其 innerHTML
   * @description 默认 false，普通字符串无差别。
   * */
  html?: boolean;
};

/**
 * @description copy，一个promise化的拷贝函数，支持传入文本、dom
 */
export async function copy(textOrElement: string | HTMLElement, options?: CopyOptions): Promise<void> {
  let dom: HTMLElement;
  if (typeof textOrElement === 'number') {
    textOrElement = String(textOrElement);
  }
  if (typeof textOrElement === 'string') {
    dom = document.createElement('div');
    if (options?.html) {
      // console.log('set innerText');
      dom.innerText = textOrElement;
    } else {
      // console.log('set innerHTML');
      dom.innerHTML = textOrElement;
    }
  } else if (textOrElement instanceof HTMLElement) {
    if (options?.html) {
      return copy(textOrElement.innerHTML, options);
    }
    dom = textOrElement.cloneNode(true) as HTMLElement;
  } else {
    console.error('legacyCopy 参数错误', textOrElement);
    throw new Error(
      `First params must be string or HTMLElement, but got ${Object.prototype.toString
        .call(textOrElement)
        .slice(8, -1)}`,
    );
  }

  dom.style.whiteSpace = 'pre';
  dom.style.left = '-9999px';
  dom.style.position = 'fixed';
  document.body.appendChild(dom);
  await copyDomContent(dom);
  document.body.removeChild(dom);
}

async function copyDomContent(dom: HTMLElement) {
  const text = select(dom);
  // console.log(dom, text);
  if (typeof document.execCommand === 'function') {
    document.execCommand('copy');
    // console.log('copied by execCommand');
  } else if (navigator.clipboard) {
    // todo 无法在普通input粘贴；带图片会报错
    // await navigator.clipboard.write([
    //   new ClipboardItem({ 'text/html': Promise.resolve(new Blob([dom.innerHTML], { type: 'text/html' })) }),
    // ]);
    // console.log('copied by navigator.clipboard.write');
    await navigator.clipboard.writeText(text);
    // console.log('copied by navigator.clipboard.writeText');
  }
  window.getSelection()?.removeAllRanges();
}

function select(element: HTMLElement) {
  let selectedText;
  if (element instanceof HTMLSelectElement) {
    element.focus();
    selectedText = element.value;
  } else if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    const isReadOnly = element.hasAttribute('readonly');
    if (!isReadOnly) {
      element.setAttribute('readonly', '');
    }
    element.select();
    element.setSelectionRange(0, element.value.length);
    if (!isReadOnly) {
      element.removeAttribute('readonly');
    }
    selectedText = element.value;
  } else {
    if (element.hasAttribute('contenteditable')) {
      element.focus();
    }
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(element);
    if (!selection) {
      throw new Error('无法获取当前选择');
    }
    selection.removeAllRanges();
    selection.addRange(range);
    selectedText = selection.toString();
  }
  return selectedText;
}
