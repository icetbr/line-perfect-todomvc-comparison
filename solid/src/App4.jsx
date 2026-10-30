import { createSignal, createEffect, For, Show } from 'solid-js';
import { createMutable } from 'solid-js/store';

const STORAGE_KEY = "todos-solidjs";

const state = createMutable({
  filter: "all",
  editingIndex: null,
  todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
});

createEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos)));

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
};

const filteredTodos = () => filters[state.filter](state.todos);
const remainingCount = () => state.todos.filter((todo) => !todo.completed).length;

const clearCompleted = () => state.todos = filters.active(state.todos);
const toggleAll = (event) => state.todos.forEach((todo) => todo.completed = event.target.checked);
const remove = (index) => state.todos.splice(index, 1);
const edit = (index) => state.editingIndex = index;
const cancel = () => state.editingIndex = null;
const create = (title) => state.todos.push({ id: Date.now(), title, completed: false });
const updateView = () => state.filter = location.hash.slice(2) || "all";
const update = (title) => {
  if (title) {
    state.todos[state.editingIndex].title = title;
  } else {
    remove(state.editingIndex);
  }
  state.editingIndex = null;
};

window.addEventListener("hashchange", updateView);
updateView();

export default function TodoApp() {
  return (
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input
          class="new-todo"
          autofocus
          placeholder="What needs to be done?"
          required
          pattern=".*\S+.*"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target.checkValidity()) {
              create(e.target.value.trim());
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') e.target.value = '';
          }}
        />
      </header>
      <Show when={state.todos.length > 0}>
        <section class="main">
          <input
            id="toggle-all"
            class="toggle-all"
            type="checkbox"
            checked={!remainingCount()}
            onChange={toggleAll}
          />
          <label for="toggle-all">Mark all as complete</label>
          <ul class="todo-list">
            <For each={filteredTodos()}>
              {(todo, index) => (
                <li
                  class="todo"
                  classList={{
                    completed: todo.completed,
                    editing: state.editingIndex === index()
                  }}
                >
                  <div class="view">
                    <input
                      class="toggle"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={(e) => todo.completed = e.target.checked}
                    />
                    <label onDblClick={() => edit(index())}>{todo.title}</label>
                    <button class="destroy" onClick={() => remove(index())}></button>
                  </div>
                  <Show when={state.editingIndex === index()}>
                    <input
                      class="edit"
                      value={todo.title}
                      ref={(el) => el.focus()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') update(e.target.value.trim());
                        if (e.key === 'Escape') cancel();
                      }}
                      onBlur={(e) => update(e.target.value.trim())}
                    />
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </section>
      </Show>
      <Show when={state.todos.length > 0}>
        <footer class="footer">
          <span class="todo-count">
            <strong>{remainingCount()}</strong> {remainingCount() === 1 ? "item" : "items"} left
          </span>
          <ul class="filters">
            <li><a href="#/all" classList={{ selected: state.filter === 'all' }}>All</a></li>
            <li><a href="#/active" classList={{ selected: state.filter === 'active' }}>Active</a></li>
            <li><a href="#/completed" classList={{ selected: state.filter === 'completed' }}>Completed</a></li>
          </ul>
          <Show when={remainingCount() === 0}>
            <button class="clear-completed" onClick={clearCompleted}>Clear completed</button>
          </Show>
        </footer>
      </Show>
    </section>
  );
}
