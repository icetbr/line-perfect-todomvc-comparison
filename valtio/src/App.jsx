import { proxy, useSnapshot } from 'valtio';
import { useEffect, useRef } from 'react';

const STORAGE_KEY = "todos-react";

const state = proxy({
  filter: "all",
  editingIndex: null,
  todos: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
});

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

function EditInput({ todo, index }) {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <input
      ref={inputRef}
      className="edit"
      defaultValue={todo.title}
      onKeyDown={(e) => {
        if (e.key === 'Enter') update(e.target.value.trim());
        if (e.key === 'Escape') cancel();
      }}
      onBlur={(e) => update(e.target.value.trim())}
    />
  );
}

export default function TodoApp() {
  const snap = useSnapshot(state);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snap.todos));
  }, [snap.todos]);

  useEffect(() => {
    window.addEventListener("hashchange", updateView);
    updateView();
    return () => window.removeEventListener("hashchange", updateView);
  }, []);

  return (
    <section className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          autoFocus
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
      {snap.todos.length > 0 && (
        <section className="main">
          <input
            id="toggle-all"
            className="toggle-all"
            type="checkbox"
            checked={!remainingCount()}
            onChange={toggleAll}
          />
          <label htmlFor="toggle-all">Mark all as complete</label>
          <ul className="todo-list">
            {filteredTodos().map((todo, index) => (
              <li
                key={todo.id}
                className={`todo ${todo.completed ? 'completed' : ''} ${snap.editingIndex === index ? 'editing' : ''}`}
              >
                <div className="view">
                  <input
                    className="toggle"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={(e) => {
                      state.todos[index].completed = e.target.checked;
                    }}
                  />
                  <label onDoubleClick={() => edit(index)}>{todo.title}</label>
                  <button className="destroy" onClick={() => remove(index)}></button>
                </div>
                {snap.editingIndex === index && (
                  <EditInput todo={todo} index={index} />
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {snap.todos.length > 0 && (
        <footer className="footer">
          <span className="todo-count">
            <strong>{remainingCount()}</strong> {remainingCount() === 1 ? "item" : "items"} left
          </span>
          <ul className="filters">
            <li><a href="#/all" className={snap.filter === 'all' ? 'selected' : ''}>All</a></li>
            <li><a href="#/active" className={snap.filter === 'active' ? 'selected' : ''}>Active</a></li>
            <li><a href="#/completed" className={snap.filter === 'completed' ? 'selected' : ''}>Completed</a></li>
          </ul>
          {remainingCount() === 0 && (
            <button className="clear-completed" onClick={clearCompleted}>Clear completed</button>
          )}
        </footer>
      )}
    </section>
  );
}
