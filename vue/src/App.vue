<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" autofocus placeholder="What needs to be done?" required pattern=".*\S+.*"
        @keydown.enter="$event.target.checkValidity() && create($event.target.value.trim())"
        @keyup.enter="$event.target.value = ''">
    </header>

    <section class="main" v-show="todos.length">
      <input id="toggle-all" class="toggle-all" type="checkbox" :checked="!remainingCount" @change="toggleAll" />
      <label for="toggle-all">Mark all as complete</label>

      <ul class="todo-list">
        <li v-for="(todo, index) in filteredTodos" class="todo" :key="todo.id" :class="{ completed: todo.completed, editing: editingIndex === index }">

          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed" />
            <label @dblclick="edit(index)">{{todo.title}}</label>
            <button class="destroy" @click="remove(index)"></button>
          </div>

          <input v-if="editingIndex === index" class="edit" :value="todo.title" @vue:mounted="({ el }) => el.focus()"
            @keydown.enter="update($event.target.value.trim())"
            @keydown.escape="cancel"
            @blur="update($event.target.value.trim())">
        </li>
      </ul>
    </section>

    <footer class="footer" v-show="todos.length">
      <span class="todo-count">
        <strong>{{remainingCount}}</strong> {{remainingCount === 1 ? "item" : "items"}} left
      </span>

      <ul class="filters">
        <li><a href="#/all" :class="{ selected: filter === 'all' }">All</a></li>
        <li><a href="#/active" :class="{ selected: filter === 'active' }">Active</a></li>
        <li><a href="#/completed" :class="{ selected: filter === 'completed' }">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="clearCompleted" v-show="!remainingCount">Clear completed</button>
    </footer>
  </section>
</template>

<script setup>
  import { ref, computed, watchEffect } from "vue";

  const STORAGE_KEY = "todos-vue";

  const filter = ref("all");
  const editingIndex = ref("");
  const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

  watchEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value)));

  const filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter((todo) => !todo.completed),
    completed: (todos) => todos.filter((todo) => todo.completed)
  };

  const filteredTodos = computed(() => filters[filter.value](todos.value));
  const remainingCount = computed(() => todos.value.filter((todo) => !todo.completed).length);

  const clearCompleted = ()      => todos.value = filters.active(todos.value);
  const toggleAll      = (event) => todos.value.forEach((todo) => todo.completed = event.target.checked);
  const remove         = (index) => todos.value.splice(index, 1);
  const edit           = (index) => editingIndex.value = index;
  const cancel         = ()      => editingIndex.value = null;
  const create         = (title) => todos.value.push({ id: Date.now(), title, completed: false });
  const updateView     = ()      => filter.value = location.hash.slice(2) || "all";
  const update         = (title) => (title ? todos.value[editingIndex.value].title = title : remove(editingIndex.value), editingIndex.value = null);

  window.addEventListener("hashchange", updateView);
</script>

