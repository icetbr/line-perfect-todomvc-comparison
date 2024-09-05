import { createMemo, createEffect, onCleanup } from "solid-js";
import { createStore } from "solid-js/store";

const setFocus = (el) => setTimeout(() => el.focus());

export default () => {
  const STORAGE_KEY = "todos-solid";

  const [filter, setfilter] = createSignal("all");
  const [editingIndex, setEditingIndex] = createSignal(null);
  const [todos, setTodos] = createStore(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  createEffect(() => localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)));

  const filters = {
    all: (todos) => todos,
    active: (todos) => todos.filter((todo) => !todo.completed),
    completed: (todos) => todos.filter((todo) => todo.completed)
  };

  const filterTodos = () => filters[filter()](todos());
  const remainingCount = createMemo(() => filters.active(todos).length);

  const clearCompleted = ()      => setTodos((t) => todos = filters.active(todos));
  const toggleAll      = (checked) => setTodos((todo) => todo.completed = checked);
  const toggle         = (toggleIndex, checked) => setTodos(todos().map((todo, index) => index === toggleIndex ? { ...todo, completed: checked } : todo));
  const remove         = (index) => setTodos((t) => t.filter((item) => item.id !== todoId))
  const edit           = (index) => setEditingIndex(todoId);
  const cancel         = ()      => setEditingIndex();
  const create         = (title) => setTodos([...todos(), { id: Date.now(), title, completed: false }]);
  const updateView     = ()      => setState("filter", location.hash.slice(2) || "all");// filter = location.hash.slice(2) || "all";
  const update         = (title) => setState("todos", (item) => item.id === todo.id, todo),//(title ? todos[editingIndex].title = title : remove(editingIndex), editingIndex = null);

  window.addEventListener("hashchange", updateView);
  onCleanup(() => window.removeEventListener("hashchange", updateView));

  return (
    <section class="todoapp">
      <header class="header">
        <h1>todos</h1>
        <input class="new-todo" autofocus placeholder="What needs to be done?" required pattern=".*\S+.*"
          onkeydown={e => e.key ==='Enter' && e.target.checkValidity() && create(e.target.value.trim())}
          onkeyup={e => e.key ==='Enter' ? e.target.value = '' : ''}>
      </header>

      <Show when={todos().length}>
        <section class="main">
          <input id="toggle-all" class="toggle-all" type="checkbox" checked={!remainingCount()} onchange={e => toggleAll(e.target.checked)}>
          <label for="toggle-all">Mark all as complete</label>

          <ul class="todo-list">
            <For each={filterTodos()}>
              {(todo, index) => (
                <li class="todo" classList={{ completed: todo.completed, editing: editingIndex() === index }}>

                  <div class="view">
                    <input class="toggle" type="checkbox" checked={todo.completed} onchange={e => toggle(index, e.target.checked)}>
                    <label ondblclick={[edit, index]}>{todo.title}</label>
                    <button class="destroy" onclick={[remove, index]} />
                  </div>

                  <Show when={editingIndex() === index}>
                    <input class="edit" value={todo.title} use:setFocus
                      onkeydown={e =>
                        e.key ==='Enter' ? update(e.target.value.trim()) :
                        e.key ==='Escape' && cancel()}
                      onblur={e => update(e.target.value.trim())}>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </section>

        <footer class="footer">
          <span class="todo-count">
            <strong>{remainingCount()}</strong>{" "}{remainingCount() === 1 ? " item " : " items "} left
          </span>
          <ul class="filters">
            <li><a href="#/all" classList={{selected: filter() === 'all'}}>All</a></li>
            <li><a href="#/active" classList={{selected: filter() 'active'}>Active</a></li>
            <li><a href="#/completed" classList={{selected: filter() 'completed'}>Completed</a></li>
          </ul>
          <Show when={remainingCount()}>
            <button class="clear-completed" onclick={clearCompleted}>Clear completed</button>
          </Show>
        </footer>
      </Show>
    </section>
  );
};
