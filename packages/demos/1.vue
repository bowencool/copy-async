<template>
  <button @click="onClick">点击复制</button>
</template>

<script lang="ts" setup>
  import copy from '..';

  async function onClick() {
    try {
      await copy('hello world');
      alert('复制成功');
    } catch (error: any) {
      alert(error?.message);
    }
  }
</script>
