<ul>
  <li v-for="{ id, text } in items" :key="id">
    {{ text }}
  </li>
</ul>
##############################
ul
  li v-for="{ id, text } in items" :key="id"
    {{ text }}

##############################
<ul>
  {items.value.map(({ id, text }) => {
    return <li key={id}>{text}</li>
  })}
</ul>
##############################
ul
  for {id, text} of items
    li key={id} {text}

##############################
tag Items
	<self>
		<ul> for item in items
			<li> item
##############################
<ul> for item in items
  <li> item

##############################
<ul> {#each items as item (item)}
  <li>{color}




export default function Colors() {
  const colors = ["red", "green", "blue"];
  return (
    <ul>
      {colors.map((color) => (
        <li key={color}>{color}</li>
      ))}
    </ul>
  );
}
##############################
<template>
    <render />

<script setup>
    { message } = defineProps(["message"]);
    render = () =>
        div('render-card', [
            header('card-header card-header-title', message)

<template>
  <div class="render-card">
    <header class="card-header card-header-title">{{ message }}

<script setup>
  const { message } = defineProps(["message"]);
