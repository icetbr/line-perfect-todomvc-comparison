<template lang="pug">
  div Posts +each('posts as post') a(href="{post.url}") {post.title}
</template>

<script lang="ts">
  export const hello: string = 'world';
</script>

<style src="./style.scss"></style>

<input class="toggle" type="checkbox" checked={todo.completed} onchange={e => toggle(index, e.target.checked)} />
