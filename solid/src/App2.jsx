import { createSignal, createEffect, For, Show } from 'solid-js';

const STORAGE_KEY = "todos-solidjs";

const [filter, setFilter] = createSignal("all");
const [editingIndex, setEditingIndex] = createSignal(null);
const [todos, setTodos] = createSignal(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

createEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos())));

const filters = {
  all: (todos) => todos,
  active: (todos) => todos.filter((todo) => !todo.completed),
  completed: (todos) => todos.filter((todo) => todo.completed)
};

const filteredTodos = () => filters[filter()](todos());
const remainingCount = () => todos().filter((todo) => !todo.completed).length;

const clearCompleted = () => setTodos(filters.active(todos()));
const toggleAll = (event) => setTodos(todos().map(todo => ({ ...todo, completed: event.target.checked })));
const remove = (index) => setTodos(todos().filter((_, i) => i !== index));
const edit = (index) => setEditingIndex(index);
const cancel = () => setEditingIndex(null);
const create = (title) => setTodos([...todos(), { id: Date.now(), title, completed: false }]);
const updateView = () => setFilter(location.hash.slice(2) || "all");
const update = (title) => {
  if (title) {
    setTodos(todos().map((todo, i) => i === editingIndex() ? { ...todo, title } : todo));
  } else {
    remove(editingIndex());
  }
  setEditingIndex(null);
};

window.addEventListener("hashchange", updateView);
updateView();

function toggleTodo(index) {
  setTodos(todos().map((todo, i) => i === index ? { ...todo, completed: !todo.completed } : todo));
}

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
      <Show when={todos().length > 0}>
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
                    editing: editingIndex() === index()
                  }}
                >
                  <div class="view">
                    <input
                      class="toggle"
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(index())}
                    />
                    <label onDblClick={() => edit(index())}>{todo.title}</label>
                    <button class="destroy" onClick={() => remove(index())}></button>
                  </div>
                  <Show when={editingIndex() === index()}>
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
      <Show when={todos().length > 0}>
        <footer class="footer">
          <span class="todo-count">
            <strong>{remainingCount()}</strong> {remainingCount() === 1 ? "item" : "items"} left
          </span>
          <ul class="filters">
            <li><a href="#/all" classList={{ selected: filter() === 'all' }}>All</a></li>
            <li><a href="#/active" classList={{ selected: filter() === 'active' }}>Active</a></li>
            <li><a href="#/completed" classList={{ selected: filter() === 'completed' }}>Completed</a></li>
          </ul>
          <Show when={remainingCount() === 0}>
            <button class="clear-completed" onClick={clearCompleted}>Clear completed</button>
          </Show>
        </footer>
      </Show>
    </section>
  );
}
